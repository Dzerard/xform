<?php 

    class saveFile {
        
        protected $_path      = '../public/files/contributors/';
        protected $_extension = 'json';
        protected $_fileName  = 'contributors_ext.json';

        public function __construct() {
            return;
        }

        public function checkExtension($ext) {
            if($ext === $this->_extension) {
                return true;
            } 
            return false;
        }
        
        public function upload() {

            $post = $_POST;
            $file = $_FILES;
           
            if($post) {                    
                                        
                if(isset($post['saveFile']) && !empty($file)) {
                                     
                    $ext = explode(".", $file["contibutorsFile"]["name"]); 
                    $extension = $this->checkExtension(end($ext));                   
                    
                    //@todo validators $this->checkType($file["file"]["type"]), size etc.
                    
                    if($extension) {                                               
                                         
//                        if (file_exists("img/small/" . $file["file"]["name"])) {
//                            echo $file["file"]["name"] . " ta nazwa(plik) już istnieje ! </div></div>";
//                        }                            
                        
                        move_uploaded_file($file["contibutorsFile"]["tmp_name"], $this->_path  . $this->_fileName);
                        
                        //@todo check file if coorect structure                        
                        $response = json_encode(array('response' => 'SAVED_OK'));  
                        
                    } else {
                        $response = json_encode(array('err' => 'ERROR_BAD_EXTENSION'));                   
                    }                    
                    
                    echo $response;
                    exit;
                    
                }               
            }
        }
    }
	
    $listener = new saveFile();
    $listener->upload();
