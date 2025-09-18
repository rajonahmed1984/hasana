<div class="modal-dialog modal-lg">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="batchModalLabel">পণ্যের ব্যাচ বিবরণ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <h4 id="batchProductName" class="primary-text"></h4>
            <div class="table-responsive">
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th>ব্যাচ নং</th>
                            <th>স্টক</th>
                            <th>মেয়াদ উত্তীর্ণের তারিখ</th>
                        </tr>
                    </thead>
                    <tbody id="batch-table-body">
                        <!-- Batch rows will be inserted here by JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>