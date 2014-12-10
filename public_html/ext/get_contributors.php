<?php 

    class xformation {

        public function __construct() {
                return;
        }

        public function getConfig() {

                $post = $_POST;
                
                if($post) {                    
                    
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
                    curl_setopt($ch, CURLOPT_HEADER, false);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_URL, $post['url']);
                    curl_setopt($ch, CURLOPT_REFERER, $post['url']);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                    $result = curl_exec($ch);
                    curl_close($ch);
                    
                    
                    echo json_encode(array('response' => json_decode($result)));
                    exit;                    
                }
        }	

    }
	
    $listener = new xformation();
    $listener->getConfig();




