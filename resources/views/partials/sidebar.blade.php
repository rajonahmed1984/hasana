<!-- Sidebar -->
<div class="sidebar-container bg-white" id="sidebar-wrapper">
    <div class="sidebar-logo text-center">
        <a href="{{ route('dashboard')}}">
            <img src="{{ getImage('settings',getInfo('logo'))}}" alt="eBUSI Logo">
        </a>
    </div>
    <div class="list-group list-group-flush my-3">
        <!-- ড্যাশবোর্ড --> 
        <a href="{{ route('dashboard')}}" class="list-group-item list-group-item-action"><i class="fas fa-tachometer-alt me-3"></i>ড্যাশবোর্ড</a>

        <!-- পস (POS) -->
        <a href="{{ route('pos.create')}}" class="list-group-item list-group-item-action"><i class="fas fa-cash-register me-3"></i>পস (POS)</a>

        <!-- ইনভেন্টরি সাবমেনু -->
        <a href="#inventorySubmenu" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-boxes-stacked me-3"></i>ইনভেন্টরি</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="inventorySubmenu">
            <div class="list-group list-group-flush">
                <a href="{{ route('products.index')}}" class="list-group-item list-group-item-action">পণ্যের তালিকা</a>
                <a href="{{ route('categories.index')}}" class="list-group-item list-group-item-action">ক্যাটাগরি</a>
                <a href="{{ route('brands.index')}}" class="list-group-item list-group-item-action">ব্র্যান্ড</a>
                <a href="{{ route('units.index')}}" class="list-group-item list-group-item-action">ইউনিট</a>
                <a href="{{ route('contacts.index')}}" class="list-group-item list-group-item-action">সাপ্লায়ার</a>
                <a href="stock-adjustment.php" class="list-group-item list-group-item-action">স্টক অ্যাডজাস্টমেন্ট</a>
            </div>
        </div>

        <!-- পারচেজ -->
        <a href="{{ route('purchases.index')}}" class="list-group-item list-group-item-action"><i class="fas fa-shopping-cart me-3"></i>পারচেজ</a>

        <!-- বিক্রয় -->
        <a href="{{ route('sells.index')}}" class="list-group-item list-group-item-action"><i class="fas fa-chart-line me-3"></i>বিক্রয়</a>

        <!-- অফার ও গ্রাহক সাবমেনু -->
        <a href="#customerSubmenu" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-users-cog me-3"></i>অফার ও গ্রাহক</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="customerSubmenu">
            <div class="list-group list-group-flush">
                <a href="{{ route('discounts.index')}} " class="list-group-item list-group-item-action">অফার/ডিসকাউন্ট</a>

                <a href="{{ route('getCustomer')}}" class="list-group-item list-group-item-action">গ্রাহক তালিকা</a>
            </div>
        </div>

        <!-- অ্যাকাউন্টিং সাবমেনু -->
        <a href="#accountingSubmenu" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-calculator me-3"></i>অ্যাকাউন্টিং</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="accountingSubmenu">
            <div class="list-group list-group-flush">
                <a href="{{ route('accountingHub')}}" class="list-group-item list-group-item-action">অ্যাকাউন্টিং হাব</a>
                <a href="{{ route('accounts.index')}}" class="list-group-item list-group-item-action">হিসাবের তালিকা</a>
                <a href="{{ route('journal')}}" class="list-group-item list-group-item-action">জাবেদা</a>
                <a href="{{ route('ledger')}}" class="list-group-item list-group-item-action">খতিয়ান</a>
                <a href="{{ route('trailBalance')}}" class="list-group-item list-group-item-action">রেওয়ামিল</a>
            </div>
        </div>
        
        <!-- রিপোর্ট সাবমেনু -->
        <a href="#reportsSubmenu" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-chart-pie me-3"></i>রিপোর্ট</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="reportsSubmenu">
            <div class="list-group list-group-flush">
                <a href="{{ route('reports.hub')}}" class="list-group-item list-group-item-action">রিপোর্ট হাব</a>
                <a href="{{ route('reports.sells')}}" class="list-group-item list-group-item-action">বিক্রয় রিপোর্ট</a>
                <a href="{{ route('reports.profitLoss')}}" class="list-group-item list-group-item-action">লাভ-ক্ষতির রিপোর্ট</a>
                <a href="{{ route('reports.dueSells')}}" class="list-group-item list-group-item-action">বকেয়া রিপোর্ট</a>
                <a href="{{ route('reports.productStock')}}" class="list-group-item list-group-item-action">
                    ইনভেন্টরি রিপোর্ট
                </a>

            </div>
        </div>


        <!-- রিপোর্ট সাবমেনু -->
        <a href="#authorize" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-chart-pie me-3"></i>Authorization</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="authorize">
            <div class="list-group list-group-flush">
                <a href="{{ route('users.index')}}" class="list-group-item list-group-item-action">Users</a>
                <a href="{{ route('roles.index')}}" class="list-group-item list-group-item-action">Roles</a>
                <a href="{{ route('permissions.index')}}" class="list-group-item list-group-item-action">Permissions</a>
                
            </div>
        </div>


        <a href="#setting" data-bs-toggle="collapse" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fas fa-chart-pie me-3"></i>Settings</span><i class="fas fa-chevron-down"></i>
        </a>
        <div class="collapse" id="setting">
            <div class="list-group list-group-flush">
                <a href="{{ route('settings.index')}}" class="list-group-item list-group-item-action">সেটিংস</a>
                <a href="{{ route('reward-settings.index')}}" class="list-group-item list-group-item-action">Reward Setting</a>
                <a href="{{ route('locations.index')}}" class="list-group-item list-group-item-action">Outlet</a>
                
            </div>
        </div>

    </div>
</div>
<!-- /#sidebar-wrapper -->