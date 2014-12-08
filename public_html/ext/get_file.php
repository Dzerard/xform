<?php 

    class xformation {

        public function __construct() {
                return;
        }

        public function getConfig() {

                $post = $_POST;
                
                if($post) {

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $post['url']);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                    $data = curl_exec($ch);
                    curl_close($ch);
                    
                    $response = json_encode(array('response' => json_decode($data)));                   
                    echo $response;
                    exit;
                }
        }	

    }
	
    $listener = new xformation();
    $listener->getConfig();




