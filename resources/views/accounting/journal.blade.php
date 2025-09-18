@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">জাবেদা ভাউচার</h2>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-2"></i>ইউজার নেম
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#">প্রোফাইল</a></li>
                        <li><a class="dropdown-item" href="#">লগ আউট</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <!-- Add New Journal Form -->
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white"><h4 class="mb-0"><i class="fas fa-plus-circle me-2 accent-text"></i>নতুন জাবেদা ভাউচার</h4></div>
            <div class="card-body">
                <form id="journalForm">
                    <div class="row">
                        <div class="col-md-4 mb-3"><label for="voucherDate" class="form-label">তারিখ</label><input type="date" class="form-control" id="voucherDate"></div>
                        <div class="col-md-4 mb-3"><label for="voucherNo" class="form-label">ভাউচার নং</label><input type="text" class="form-control" id="voucherNo" placeholder="Auto-generated"></div>
                        <div class="col-md-4 mb-3"><label for="narration" class="form-label">বিবরণ/Narration</label><input type="text" class="form-control" id="narration"></div>
                    </div>
                    <hr>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>অ্যাকাউন্ট</th>
                                    <th class="text-end">ডেবিট</th>
                                    <th class="text-end">ক্রেডিট</th>
                                    <th class="text-center"><button type="button" class="btn btn-sm btn-success" id="add-entry-btn"><i class="fas fa-plus"></i></button></th>
                                </tr>
                            </thead>
                            <tbody id="journal-entries-tbody">
                                <!-- Journal entry rows will be added here -->
                            </tbody>
                            <tfoot>
                                <tr class="fw-bold">
                                    <td class="text-end">মোট:</td>
                                    <td class="text-end" id="total-debit">0.00</td>
                                    <td class="text-end" id="total-credit">0.00</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="text-end mt-3"><button type="submit" class="btn btn-primary">ভাউচার সংরক্ষণ করুন</button></div>
                </form>
            </div>
        </div>

        <!-- Journal List -->
        <div class="card shadow-sm border-0">
             <div class="card-header bg-white">
                <div class="row justify-content-between align-items-center">
                    <div class="col-md-6"><h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>ভাউচার তালিকা</h4></div>
                    <div class="col-md-4"><input type="text" class="form-control" id="listSearchInput" placeholder="ভাউচার নং বা বিবরণ দিয়ে খুঁজুন..."></div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-header-custom">
                            <tr><th>তারিখ</th><th>ভাউচার নং</th><th>বিবরণ</th><th class="text-end">মোট পরিমাণ</th><th class="text-center">অ্যাকশন</th></tr>
                        </thead>
                        <tbody id="journal-list-tbody"></tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="text-muted" id="pagination-info"></div>
                    <nav><ul class="pagination mb-0" id="pagination-container"></ul></nav>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('js')
<script type="text/javascript">
  
</script>
@endpush