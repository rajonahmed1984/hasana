<!DOCTYPE html>
<html lang="bn">
@include('partials.head')
<body>
    <div class="d-flex" id="wrapper">   
        @include('partials.sidebar')
        @yield('content')
    </div>

    <div class="modal fade" id="common_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    </div>

    <div class="modal fade modal-default" id="print-receipt" aria-labelledby="print-receipt">
        
    </div>
    @include('partials.script')
</body>
</html>
