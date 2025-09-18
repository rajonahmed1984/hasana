<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POS সিস্টেম - eBUSI</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    <!-- Custom POS CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
    
    <link rel="stylesheet" href="{{ asset('assets/css/supershop-pos.css')}}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css" integrity="sha512-TFee0335YRJoyiqz8hA8KV3P0tXa5CpRBSoM0Wnkn7JoJx1kaq1yXL/rb8YFpWXkMOjRcv5txv+C6UluttluCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>
<body>
    <div class="pos-wrapper">
        <!-- Main Header -->
        <header class="pos-header">
            <div class="header-left">
                <a href="{{ route('dashboard')}}" class="header-brand">
                    <img src="{{ asset('assets/logo.png')}}" alt="eBUSI Logo">
                </a>
            </div>

            <div class="header-center">
                <div class="input-group"> 
                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                    <input type="text" class="form-control" id="cus_name" placeholder="গ্রাহক খুঁজুন...">
                    <input type="mobile" class="form-control" id="cus_mobile" placeholder="গ্রাহক মোবাইল...">
                    <input type="points" class="form-control" id="cus_point" placeholder="0" style="width: 1px; flex: 0.5 auto;">
                    <input type="amount" class="form-control" placeholder="0.00" style="width: 1px; flex: 0.5 auto;">
                </div>
            </div>

            <div class="header-right">
                <button class="btn btn-outline-secondary" id="hold-bill-btn"><i class="fas fa-hand-paper me-2"></i>হোল্ড</button>
                <button class="btn btn-outline-secondary" id="recall-bill-btn" data-bs-toggle="modal" data-bs-target="#recallModal"><i class="fas fa-history me-2"></i>রিকল বিল</button>
                <button class="btn btn-danger" id="cancel-sale-btn"><i class="fas fa-times me-2"></i>বিক্রয় বাতিল</button>
                <a href="{{ route('sells.index')}}" class="btn btn-outline-secondary"><i class="fas fa-list-ul me-2"></i>বিক্রয় তালিকা</a>
            </div>
        </header>

        <!-- Main Content --> 
        @yield('pos_content')
    </div>

    <!-- Modals -->
    <!-- Payment Modal -->
    

    <!-- Recall Bill Modal -->
    <div class="modal fade" id="recallModal" tabindex="-1" aria-labelledby="recallModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="recallModalLabel">হোল্ড করা বিলের তালিকা</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="held-bills-list"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stock Check Modal -->
    <div class="modal fade" id="stockCheckModal" tabindex="-1" aria-labelledby="stockCheckModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="stockCheckModalLabel">পণ্যের স্টক প্রাপ্যতা</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="stock-check-modal-body"></div>
            </div>
        </div>
    </div>

    <!-- Print Receipt Modal -->
    <div class="modal fade" id="printReceiptModal" tabindex="-1" aria-labelledby="printReceiptModalLabel" aria-hidden="true">
    </div>

    <!-- JS Files -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="{{ asset('assets/js/supershop-pos.js')}}"></script>

    @stack('js')
</body>
</html>
