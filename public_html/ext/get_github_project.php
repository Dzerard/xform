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
    


    $client = new \Github\Client($client);

//    $client->authenticate('Dzerad', $password, \Github\Client::AUTH_HTTP_PASSWORD);
    
    $repositories = $client->api('user')->repositories('x-formation');
    $user = $client->api('user')->show('x-formation');
    //$users = $client->api('user')->starred('x-formation');
    $users =  $client->api('repo')->commits()->all('x-formation');
    
    $response = json_encode(array('response' => $repositories, 'user' => $user, 'users' => $users));                   
    echo $response;
    exit;
    