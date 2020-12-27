<?php

namespace App\Service;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

class CacheService
{     
    public function add($nombre, $valor){
        $cache = new FilesystemAdapter();
        $pr=$cache->getItem($nombre);
        $pr->set($valor);
        $cache->save($pr);
    }
    public function get($nombre){
        $cache = new FilesystemAdapter();
        $pr=$cache->getItem($nombre);
        if (!$pr->isHit()) {
            return false;
        }else{
            return $pr->get();
        }  
    }
    public function delete($nombre){
        $cache = new FilesystemAdapter();
        $cache->deleteItem($nombre);
    }
}
