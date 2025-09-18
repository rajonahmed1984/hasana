<?php
namespace App\Utils;

use App\Models\SmsSetting;
use App\Models\Subscription;
use App\Models\Customer;
use App\Models\RewardSetting;
use App\Models\NotificationTamplate;
use App\Models\Business;
use Illuminate\Support\Facades\Http;

class Util {

    public function createSellInvoice(){

        $invoice = InvoiceCount::first();
        if ($invoice) {
            $number = $invoice->sell_count + 1;
        } else {
            $invoice = new InvoiceCount();
            $invoice->sell_count = 0;
        }

        $invoice->sell_count += 1;
        $invoice->save();

        return true;
    }
    
    public function customerReward($sell){
        $item = RewardSetting::where('status',1)->first();
        if ($sell->reddem_point ==0 && $item){

            $reward_point=0;
            if($item->min_order_amount_rp <= $sell->final_amount){
                $reward_point=$sell->final_amount / $item->amount_per_unit_rp;
            }
            $reward_point=floor($reward_point);


            if($reward_point>0){
                $sell->reward_point=$reward_point;
                $sell->save();
            }
        }

        return true;
        
    }

    public function sendSms($business_id,$number,$message){


        $item=SmsSetting::where('business_id',$business_id)->first();

        if($item){
            if($item->country_code){
                $number=$item->country_code.$number;
            }
            
            if($item->method=='get'){
                
                $response = Http::get($item->url, [
                    $item->send_to=>$number,
                    $item->message=>$message,
                    $item->key_1=>$item->key_value_1,
                    $item->key_2=>$item->key_value_2,
                    $item->key_3=>$item->key_value_3,
                    $item->key_4=>$item->key_value_4,
                ]);

            }else if($item->method=='post'){

                $response = Http::post($item->url, [
                    $item->send_to=>$number,
                    $item->message=>$message,
                    $item->key_1=>$item->key_value_1,
                    $item->key_2=>$item->key_value_2,
                    $item->key_3=>$item->key_value_3,
                    $item->key_4=>$item->key_value_4,
                ]);
            }
            return $response->successful();
        }
    
    }




    

    public function transactionStatus($order){
        if ($order) {
            $due=$order->amount - $order->payments()->sum('amount');
            if ($due==0) {
                $status='paid';
            }else if($due ==$order->amount){
                $status='due';
            }else{
                $status='partial';
            }

            $order->payment_status=$status;
            $order->save();
        }
        return true;
    }

    public function sendNotification($business_id, $transaction, $type){


        
        $template=NotificationTamplate::where([
                'business_id'=>$business_id,
                'type'=>$type,
            ])->first();
        $type_array = array("order", "sell", "order_receive", "order_deliver","receive_not_delivery");
        
        if ($template) {
            $message=$template->body;
                $number='';
            if($type=='salary_payment'){
                    if($transaction->employee){
                        $number=$transaction->employee->phone;
                    }

                }else if($type=='payment'){
                    if($transaction->worker){
                        $number=$transaction->worker->phone;
                    }else if($transaction->employee){
                        $number=$transaction->employee->phone;
                    }

                }else if(in_array($type,$type_array)) {
                    
                    if($transaction->contact){
                        $number = $transaction->contact->phone;
                    }
                    
                
                }else if($type=='worker_assign'){

                    if($transaction->worker){
                        $number=$transaction->worker->phone;
                    }

                }else if($type=='master_assign'){
                   
                    if($transaction->employee){
                        $number=$transaction->employee->phone;
                    }

                }

            $number = $number;
            $message=$this->replaceTags($business_id,$message,$transaction,$type);          
            $this->sendSms($business_id,$number,$message);
        }

    }

    public function replaceTags($business_id, $message,$transaction,$type){
        

        $type_array = array("order", "sell", "order_receive", "order_deliver","receive_not_delivery");
            $business = Business::findOrFail($business_id);
             //Replace contact name
            if (strpos($message, '{contact_name}') !== false) {
                $contact_name='';

                if($type=='salary_payment'){
                    if($transaction->employee){
                        $contact_name=$transaction->employee->name;
                    }
                    

                    if (strpos($message, '{total_payment}') !== false) {
                       $total_payment = $transaction->amount;
                       $message = str_replace('{total_payment}', $total_payment, $message);
                  }

                  if (strpos($message, '{date}') !== false) {
                        $date = $transaction->date;
                        $message = str_replace('{date}', $date, $message);
                  }

                  if (strpos($message, '{due}') !== false) {
                       $employee=$transaction->employee;
                       $due=$employee->salary- $employee->thismonth->sum('amount') - $employee->prvmonth->sum('amount');
                       $message = str_replace('{due}', $due, $message);
                  }

                  if (strpos($message, '{advance}') !== false) {
                       $employee=$transaction->employee;
                       $advance=$employee->prvmonth->sum('amount');
                       $message = str_replace('{advance}', $advance, $message);
                  }


                }else if($type=='payment'){
                    if($transaction->worker){
                        $contact_name=$transaction->worker->name;
                    }else if($transaction->employee){
                        $contact_name=$transaction->employee->name;
                    }else if($transaction->contact){
                        $contact_name=$transaction->contact->name;
                    }
                    

                    if (strpos($message, '{total_payment}') !== false) {
                       $total_payment = $transaction->amount;
                       $message = str_replace('{total_payment}', $total_payment, $message);
                  }

                  if (strpos($message, '{date}') !== false) {
                        $date = $transaction->date;
                        $message = str_replace('{date}', $date, $message);
                  }

                }else if(in_array($type,$type_array)) {

                    $contact_name = $transaction->contact->name;
                    if (strpos($message, '{invoice_no}') !== false) {
                        $invoice_no = $transaction->invoice_no;
                        $message = str_replace('{invoice_no}', $invoice_no, $message);
                    }

                    if (strpos($message, '{total_amount}') !== false) {
                        $total_amount = $transaction->amount;
                        $message = str_replace('{total_amount}', $total_amount, $message);
                    }

                    if (strpos($message, '{total_payment}') !== false) {
                        $total_payment = $transaction->payments->sum('amount');
                        $message = str_replace('{total_payment}', $total_payment, $message);
                    }

                    if (strpos($message, '{due}') !== false) {
                        $due = $transaction->amount - $transaction->payments->sum('amount');
                        $message = str_replace('{due}', $due, $message);
                    }

                    
                    
                    if (strpos($message, '{date}') !== false) {
                        $date = $transaction->date;
                        $message = str_replace('{date}', $date, $message);
                    }
                    
                    if (strpos($message, '{delivery_date}') !== false) {
                        $delivery_date = $transaction->delivery_date;
                        $message = str_replace('{delivery_date}', $delivery_date, $message);
                    }
                    
                }else if($type=='worker_assign'){

                    if($transaction->worker){
                        $contact_name=$transaction->worker->name;
                    }

                    if (strpos($message, '{category_name}') !== false) {
                        $category_name=($transaction->order_category && $transaction->order_category->category) ? $transaction->order_category->category->name:'';
                        $message = str_replace('{category_name}', $category_name, $message);
                    }

                    if (strpos($message, '{total_amount}') !== false) {
                        $total_amount = $transaction->amount;
                        $message = str_replace('{total_amount}', $total_amount, $message);
                    }

                    if (strpos($message, '{date}') !== false) {
                        $date = date('d.m.Y');
                        $message = str_replace('{date}', $date, $message);
                    }

                    if (strpos($message, '{quantity}') !== false) {
                        $quantity=$transaction->quantity;
                        $message = str_replace('{quantity}', $quantity, $message);
                    }

                    if (strpos($message, '{invoice_no}') !== false) {
                        $invoice_no=$transaction->order_category->order->invoice_no;
                        $message = str_replace('{invoice_no}', $invoice_no, $message);
                    }
                }else if($type=='master_assign'){

                    if($transaction->employee){
                        $contact_name=$transaction->employee->name;
                    }

                    if (strpos($message, '{category_name}') !== false) {
                        $category_name=($transaction->order_category && $transaction->order_category->category) ? $transaction->order_category->category->name:'';
                        $message = str_replace('{category_name}', $category_name, $message);
                    }

                    if (strpos($message, '{total_amount}') !== false) {
                        $total_amount = $transaction->amount;
                        $message = str_replace('{total_amount}', $total_amount, $message);
                    }

                    if (strpos($message, '{date}') !== false) {
                        $date = date('d.m.Y');
                        $message = str_replace('{date}', $date, $message);
                    }

                    if (strpos($message, '{quantity}') !== false) {
                        $quantity=$transaction->quantity;
                        $message = str_replace('{quantity}', $quantity, $message);
                    }

                    if (strpos($message, '{invoice_no}') !== false) {
                        $invoice_no=$transaction->order_category->order->invoice_no;
                        $message = str_replace('{invoice_no}', $invoice_no, $message);
                    }
                }

                $message = str_replace('{contact_name}', $contact_name, $message);
                
            }
        

        return $message;
    }




}