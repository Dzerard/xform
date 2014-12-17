<?php 

    class settings {
        
        protected $file      = '../libs/config.json';
        protected $settings  = array(
            'author'     => 'Dzerard',
            'filePath'   => '../public/files/contributors/contributors.json',
            'connect'    => 'default',
            'gitHubUser' => 'x-formation'            
        );

        public function __construct() {
            return;
        }

        public function createFile() {
            $arr = array(
                "defaultConnection" => "file",
                "url" => "",
                "defaultUser" => "x-formation",
                "otherUsers" => array(
                    "name" => ["Dzerard"]
                ),
                "connectedUser" => "x-formation",            
                "author" => "Dzerard",
                "homepage" => "lukaszgielar.com"            
            );
            return json_encode($arr);
        }        
        
        public function saveFile() {
            
            $post = $_POST;
            
            //@todo testy
            @$data = json_decode(file_get_contents($this->file)); 
            
            if(is_null($data)) {
                $myfile = fopen($this->file, "c") or die("Unable to open file!");
                fwrite($myfile, $this->createFile());                 
                fclose($myfile);
            }
            
            $response = json_encode(array('response' => ''));
            
            //@todo refactoring
            if(isset($post['url']) && !empty($post['url'])) {        
                $response = $this->saveUrl($post);                                                                        
            }            
            if(isset($post['connectRadio']) && !empty($post['connectRadio'])) {            
                $response = $this->saveConnectionType($post);                                              
            }            
            if(isset($post['userRadio']) && !empty($post['userRadio'])) {
                $response = $this->saveDefaultUser($post);
            }
            echo $response;
            exit;
            
        }
        
        public function saveDefaultUser($post) {
            
            $user = $post['userRadio'];
            
            try {
                $myfile    = fopen($this->file, "r") or die("Unable to open file!");            
                $txt       = fread($myfile,filesize($this->file));
                fclose($myfile);

                $data      = json_decode($txt);
                $data->defaultUser = strip_tags($user);
                $save      = json_encode($data);      

                $writeFile    = fopen($this->file, "w") or die("Unable to open file!");
                fwrite($writeFile, $save);
                fclose($writeFile);   

                return $response = json_encode(array('response' => 'file_updated_user_set','status' => 'ok'));  

            } catch (Exception $e) {
                return $response = json_encode(array('response' => 'file_error_user_set', 'status' => 'err'));                                                                               
            }
        }
        
        public function saveUrl($post){
            try {
                $myfile    = fopen($this->file, "r") or die("Unable to open file!");            
                $txt       = fread($myfile,filesize($this->file));
                fclose($myfile);

                $data      = json_decode($txt);
                $data->url = preg_replace("/&#?[a-z0-9]+;/i", "", strip_tags($post['url']));
                $save      = json_encode($data);      

                $writeFile    = fopen($this->file, "w") or die("Unable to open file!");
                fwrite($writeFile, $save);
                fclose($writeFile);   

                return $response = json_encode(array('response' => 'file_updated','status' => 'ok'));  

            } catch (Exception $e) {
                return $response = json_encode(array('response' => 'file_error', 'status' => 'err'));                                                                               
            }
        }
        
        public function saveConnectionType($post){
            try {
                $myfile    = fopen($this->file, "r") or die("Unable to open file!");            
                $txt       = fread($myfile,filesize($this->file));
                fclose($myfile);

                $data      = json_decode($txt);                                        
                $data->defaultConnection = $this->checkConnectRadio($post['connectRadio']);
                $save      = json_encode($data);      

                $writeFile    = fopen($this->file, "w") or die("Unable to open file!");
                fwrite($writeFile, $save);
                fclose($writeFile);   

                return $response = json_encode(array('response' => 'file_updated_connection_contributors','status' => 'ok'));  

            } catch (Exception $e) {
                return $response = json_encode(array('response' => 'file_error_connection_contributors', 'status' => 'err'));                                                                               
            }    
        }
        
        public function checkConnectRadio($connect) {
            
            $result = 'default';
            switch($connect) {
                case 'file' :
                    $result = 'file';
                    break;
                case 'url' :
                    $result = 'url';
                    break;
                default :
                    break;
            }
            return $result;                                    
        }
        
    }
	
    $listener = new settings();
    $listener->saveFile();
