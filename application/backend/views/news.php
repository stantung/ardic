<!DOCTYPE html>
<html>
<title>Admin | Home</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php echo $this->load->view('base/meta'); ?>
</head>
<body>
<?php echo $this->load->view('base/nav'); ?>
<div class="container-fluid mt60">
	
	<div id="page-header">
		<h1>News <small></small></h1>
	</div>
	
	<hr />
	
	<table class="table table-bordered">
		<thead>
			<tr>
				<th>#</th>
				<th>Title</th>
				<th>Subject</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
		</tbody>
	</table>
	

</div>
<?php $this->load->view('base/footer') ?>
</body>
</html>