@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">Reward  Setting</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <!-- Company Information Card -->
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header">
                <h4 class="mb-0"><i class="fas fa-building me-2 accent-text"></i> Reward Setting Manage</h4>
            </div>
            <div class="card-body p-4">
                
                <form action="{{ route('reward-settings.store') }}" method="post"
                    enctype="multipart/form-data" id="ajax_form">
                    @csrf
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group mb-3">
                                <label for="user-name" class="col-form-label">
                                    Amount spend for unit point :
                                </label>
                                <input type="text" placeholder=""
                                    class="form-control" name="amount_per_unit_rp" required
                                    value="{{ $item->amount_per_unit_rp ??'' }}" />
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="form-group mb-3">
                                <label for="airlines-name" class="col-form-label">
                                    Minimum order total to earn reward :
                                </label>
                                <input type="text" class="form-control" step="any" 
                                    name="min_order_amount_rp"
                                    value="{{ $item->min_order_amount_rp ?? '' }}" />
                            </div>
                        </div>
                        <div class="clerfix"></div>
                        <div class="col-4">
                            <div class="form-group mb-3">
                                <label for="airlines-name" class="col-form-label">
                                    Redeem amount per unit point: 
                                </label>
                                <input type="text" class="form-control"
                                    name="redeem_amount_per_unit_rp"
                                    value="{{ $item->redeem_amount_per_unit_rp ?? '' }}" />
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group mb-3">
                                <label for="airlines-name" class="col-form-label">
                                    Minimum order total to redeem points : 
                                </label>
                                <input type="number" class="form-control" step="any" 
                                    name="min_order_total_for_redeem"
                                    value="{{ $item->min_order_total_for_redeem ?? '' }}" />
                            </div>
                        </div>

      

                        <div class="col-4">
                            <div class="form-group mb-3">
                                <label for="airlines-name" class="col-form-label"> Status:
                                </label>
                                <select class="form-select form-control"
                                    style="width: 100%; height: auto;" name="status">
                                    <option value="1"
                                        {{ $item && $item->status == '1' ? 'selected' : '' }}>Active
                                    </option>
                                    <option value="0"
                                        {{ $item && $item->status == '0' ? 'selected' : '' }}>
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary">Save Chenge</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>
@endsection

@push('js')

@endpush