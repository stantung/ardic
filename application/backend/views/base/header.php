<header>
	<!-- <h1>Welcome to Admin</h1> -->
	<div id="logo">
		<a href="<?php echo base_url() . 'admin.php/home' ?>">Ardic</a>
	</div>
	<div class="account-info">
		Hello, <a href="#"><?php echo $this->session->userdata('username') ?></a>&nbsp;|&nbsp;<a href="/admin.php/signout">Sign out</a>		
	</div>
</header>
