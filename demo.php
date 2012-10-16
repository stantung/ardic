<?php
     $username = 'hammhuang';
	 $password = 'lit89dmz';
     $curlhandle = curl_init();
	 curl_setopt($curlhandle, CURLOPT_URL, "http://twitter.com/statuses/user_timeline.xml");
	 curl_setopt($curlhandle, CURLOPT_USERPWD, $username.':'.$password);
     curl_setopt($curlhandle, CURLOPT_RETURNTRANSFER, 1);
     $response = curl_exec($curlhandle);
     curl_close($curlhandle);
     $xmlobj = new SimpleXMLElement($response);
	 foreach ($xmlobj->status as $status)
	 {
    	echo $status->text.'<br /> by'.$status->user->screen_name.' at '
    	.date("g:i: A D, F jS Y",strtotime($status->created_at)).'<br /> <br /> ' ;
    }
?>
