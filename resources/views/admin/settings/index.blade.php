@extends('admin.layouts.app')

@section('title', 'সিস্টেম সেটিংস ও ব্র্যান্ড লোগো | Hasana Admin')
@section('page_title', 'সিস্টেম সেটিংস')
@section('page_subtitle', 'ওয়েবসাইট ও অ্যাপ্লিকেশনের ব্র্যান্ডিং, লোগো এবং সার্বিক কনফিগারেশন')

@section('content')
<div class="settings-container">
    @if(session('success'))
        <div class="settings-alert settings-alert-success">
            <i class="fa-solid fa-circle-check" style="font-size: 18px;"></i>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    @if($errors->any())
        <div class="settings-alert settings-alert-danger">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 18px;"></i>
            <div>
                <strong>ত্রুটি:</strong>
                <ul style="margin: 4px 0 0 16px; padding: 0;">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.settings.update') }}" enctype="multipart/form-data" id="settingsForm">
        @csrf
        @method('PUT')

        <input type="hidden" name="remove_logo" id="removeLogoInput" value="0">

        <div class="settings-grid">
            <!-- Left Column: Brand Logo Management -->
            <div class="settings-card">
                <div class="settings-card-header">
                    <div class="settings-card-title-group">
                        <div class="settings-card-icon">
                            <i class="fa-solid fa-palette"></i>
                        </div>
                        <div>
                            <h2 class="settings-card-title">ব্র্যান্ড লোগো ব্যবস্থাপনা</h2>
                            <p class="settings-card-subtitle">অ্যাপ্লিকেশন ও ওয়েবসাইটের মূল লোগো আপলোড ও প্রিভিউ</p>
                        </div>
                    </div>
                </div>

                <div class="settings-card-body">
                    <!-- Live Logo Preview Stage -->
                    <div class="logo-stage">
                        <div class="logo-stage-header">
                            <span class="logo-stage-label" id="previewStatusLabel">
                                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> বর্তমান লোগো
                            </span>
                            <div class="logo-stage-switcher" title="লাইট ও ডার্ক ব্যাকগ্রাউন্ডে লোগো প্রিভিউ দেখুন">
                                <button type="button" class="logo-preview-toggle active" data-preview-theme="light">
                                    <i class="fa-solid fa-sun"></i> লাইট
                                </button>
                                <button type="button" class="logo-preview-toggle" data-preview-theme="dark">
                                    <i class="fa-solid fa-moon"></i> ডার্ক
                                </button>
                            </div>
                        </div>

                        <div class="logo-display-box theme-light" id="logoDisplayBox">
                            <img src="{{ logo_url() }}" alt="Hasana Logo" class="logo-display-img" id="mainLogoPreview">
                        </div>
                    </div>

                    <!-- Selected File Pill (Shown when new file picked) -->
                    <div class="selected-file-pill" id="selectedFilePill">
                        <div class="selected-file-name">
                            <i class="fa-solid fa-image"></i>
                            <span id="selectedFileName">logo.png</span>
                            <span class="spec-badge" id="selectedFileSize">0 KB</span>
                        </div>
                        <button type="button" class="btn-remove-selected" id="btnCancelNewLogo" title="নির্বাচন বাতিল করুন">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Interactive Drag-and-Drop Dropzone -->
                    <div class="logo-dropzone" id="logoDropzone">
                        <input type="file" id="logoFileInput" name="logo" accept=".svg,.png,.jpg,.jpeg,.webp" style="display: none;">
                        <div class="dropzone-icon">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <h4 class="dropzone-title">নতুন লোগো আপলোড করতে ক্লিক করুন</h4>
                        <p class="dropzone-desc">অথবা ফাইলটি টেনে এনে (Drag & Drop) এখানে ছেড়ে দিন</p>
                        
                        <div class="dropzone-specs">
                            <span class="spec-badge">SVG (সুপারিশকৃত)</span>
                            <span class="spec-badge">PNG (স্বচ্ছ ব্যাকগ্রাউন্ড)</span>
                            <span class="spec-badge">WEBP</span>
                            <span class="spec-badge">JPG</span>
                            <span class="spec-badge">সর্বোচ্চ ৩ MB</span>
                        </div>
                    </div>

                    <!-- Reset to default logo action -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
                        <small class="form-helper" style="margin: 0;">লোগো পরিবর্তন করলে সাইডবার, হেডার ও অ্যাপে স্বয়ংক্রিয়ভাবে আপডেট হবে।</small>
                        <button type="button" class="btn-secondary" id="btnResetDefaultLogo" style="font-size: 12.5px; padding: 6px 12px;">
                            <i class="fa-solid fa-rotate-left"></i> ডিফল্ট লোগোতে ফিরুন
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: General Information & System Status -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <!-- General Info Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <div class="settings-card-title-group">
                            <div class="settings-card-icon">
                                <i class="fa-solid fa-sliders"></i>
                            </div>
                            <div>
                                <h2 class="settings-card-title">সাধারণ তথ্য ও পরিচিতি</h2>
                                <p class="settings-card-subtitle">সাইটের শিরোনাম, ভাষা ও ব্র্যান্ড নাম</p>
                            </div>
                        </div>
                    </div>

                    <div class="settings-card-body">
                        <div class="form-group">
                            <label for="site_name" class="form-label">
                                সাইটের নাম (Site Name - English) <span style="color: var(--admin-danger);">*</span>
                            </label>
                            <input type="text" class="form-control" id="site_name" name="site_name" value="{{ old('site_name', $settings['site_name']) }}" required placeholder="Hasana">
                            <small class="form-helper">সিস্টেম ব্রাউজার ট্যাব ও মেটা টাইটেলে প্রদর্শিত হবে।</small>
                        </div>

                        <div class="form-group">
                            <label for="site_title_bn" class="form-label">
                                সাইটের বাংলা নাম (Bangla Title) <span style="color: var(--admin-danger);">*</span>
                            </label>
                            <input type="text" class="form-control" id="site_title_bn" name="site_title_bn" value="{{ old('site_title_bn', $settings['site_title_bn'] ?? 'হাসানা') }}" required placeholder="যেমন: হাসানা">
                            <small class="form-helper">সাইডবার ব্র্যান্ড এবং অ্যাপ্লিকেশনের শীর্ষে প্রদর্শিত হবে।</small>
                        </div>

                        <div class="form-group">
                            <label for="site_tagline" class="form-label">
                                স্লোগান / সংক্ষিপ্ত ট্যাগলাইন (Tagline)
                            </label>
                            <input type="text" class="form-control" id="site_tagline" name="site_tagline" value="{{ old('site_tagline', $settings['site_tagline'] ?? 'পবিত্র কুরআন, হাদিস ও দোয়া') }}" placeholder="পবিত্র কুরআন, হাদিস ও দোয়া">
                            <small class="form-helper">অ্যাপের সাবটাইটেল এবং পরিচিতিতে প্রদর্শিত হবে।</small>
                        </div>

                        <div class="form-group">
                            <label for="developer_name" class="form-label">
                                প্রস্তুতকারক ও প্রযুক্তি পার্টনার (Developed by)
                            </label>
                            <input type="text" class="form-control" id="developer_name" name="developer_name" value="{{ old('developer_name', $settings['developer_name'] ?? 'Apptimatic') }}" placeholder="Apptimatic">
                            <small class="form-helper">অ্যাপের 'সম্পর্কে' পাতায় ডেভেলপার তথ্য হিসেবে প্রদর্শিত হবে।</small>
                        </div>
                    </div>
                </div>

                <!-- System Info Card -->
                <div class="settings-card">
                    <div class="settings-card-header">
                        <div class="settings-card-title-group">
                            <div class="settings-card-icon">
                                <i class="fa-solid fa-server"></i>
                            </div>
                            <div>
                                <h2 class="settings-card-title">সিস্টেম ও স্টোরেজ স্ট্যাটাস</h2>
                                <p class="settings-card-subtitle">হোস্টিং ও স্টোরেজ লিঙ্ক তথ্য</p>
                            </div>
                        </div>
                    </div>

                    <div class="settings-card-body">
                        <div class="system-info-list">
                            <div class="system-info-item">
                                <span class="system-info-label"><i class="fa-brands fa-php" style="color: #6366f1;"></i> পিএইচপি ভার্সন:</span>
                                <span class="system-info-val">{{ PHP_VERSION }}</span>
                            </div>
                            <div class="system-info-item">
                                <span class="system-info-label"><i class="fa-brands fa-laravel" style="color: #ef4444;"></i> লারাভেল ফ্রেমওয়ার্ক:</span>
                                <span class="system-info-val">v{{ app()->version() }}</span>
                            </div>
                            <div class="system-info-item">
                                <span class="system-info-label"><i class="fa-solid fa-hard-drive" style="color: #10b981;"></i> পাবলিক স্টোরেজ সিমলিঙ্ক:</span>
                                <span class="system-info-val" style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> সংযুক্ত (Active)</span>
                            </div>
                            <div class="system-info-item">
                                <span class="system-info-label"><i class="fa-solid fa-database" style="color: var(--admin-gold);"></i> ডেটাবেজ:</span>
                                <span class="system-info-val">MySQL (হাসানা)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sticky Action Bar -->
        <div class="settings-footer-bar" style="margin-top: 24px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-shield-halved" style="color: var(--admin-gold);"></i>
                <span style="font-size: 13.5px; font-weight: 600; color: var(--admin-text-muted);">
                    সকল পরিবর্তন স্বয়ংক্রিয়ভাবে সাইট ও মোবাইল অ্যাপে প্রতিফলিত হবে।
                </span>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="{{ route('admin.settings.index') }}" class="btn-secondary">
                    <i class="fa-solid fa-rotate"></i> রিসেট
                </a>
                <button type="submit" class="btn-primary" id="btnSubmitSettings">
                    <i class="fa-solid fa-floppy-disk"></i> পরিবর্তন সংরক্ষণ করুন
                </button>
            </div>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    const defaultLogoUrl = "{{ logo_url() }}";
    const fallbackDefaultSvg = "{{ asset('images/logo.svg') }}";

    const dropzone = document.getElementById('logoDropzone');
    const fileInput = document.getElementById('logoFileInput');
    const logoPreview = document.getElementById('mainLogoPreview');
    const logoDisplayBox = document.getElementById('logoDisplayBox');
    const selectedFilePill = document.getElementById('selectedFilePill');
    const selectedFileName = document.getElementById('selectedFileName');
    const selectedFileSize = document.getElementById('selectedFileSize');
    const btnCancelNewLogo = document.getElementById('btnCancelNewLogo');
    const btnResetDefaultLogo = document.getElementById('btnResetDefaultLogo');
    const removeLogoInput = document.getElementById('removeLogoInput');
    const previewStatusLabel = document.getElementById('previewStatusLabel');
    const form = document.getElementById('settingsForm');
    const btnSubmit = document.getElementById('btnSubmitSettings');

    // 1. Theme preview switcher (Light vs Dark)
    document.querySelectorAll('[data-preview-theme]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-preview-theme]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const theme = this.dataset.previewTheme;
            if (theme === 'dark') {
                logoDisplayBox.classList.remove('theme-light');
                logoDisplayBox.classList.add('theme-dark');
            } else {
                logoDisplayBox.classList.remove('theme-dark');
                logoDisplayBox.classList.add('theme-light');
            }
        });
    });

    // 2. Click to open file dialog
    dropzone.addEventListener('click', function () {
        fileInput.click();
    });

    // 3. Drag and Drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', function (e) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            handleFileSelect(files[0]);
        }
    });

    // 4. File input change event
    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            handleFileSelect(this.files[0]);
        }
    });

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function handleFileSelect(file) {
        // Validate file type
        const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(svg|png|jpg|jpeg|webp)$/i)) {
            alert('অনুগ্রহ করে শুধুমাত্র SVG, PNG, JPG, JPEG বা WEBP ফরম্যাটের ছবি নির্বাচন করুন।');
            fileInput.value = '';
            return;
        }

        // Validate max size 3MB
        if (file.size > 3 * 1024 * 1024) {
            alert('লোগো ফাইলের সাইজ ৩ মেগাবাইটের বেশি হতে পারবে না।');
            fileInput.value = '';
            return;
        }

        // Reset remove flag
        removeLogoInput.value = '0';

        // Read and show instant preview
        const reader = new FileReader();
        reader.onload = function (e) {
            logoPreview.src = e.target.result;
            selectedFileName.textContent = file.name;
            selectedFileSize.textContent = formatBytes(file.size);
            selectedFilePill.classList.add('active');
            previewStatusLabel.innerHTML = '<i class="fa-solid fa-sparkles" style="color: var(--admin-gold);"></i> নতুন লোগো নির্বাচিত';
        };
        reader.readAsDataURL(file);
    }

    // 5. Cancel selected new file
    btnCancelNewLogo.addEventListener('click', function (e) {
        e.stopPropagation();
        fileInput.value = '';
        removeLogoInput.value = '0';
        logoPreview.src = defaultLogoUrl;
        selectedFilePill.classList.remove('active');
        previewStatusLabel.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> বর্তমান লোগো';
    });

    // 6. Reset to default logo
    btnResetDefaultLogo.addEventListener('click', function () {
        if (confirm('আপনি কি ডিফল্ট সিস্টেম লোগোতে ফিরে যেতে চান? সেভ করলে পূর্বের কাস্টম লোগো মুছে যাবে।')) {
            fileInput.value = '';
            removeLogoInput.value = '1';
            logoPreview.src = fallbackDefaultSvg;
            selectedFilePill.classList.remove('active');
            previewStatusLabel.innerHTML = '<i class="fa-solid fa-arrow-rotate-left" style="color: #f59e0b;"></i> ডিফল্ট লোগো সেট হবে (সংরক্ষণ করুন)';
        }
    });

    // 7. Form submit loading state
    form.addEventListener('submit', function () {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> সংরক্ষণ হচ্ছে...';
    });
});
</script>
@endpush
