<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Signin extends CI_Controller {
	
	public function index()
	{
		$this->load->view('signin');
	}
	
	public function _submit_validate()
	{
		$this->form_validation->set_rules('username', 'Username', 'trim|required|callback_authenticate');
		$this->form_validation->set_rules('password', 'Password', 'trim|required');
		$this->form_validation->set_message('authenticate','Invalid login. Please try again.');
		return $this->form_validation->run();
	}
	
	public function submit()
	{
		if ($this->_submit_validate() === FALSE) {
			$this->index();
			return;
		}
		redirect('home', 'refresh');
	}
	
	public function authenticate()
	{
		$this->db->select('*');
		$this->db->from('manager');
		$this->db->where('username', $this->input->post('username'));
		// $this->db->where('password', $this->encrypt->encode($this->input->post('password')));
		$u = $this->db->get()->result();
		
		if (count($u) >= 1) {
			if ($this->encrypt->decode($u[0]->password) == $this->input->post('password')) {
				$data = array(
					'username'     => $u[0]->username,
					'logged_in'    => TRUE,
					'account_type' => 'manager'
				);
				$this->session->set_userdata($data);
				return TRUE;
			} else {
				return FALSE;
			}
		} else {
			return FALSE;
		}
	}
	
	// public function addUser()
	// {
	// 	$u = array(
	// 		'username' => 'hhuang@beefdaddy.com',
	// 		'password' => $this->encrypt->encode('lit89dmz'),
	// 		'created_at' => unix_to_human(time(), TRUE, 'us')
	// 	);
	// 	$this->db->insert('manager', $u);
	// }
	
}