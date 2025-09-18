@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">ইউজার তালিকা</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>সকল ইউজার</h4>
                <div>
                    <a class="btn btn-primary btn_modal" href="{{ route('users.create')}}">
                        <i class="fas fa-plus-circle me-2"></i>নতুন ইউজার যোগ করুন
                    </a>
                </div>
            </div>

            <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                <div class="search-set">
                    <div class="search-input">
                        <input type="text" id="search" class="form-control" placeholder="search"> 
                    </div>
                </div>
                
            </div>
            
            <div class="card-body" id="data">
                <div class="table-responsive">
                    <table class="table table-bordered">
                       <tr>
                           <th>Image</th>
                           <th>Name</th>
                           <th>Email</th>
                           <th>Phone</th>
                           <th>Address</th>
                           <th>Roles</th>
                           <th width="280px">Action</th>
                       </tr>
                       @foreach ($items as $key => $user)
                        <tr>
                            <td>
                                <img width="60" src="{{ getImage('users', $user->image)}}">
                            </td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>{{ $user->phone }}</td>
                            <td>{{ $user->address }}</td>
                            <td>
                              @if(!empty($user->getRoleNames()))
                                @foreach($user->getRoleNames() as $v)
                                   <label class="badge bg-success">{{ $v }}</label>
                                @endforeach
                              @endif
                            </td>
                            <td class="action-table-data">
                                <div class="edit-delete-action">
                                    <a class="me-2 p-2 btn_modal" href="{{ route('users.edit',[$user->id])}}">
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a  href="{{ route('users.destroy',[$user->id])}}" class="delete">
                                        <i class="fa fa-trash"></i>
                                    </a>
                                </div>
                                
                            </td>
                        </tr>
                     @endforeach
                    </table>

                    {!! $items->links() !!}
                </div>
            </div>
        </div>
    </div>
</div>

@endsection