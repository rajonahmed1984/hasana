
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Retail POS — One Page (Polished UI)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css" integrity="sha512-TFee0335YRJoyiqz8hA8KV3P0tXa5CpRBSoM0Wnkn7JoJx1kaq1yXL/rb8YFpWXkMOjRcv5txv+C6UluttluCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    
    html,body{height:100%;margin:0;background:#e9edf3;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,"Hind Siliguri",sans-serif}
    :root{
      --base-w:1366px;--base-h:768px;--ink:#0f172a;--muted:#64748b;--line:#e6eaf2;--panel:#fff;
      --pri:#2a3a8d;--pri-600:#23306f;--acc:#f47c20;--ok:#16a34a;--warn:#d97706;--bad:#dc2626;
      --chip:#eef2ff;--chip-ink:#1e1b4b;
      --primary-color: #2A3A8D;
      --accent-color: #F47C20;
    }
    .pos-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    /* ==============================
       APP LAYOUT
       ============================== */
    .app{display:grid;grid-template-rows:64px 58px 1fr 60px;gap:8px;height:100%;padding:12px}

    .topbar{display:grid;grid-template-columns:0.3fr auto;align-items:center;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:6px 12px}
    .outlet{display:flex;align-items:center;gap:10px; justify-content: flex-end;}
    .outlet .badge{background:var(--chip);color:var(--chip-ink);border:1px solid #e5e7eb}

    .ctrlbar{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px}
    .ctrlbar .label{font-size:12px;color:var(--muted);margin-bottom:2px}
    .ctrlbar .count-box { display: flex ; align-items: center; gap: 8px; background: #ff6507; color: #fff; border-radius: 10px; padding: 3px 6px; font-weight: 800; }
	.ctrlbar .row>* { margin-top: 0; }

    .main{display:grid;grid-template-columns:1fr 380px;gap:10px;min-height:0}

    .panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;display:flex;flex-direction:column;min-height:0}
    .panel .head{padding:8px 12px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}
    .panel .body{padding:8px 10px;overflow:auto}

    /* Items table */
    .items-wrap{height:100%;display:flex;flex-direction:column}
    .items-table{--bs-table-bg:transparent;border-color:#e9edf4}
    .items-table th,.items-table td{vertical-align:middle}
    .items-table thead th{position:sticky;top:0;background:#eef2ff;border-bottom:1px solid var(--line);z-index:1}
    .items-table tbody tr{transition:background .12s}
    .items-table tbody tr:hover{background:#f9fafb}
    .qty-ctrl .btn{min-width:28px}

    /* Summary / Tender / Payment cards */
    .cardish{border:1px solid var(--line);border-radius:10px;padding:10px;background:#fff}
    .sumbox .rowline{display:grid;grid-template-columns:1fr auto;gap:6px;border-bottom: 1px solid #efefef}
    .sumbox .total{font-size:16px;font-weight:900}

    .tender-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
    .tender-table thead th{background:#f3f6fb}
    .tender-table td,.tender-table th{padding:.35rem .5rem}

    .paybox .rowline{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;border-bottom: 1px solid #efefef}
    .paybox .amt{min-width:120px;text-align:right;font-weight:700}
    .paybox .payable{font-size:16px;font-weight:900}
    .status-chip{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;font-size:12px;border:1px solid var(--line)}
    .status-ok{background:#ecfdf5;color:#065f46}
    .status-warn{background:#fff7ed;color:#b45309}
    .status-bad{background:#fef2f2;color:#991b1b}

    .footbar{display:grid;grid-template-columns:1fr auto;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 12px;align-items:center}
    .footbar .hint{color:var(--muted);font-size:12px}

    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}
  </style>
</head>
<body>
<div class="pos-wrapper">
  <div class="app">
    <!-- HEADER -->
    <div class="topbar">
      <div class="brand">
        <img src="https://placehold.co/80x38/2A3A8D/FFFFFF?text=POS" alt="brand">
      </div>
      <div class="outlet">
          <div class="fw-bold">Outlet: <span id="outlet">F641 – Poshchim Agargaon Outlet</span></div>
          <div class="d-flex gap-2 mt-1">
            <span class="badge rounded-pill">Terminal: <span class="mono" id="term">F641POS1N</span></span>
            <span class="badge rounded-pill">User: <span class="mono" id="user">L53403</span></span>
            <span class="badge rounded-pill">Version: <span class="mono">4.0.5</span></span>
            <span class="badge rounded-pill">Last Invoice #: <a href="http://"><span class="mono" id="lastInv">—</span></a> </span>
          </div>
      </div>
    </div>

    <!-- CONTROL BAR -->
    

    <!-- MAIN AREA -->
    @yield('sell_content')

    <!-- FOOTER -->
    <div class="footbar">
      <div class="d-flex align-items-center gap-3">
        <span class="fw-semibold">FREE ITEMS</span>
        <div class="d-flex align-items-center gap-1"><span class="text-muted">Free Qty</span><input type="number" id="freeQty" class="form-control form-control-sm" style="width:90px" value="0"></div>
        <div class="d-flex align-items-center gap-1"><span class="text-muted">Manual Qty</span><input type="number" id="manualQty" class="form-control form-control-sm" style="width:90px" value="0"></div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-warning" id="holdBtn" data-bs-toggle="modal" data-bs-target="#holdModal">
          <i class="fa-regular fa-floppy-disk me-1"></i>HOLD
        </button>
        <button class="btn btn-outline-primary" id="recallBtn" data-bs-toggle="modal" data-bs-target="#recallModal"><i class="fa-solid fa-rotate-left me-1"></i>RECALL</button>
        <button class="btn btn-outline-dark" id="salesBtn" data-bs-toggle="modal" data-bs-target="#salesModal"><i class="fa-solid fa-list me-1"></i>SALES LIST</button>
        <button class="btn btn-outline-danger" id="voidBtn">VOID</button>
        <button class="btn btn-outline-secondary" id="exitBtn">EXIT</button>
      </div>
    </div>
  </div>
  
</div>

<!-- Hold Modal -->
<div class="modal fade" id="holdModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Hold Bill</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
      <div class="modal-body">
        <div id="holdSummary" class="small text-muted">No items to hold.</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-warning" id="confirmHoldBtn"><i class="fa-regular fa-floppy-disk me-1"></i>Hold Now</button>
      </div>
    </div>
  </div>
</div>

<!-- Recall Modal -->
<div class="modal fade" id="recallModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Held Bills</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
      <div class="modal-body p-0">
        <div id="recallList" class="list-group list-group-flush"></div>
      </div>
    </div>
  </div>
</div>

<!-- Sales List Modal -->
<div class="modal fade" id="salesModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Sales List (Session)</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
      <div class="modal-body">
        <div class="table-responsive">
          <table class="table table-sm table-bordered align-middle">
            <thead><tr><th>#</th><th>Invoice</th><th>Time</th><th class="text-end">Items</th><th class="text-end">Total</th></tr></thead>
            <tbody id="salesBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Stock Check Modal -->
<div class="modal fade" id="stockModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title" id="stockTitle">Stock Availability</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
      <div class="modal-body" id="stockBody">
        <p class="text-center text-muted">No stock data.</p>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Outlet</th>
                <th>Size</th>
                <th class="text-end">Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td class="text-end"></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

@include('sells.partials.js')
<script>
  /* FIT-TO-SCREEN */
  const BASE_W=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--base-w'))||1366;
  const BASE_H=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--base-h'))||768;
  const canvas=document.getElementById('canvas');
  function fit(){ const sx=window.innerWidth/BASE_W, sy=window.innerHeight/BASE_H, s=Math.min(sx,sy); canvas.style.transform=`scale(${s})`; }
  window.addEventListener('resize',fit); fit();
  document.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{ const z=b.getAttribute('data-zoom'); if(z==='fit') return fit(); canvas.style.transform=`scale(${parseFloat(z)})`; }));

  /* MOCK DATA */
  const codeMap={'2803204':{code:'2803204',desc:'Olympic Energy Plus 62±6g',price:15},'2604475':{code:'2604475',desc:'Bashundhara Lit Dish Wash Bar 1…',price:12},'2820350':{code:'2820350',desc:'Savoy Premium Cone Ice cream 1…',price:100}};
  const inventory={
    '2803204':[ {outlet:'F641 – Agargaon', size:'—', stock:12}, {outlet:'Gulshan', size:'—', stock:3} ],
    '2604475':[ {outlet:'F641 – Agargaon', size:'—', stock:25} ],
    '2820350':[ {outlet:'F641 – Agargaon', size:'—', stock:5}, {outlet:'Uttara', size:'—', stock:9} ]
  };
  const pad=n=>Number(n||0).toFixed(2);

  /* ELEMENTS */
  const barcode=document.getElementById('barcode');
  const itemRows=document.getElementById('itemRows');
  const itemCount=document.getElementById('itemCount');
  const mrpTotal=document.getElementById('mrpTotal');
  const sd=document.getElementById('sd');
  const disc=document.getElementById('disc');
  const grand=document.getElementById('grand');
  const tenderBody=document.getElementById('tenderBody');
  const tenderTotalEl=document.getElementById('tenderTotal');
  const addTender=document.getElementById('addTender');
  const roundOff=document.getElementById('roundOff');
  const payable=document.getElementById('payable');
  const cashReceive=document.getElementById('cashReceive');
  const changeAmt=document.getElementById('changeAmt');
  const statusChip=document.getElementById('statusChip');
  const printBtn=document.getElementById('printBtn');
  const voidBtn=document.getElementById('voidBtn');
  const exitBtn=document.getElementById('exitBtn');

  // New feature buttons + modals
  const holdBtn=document.getElementById('holdBtn');
  const recallBtn=document.getElementById('recallBtn');
  const salesBtn=document.getElementById('salesBtn');
  const holdModalEl=document.getElementById('holdModal');
  const recallModalEl=document.getElementById('recallModal');
  const salesModalEl=document.getElementById('salesModal');
  const holdSummary=document.getElementById('holdSummary');
  const confirmHoldBtn=document.getElementById('confirmHoldBtn');
  const recallList=document.getElementById('recallList');
  const salesBody=document.getElementById('salesBody');
  const lastInvEl=document.getElementById('lastInv');

  // Stock modal
  const stockModalEl=document.getElementById('stockModal');
  const stockTitle=document.getElementById('stockTitle');
  const stockBody=document.getElementById('stockBody');

  /* STATE */
  let items=[]; // {code,desc,price,qty,freeOf|null}
  let discount=0; // plug into UI when needed
  let heldBills=[]; // {ref, when, items}
  let sales=[]; // {invoice, when, items, total, payable, tenders, cash, change}
  let holdCounter=1, invCounter=1;

  const nextHoldRef=()=>`H-${String(holdCounter++).padStart(4,'0')}`;
  const nextInvoice=()=>`INV-${String(invCounter++).padStart(5,'0')}`;

  /* RENDER */
  function freeWithSelect(idx){
    const opts=items.map((o,j)=> j!==idx ? `<option value="${o.code}">${o.code}</option>`:'' ).join('');
    return `<label class='me-1'>Free with:</label>
            <select class='form-select form-select-sm d-inline-block w-auto free-of' data-i='${idx}'>
              <option value=''>— None —</option>${opts}
            </select>`;
  }

  function renderRows(){
    itemRows.innerHTML='';
    items.forEach((it,idx)=>{
      const tr=document.createElement('tr');
      const isFree=!!it.freeOf;
      const lineTotal=isFree?0:(it.price*it.qty);
      tr.innerHTML=`
        <td class="text-center">${idx+1}</td>
        <td class="mono">${it.code}</td>
        <td>
          ${it.desc}
          <div class='mt-1 small text-muted'>${freeWithSelect(idx)} ${isFree?`<span class="badge bg-success ms-1">FREE of ${it.freeOf}</span>`:''}</div>
        </td>
        <td class="text-center"><button class="btn btn-sm btn-outline-info stock" data-code="${it.code}"><i class="fas fa-search-location"></i> Stock</button></td>
        <td class="text-end"><input type="number" class="form-control form-control-sm text-end price" data-i="${idx}" value="${it.price}"></td>
        <td class="text-end">
          <div class="input-group input-group-sm qty-ctrl">
            <button class="btn btn-outline-secondary dec" data-i="${idx}">−</button>
            <input class="form-control text-center" value="${it.qty}" readonly>
            <button class="btn btn-outline-secondary inc" data-i="${idx}">+</button>
          </div>
        </td>
        <td class="text-end mono">${pad(lineTotal)}</td>
        <td class="text-center"><button class="btn btn-sm btn-link text-danger del" data-i="${idx}"><i class="fa-regular fa-circle-xmark"></i></button></td>`;
      itemRows.appendChild(tr);
    });
    itemCount.textContent=items.reduce((s,i)=>s+i.qty,0);
    computeTotals();
  }

  function computeTotals(){
    const subtotal=items.reduce((s,i)=> s + (i.freeOf?0:i.price*i.qty), 0);
    const sdAmt=0; // extend if needed
    const grandAmt=subtotal+sdAmt-(discount||0);
    const payableAmt=Math.ceil(grandAmt);
    const round=payableAmt-grandAmt;

    mrpTotal.textContent=pad(subtotal);
    sd.textContent=pad(sdAmt);
    disc.textContent=pad(discount);
    grand.textContent=pad(grandAmt);
    roundOff.textContent=pad(round);
    payable.textContent=pad(payableAmt);

    const tenderTotal=[...tenderBody.querySelectorAll('.tender-amt')].reduce((s,i)=>s+Number(i.value||0),0);
    tenderTotalEl.textContent=pad(tenderTotal);

    const cash=Number(cashReceive.value||0);
    const paid=tenderTotal+cash;
    const due=payableAmt-paid;
    changeAmt.textContent=pad(-Math.min(due,0)); // change only when overpaid

    // status chip
    statusChip.classList.remove('status-ok','status-warn','status-bad');
    if(paid===0){ statusChip.classList.add('status-warn'); statusChip.innerHTML='<i class="fa-regular fa-circle-question"></i> Waiting for payment…'; }
    else if(due>0){ statusChip.classList.add('status-bad'); statusChip.innerHTML=`<i class="fa-solid fa-triangle-exclamation"></i> Need ৳ ${pad(due)} more`; }
    else { statusChip.classList.add('status-ok'); statusChip.innerHTML=`<i class="fa-regular fa-circle-check"></i> Paid in full`; }

    return {subtotal,grandAmt,payableAmt,round};
  }

  /* EVENTS */
  barcode.addEventListener('keydown',e=>{ if(e.key!=='Enter') return; const code=e.target.value.trim(); e.target.value=''; let p=codeMap[code]||{code:code||'—',desc:'Manual Item',price:0}; const ex=items.find(x=>x.code===p.code); if(ex) ex.qty+=1; else items.push({...p,qty:1,freeOf:null}); renderRows(); });

  itemRows.addEventListener('click',e=>{
    const stock=e.target.closest('.stock'); if(stock){ openStock(stock.dataset.code); return; }
    const btn=e.target.closest('button'); if(!btn) return; const i=parseInt(btn.dataset.i,10);
    if(btn.classList.contains('inc')) items[i].qty+=1;
    if(btn.classList.contains('dec')) items[i].qty=Math.max(0,items[i].qty-1);
    if(btn.classList.contains('del')) items.splice(i,1);
    items=items.filter(x=>x.qty>0); renderRows();
  });
  itemRows.addEventListener('input',e=>{ if(e.target.classList.contains('price')){ const i=parseInt(e.target.dataset.i,10); items[i].price=Number(e.target.value||0); computeTotals(); } });
  itemRows.addEventListener('change',e=>{ if(e.target.classList.contains('free-of')){ const i=parseInt(e.target.dataset.i,10); const v=e.target.value; items[i].freeOf = v? v : null; renderRows(); }});

  // tender rows
  function appendTenderRow(name='eCom Cash', amount=0, ref=''){
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><select class="form-select form-select-sm tender-name"><option>Eastern Bank</option><option>eCom Cash</option><option>eCom Online</option><option>MTB Card</option><option>MTB QR</option><option>Nagad</option><option>PBL</option><option>UCBL</option></select></td>
      <td class="text-end"><input type="number" class="form-control form-control-sm text-end tender-amt" value="${amount}"></td>
      <td><input class="form-control form-control-sm tender-ref" placeholder="Ref" value="${ref}"></td>
      <td class="text-center"><button class="btn btn-sm btn-link text-danger rm-tender"><i class="fa fa-times"></i></button></td>`;
    tr.querySelector('.tender-name').value=name;
    tenderBody.appendChild(tr);
  }
  addTender.addEventListener('click',()=>appendTenderRow());
  tenderBody.addEventListener('input',e=>{ if(e.target.classList.contains('tender-amt')) computeTotals(); });
  tenderBody.addEventListener('click',e=>{ const btn=e.target.closest('.rm-tender'); if(btn){ btn.closest('tr').remove(); computeTotals(); }});

  cashReceive.addEventListener('input',computeTotals);

  // Keyboard helpers
  document.addEventListener('keydown',e=>{
    if(e.key==='F2'){ e.preventDefault(); barcode.focus(); }
    if((e.key==='+') && items.length){ items[items.length-1].qty+=1; renderRows(); }
    if((e.key==='-') && items.length){ items[items.length-1].qty=Math.max(0,items[items.length-1].qty-1); renderRows(); }
    if(e.key==='F9'){ e.preventDefault(); finalizeSale(true); }
  });

  // Stock check
  function openStock(code){
    const p=codeMap[code]||{desc:'Unknown',code};
    stockTitle.textContent=`${p.desc} — ${code}`;
    const list=inventory[code];
    if(!list){ stockBody.innerHTML='<p class="text-center text-muted">No stock data.</p>'; }
    else{
      let html='<div class="table-responsive"><table class="table table-bordered"><thead><tr><th>Outlet</th><th>Size</th><th class="text-end">Stock</th></tr></thead><tbody>';
      list.forEach(r=>{ html+=`<tr><td>${r.outlet}</td><td>${r.size||'—'}</td><td class="text-end">${r.stock}</td></tr>`; });
      html+='</tbody></table></div>';
      stockBody.innerHTML=html;
    }
    bootstrap.Modal.getOrCreateInstance(stockModalEl).show();
  }

  // Print (complete sale)
  function finalizeSale(alsoPrint=false){
    if(!items.length){ if(alsoPrint) window.print(); return; }
    const totals=computeTotals();
    const invoice=nextInvoice();
    const tenders=[...tenderBody.querySelectorAll('tr')].map(tr=>({
      name:tr.querySelector('.tender-name')?.value||'',
      amount:Number(tr.querySelector('.tender-amt')?.value||0),
      ref:tr.querySelector('.tender-ref')?.value||''
    }));
    const cash=Number(cashReceive.value||0);
    const salesObj={invoice,when:new Date(),items:JSON.parse(JSON.stringify(items)),total:totals.grandAmt,payable:totals.payableAmt,tenders,cash,change:Math.max(0,(tenders.reduce((s,t)=>s+t.amount,0)+cash)-totals.payableAmt)};
    sales.unshift(salesObj); // newest first
    lastInvEl.textContent=invoice;

    // reset UI
    items=[]; tenderBody.innerHTML=''; appendTenderRow('eCom Cash',0,''); cashReceive.value=''; renderRows();

    if(alsoPrint) window.print();
  }

  printBtn.addEventListener('click',()=>finalizeSale(true));
  voidBtn.addEventListener('click',()=>{ if(confirm('VOID this sale?')){ items=[]; tenderBody.innerHTML=''; cashReceive.value=''; renderRows(); }});
  exitBtn.addEventListener('click',()=>{ if(confirm('Exit POS page?')) window.close(); });

  // HOLD FLOW
  holdModalEl.addEventListener('show.bs.modal',()=>{
    if(!items.length){ holdSummary.innerHTML='<span class="text-danger">Cart is empty. Nothing to hold.</span>'; confirmHoldBtn.disabled=true; return; }
    const totals=computeTotals();
    const lines=items.map(i=>`${i.desc} — ${i.qty} × ${pad(i.price)} = ${i.freeOf?'<span class=\'text-success\'>FREE</span>':pad(i.qty*i.price)}`).join('<br>');
    holdSummary.innerHTML=`<div class="mb-1"><strong>Items:</strong></div><div class="small">${lines}</div><hr class="my-2"><div class="d-flex justify-content-between"><span class="fw-semibold">Payable</span><span class="fw-bold">${pad(totals.payableAmt)}</span></div>`;
    confirmHoldBtn.disabled=false;
  });

  confirmHoldBtn.addEventListener('click',()=>{
    if(!items.length) return; const ref=nextHoldRef();
    heldBills.unshift({ref,when:new Date(),items:JSON.parse(JSON.stringify(items))});
    // clear cart
    items=[]; tenderBody.innerHTML=''; appendTenderRow('eCom Cash',0,''); cashReceive.value=''; renderRows();
    bootstrap.Modal.getInstance(holdModalEl)?.hide();
  });

  // RECALL LIST
  function renderHeldList(){
    recallList.innerHTML='';
    if(!heldBills.length){ recallList.innerHTML='<div class="list-group-item text-center text-muted">No held bills</div>'; return; }
    heldBills.forEach((b,idx)=>{
      const total=b.items.reduce((s,i)=>s+(i.freeOf?0:i.price*i.qty),0);
      const count=b.items.reduce((s,i)=>s+i.qty,0);
      const row=document.createElement('a'); row.href="#"; row.className='list-group-item list-group-item-action d-flex justify-content-between align-items-center';
      row.innerHTML=`<div><div class="fw-semibold">${b.ref}</div><small class="text-muted">${b.when.toLocaleString()}</small><br><small>Items: ${count} • Total: ${pad(total)}</small></div>
        <div class="btn-group btn-group-sm"><button class="btn btn-success" data-act="recall" data-idx="${idx}">Recall</button><button class="btn btn-outline-danger" data-act="delete" data-idx="${idx}"><i class="fa fa-trash"></i></button></div>`;
      recallList.appendChild(row);
    });
  }
  recallModalEl.addEventListener('show.bs.modal',renderHeldList);
  recallList.addEventListener('click',(e)=>{
    const btn=e.target.closest('button'); if(!btn) return; const idx=parseInt(btn.dataset.idx,10);
    if(btn.dataset.act==='recall'){
      if(items.length && !confirm('Replace current cart with held bill?')) return;
      const bill=heldBills.splice(idx,1)[0]; items=bill.items; renderRows(); bootstrap.Modal.getInstance(recallModalEl)?.hide();
    } else if(btn.dataset.act==='delete'){
      if(confirm('Delete this held bill?')){ heldBills.splice(idx,1); renderHeldList(); }
    }
  });

  // SALES LIST
  function renderSales(){
    salesBody.innerHTML='';
    if(!sales.length){ salesBody.innerHTML='<tr><td colspan="5" class="text-center text-muted">No sales yet</td></tr>'; return; }
    sales.forEach((s,idx)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${idx+1}</td><td class="mono">${s.invoice}</td><td>${new Date(s.when).toLocaleString()}</td><td class="text-end">${s.items.reduce((x,i)=>x+i.qty,0)}</td><td class="text-end">${pad(s.payable)}</td>`;
      salesBody.appendChild(tr);
    });
  }
  salesModalEl.addEventListener('show.bs.modal',renderSales);

  // INIT
  appendTenderRow('eCom Cash',0,'');
  renderRows();
</script>
</body>
</html>