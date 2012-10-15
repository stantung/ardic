<?php
/**
 這段的程式碼需要更換掉, 因為 DRY 太嚴重, 還是需要去寫 help 不可以偷懶
 */
?>
<div id="top-nvabar" class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container" style="width: auto;">
		<a class="brand" href="<?php echo base_url() ?>admin.php">ARDIC</a>
		<?php foreach ($this->sys_menu->get_sysmenu() as $item) { ?>
		<ul class="nav" role="navigation">
			<li class="dropdown">
				<a id="<?php echo $item->alias ?>" href="<?php echo base_url().index_page().'/'.$item->link ?>" role="button" class="dropdown-toggle" 
						<?php if (count($this->sys_menu->get_child_sysmenu($item->id)) >= 1) { ?>
						data-toggle="dropdown"
						<?php } else { ?>
						data-toggle=""
						<?php }?>
				>
					<?php echo $item->title ?>
					<?php if (count($this->sys_menu->get_child_sysmenu($item->id)) >= 1) { ?>
					<b class="caret"></b>
					<?php } ?>
				</a>
				
				<?php if (count($this->sys_menu->get_child_sysmenu($item->id)) >= 1) { ?>
				<ul class="dropdown-menu" role="menu" aria-labelledby="subitem-<?php echo $item->id ?>">
				<?php } ?>
				
				<?php foreach ($this->sys_menu->get_child_sysmenu($item->id) as $subitem) { ?>
					<li><a tabindex="-1" href="<?php echo base_url().index_page().'/'.$subitem->link ?>"><?php echo $subitem->title ?></a></li>
					<!-- <li class="divider"></li> -->
				<?php } ?>
				
				<?php if (count($this->sys_menu->get_child_sysmenu($item->id)) >= 1) { ?>
				</ul>
				<?php } ?>
				
			</li>
		</ul>
		<?php } ?>
		<ul class="nav pull-right">
			<li>
				<a href="#" id="profile"><?php echo $this->session->userdata('username') ?></a>
			</li>
			<li>
				<a href="<?php echo base_url() ?>admin.php/signout" id="signout">Sign out</a>
			</li>
		</ul>
		</div><!-- /container -->
	</div><!-- /navbar-inner -->
</div><!-- /top-navbar -->