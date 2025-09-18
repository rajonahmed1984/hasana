<div class="table-responsive">
	<table class="table ">
		<thead class="thead-light">
			<tr>
				<th class="no-sort">
					<label class="checkboxs">
						<input type="checkbox" id="select-all">
						<span class="checkmarks"></span> 
					</label>
				</th>
				<th>Category</th>
				<th>Parent Category</th>
				<th>Status</th>
				<th class="no-sort"></th>
			</tr>
		</thead>
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>
					<label class="checkboxs">
						<input type="checkbox" value="{{ $item->id}}" class="checkbox">
						<span class="checkmarks"></span>
					</label>
				</td>
				<td>
					<div class="d-flex align-items-center">
						<a href="javascript:void(0);" class="avatar avatar-md bg-light-900 p-1 me-2">
							<img class="object-fit-contain" width="80" src="{{ getImage('categories',$item->image)}}" alt="img">
						</a>
						<a href="javascript:void(0);">{{ $item->name}}</a>
					</div>
				</td>
				<td>{{ $item->parent->name ??''}}</td>

				<td><span class="badge table-badge bg-success fw-medium fs-10">Active</span></td>
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 p-2 btn_modal" href="{{ route('categories.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('categories.destroy',[$item->id])}}" class="delete">
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