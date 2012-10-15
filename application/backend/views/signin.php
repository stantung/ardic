<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>&copy <?php echo date('Y') ?>&nbsp;ARDIC&nbsp;|&nbsp;Administrator Panel&nbsp;|&nbsp;Sign-In</title>
	<!-- <link href="<?php echo base_url() ?>stylesheets/styles.css" rel="stylesheet" type="text/css" /> -->
	<link rel="stylesheet" href="<?php echo base_url() ?>css/bootstrap.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="<?php echo base_url() ?>stylesheets/signin.css" type="text/css" media="screen" title="" charset="utf-8">
	<link rel="stylesheet" href="<?php echo base_url() ?>stylesheets/gh-buttons.css" type="text/css" media="screen" title="no title" charset="utf-8">
</head>
<body>
	
	<div id="container">
		<form id="frmMain" action="/admin.php/signin/submit" method="post">
		<div class="signin-box">
			<div class="logo">
				<img src="/img/backend/logo.png">
			</div>
			<div class="box">
				<p>
					<label for="username">Username</label>
					<input type="text" name="username" value="" id="username" maxlength="32">
					<label for="password">Password</label>
					<input type="password" name="password" value="" id="password" maxlength="32">
					<input type="submit" value="Sign-in" class="left primary button">
				</p>
				<?php echo validation_errors('<div class="error"><span>','</span></div>'); ?>
			</div>
		</div>
		</form>
	</div>
	
</body>
</html>