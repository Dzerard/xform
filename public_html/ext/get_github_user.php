<?php 

    // This file is generated by Composer
    require_once 'php-github-api/vendor/autoload.php';

    $client = new \Github\Client(
        new \Github\HttpClient\CachedHttpClient(array('cache_dir' => 'tmp/github-api-cache'))
    );
    $client = new \Github\HttpClient\CachedHttpClient();
    $client->setCache(
        new \Github\HttpClient\Cache\FilesystemCache('tmp/github-api-cache')
    );
    
    $post = $_POST['q'];
    $result = null;
    
    if(isset($post) && !empty($post)) {        
        
        $client = new \Github\Client($client);
        $result = $client->api('user')->find($post);                
    }

    $response = json_encode($result);                   
    echo $response;
    exit;