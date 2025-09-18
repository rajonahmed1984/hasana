@extends('layouts.app')

@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">নতুন রোল</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">

            <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                <div class="search-set">
                    <div class="search-input">
                        <input type="text" id="search" class="form-control" placeholder="search"> 
                    </div>
                </div>
                
            </div>
            
            <div class="card-body" id="data">
                <form method="POST" action="{{ route('roles.store') }}">
                    @csrf
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <div class="form-group">
                                <strong>Name:</strong>
                                <input type="text" name="name" placeholder="Name" class="form-control">
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <div class="form-group">
                                <strong>Permission:</strong>
                                <br/>
                                @foreach($permission as $value)
                                    <label><input type="checkbox" name="permission[{{$value->id}}]" value="{{$value->id}}" class="name">
                                    {{ $value->name }}</label>
                                <br/>
                                @endforeach
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                            <button type="submit" class="btn btn-primary btn-sm mb-3"><i class="fa-solid fa-floppy-disk"></i> Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


@endsection