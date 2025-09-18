<div class="table-responsive">
	<table class="table ">
		<thead class="thead-light">
			<tr>
				<th>Unit</th>
				<th>Created Date</th>
				<th>Status</th>
				<th class="no-sort"></th>
			</tr>
		</thead>
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>{{ $item->name}}</td>
				<td>{{ dateFormate($item->created_at)}}</td>
				<td><span class="badge table-badge bg-success fw-medium fs-10">Active</span></td>
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 p-2 btn_modal" href="{{ route('units.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('units.destroy',[$item->id])}}" class="delete">
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