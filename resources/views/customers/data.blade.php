


<div class="table-responsive">
	<table class="table ">
		<thead class="table-header-custom">
	        <tr>
	            <th>সাপ্লায়ার</th>
	            <th>ফোন</th>
	            <th>মোট পারচেজ</th>
	            <th>মোট রিটার্ন</th>
	            <th>মোট পরিশোধ</th>
	            <th>অ্যাডভান্স</th>
	            <th>মোট বকেয়া</th>
	            <th>অ্যাকশন</th>
	        </tr>
	    </thead>
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>
					<div class="d-flex align-items-center">
						<a href="javascript:void(0);" class="avatar avatar-md bg-light-900 p-1 me-2">
							<img width="60" class="object-fit-contain" src="{{ getImage('contacts',$item->image)}}" alt="img">
						</a>
						<a href="javascript:void(0);">{{ $item->name}}</a>
					</div>
				</td>
				<td>{{ $item->mobile}}</td>
				<td>0</td>
				<td>0</td>
				<td>0</td>
				<td>0</td>
				<td>0</td>
				<td><span class="badge table-badge bg-{{ $item->status=='1' ?'success':'warning'}} fw-medium fs-10">{{ $item->status=='1' ?'Active':'De-active'}}</span></td>
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 p-2 btn_modal" href="{{ route('contacts.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('contacts.destroy',[$item->id])}}" class="delete">
							<i class="fa fa-trash"></i>
						</a>
					</div>
					
				</td>
			</tr>
			@endforeach
		</tbody>
	</table>
</div>
<p> {{$items->render()}} </p>