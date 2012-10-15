<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* 
*/
class Admin
{
	
	// public $CI;
	
	function __construct()
	{
		$this->is_signin();
		$this->init();
		// $this->_enable_profiler(TRUE);
	}
	
	private function init()
	{
		
		$CI =& get_instance();
		
		//	後台的人數統計		
		$query = $CI->db->query('SELECT * FROM `sys_session_store` group by ip_address');
		$CI->ONLINE_BACKEND_COUNT = $query->num_rows();
	}
	
	private function _enable_profiler($turn_on = FALSE)
	{
		$CI =& get_instance();
		$CI->output->enable_profiler($turn_on);
	}	
	
	
	public function is_signin()
	{		
		$CI =& get_instance();
		// $CI->load->library('session');
				
		if ($CI->uri->segment(1, 0) !== "signin") {	
			
			// echo $CI->session->userdata('accout_type');
			// echo $CI->session->userdata('logged_in');
					
			if ($CI->session->userdata('accout_type') != "manager" && 
				$CI->session->userdata('logged_in') == FALSE) {
				redirect('signin', 'refresh');
			}
		}
	}
	
	public function is_timeout()
	{
		$CI =& get_instance();
		// // $this->Admin->is_signin();
		if ($CI->session->userdata('accout_type') != "manager" && 
			$CI->session->userdata('logged_in') == FALSE) {
			redirect('signin', 'refresh');
		}
	}
	
	// public function signout()
	// {
	// 	$CI =& get_instance();
	// 	$CI->session->sess_destroy();
	// 	redirect('signin', 'refresh');
	// }
			
}
