<?php

class Sys_menu extends CI_Model
{
	
	function __construct()
	{
		parent::__construct();			
	}
	
	public function get_sysmenu()
	{
		$query = $this->db->query(
			"SELECT * FROM `sys_menu` WHERE parent_id = 0 AND published = 'Y' AND deleted = 'N' ORDER BY ordering ASC"
		)->result();
		// echo $this->db->last_query().br(1);
		return $query;
	}
	
	public function get_child_sysmenu($id)
	{
		$query = $this->db->query(
			"SELECT * FROM sys_menu WHERE parent_id = ? AND published = 'Y' AND deleted = 'N' ORDER BY ordering ASC"
			, $id
		)->result();
		// echo $this->db->last_query().br(1);
		return $query;
	}
	
}
