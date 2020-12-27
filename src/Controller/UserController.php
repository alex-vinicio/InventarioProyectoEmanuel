<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request; //librerias http
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CacheService;
use App\Entity\{Rol,Usuario};

class UserController extends AbstractController
{
    /**
     * @Route("/findUser", name="findUser")
     */
    public function loginUser(Request $request, EntityManagerInterface $em, CacheService $cache)//no asignar otra variable de entrada
    {  
        $mail = $request->request->get('correo_u');
        $passw = $request->request->get('contrasenia_u');
        if($mail && $passw){
            $usuario = $em->getRepository(Usuario::class)->findOneBy(['usuario'=>$mail,'password'=>$passw]);
        }else{
            return $this->json(false);
        }

        if($usuario){
            $cache->add('usuario',$usuario);
            return $this->json(true);
        }else{
            return $this->json(false);
        }
        
    }
    
    /**
     * @Route("/logOut", name="logOut")
     */
    public function limpiarCacheUser( CacheService $cache){
        $cache->delete('usuario');
        return $this->json(true);
    }
    
}
