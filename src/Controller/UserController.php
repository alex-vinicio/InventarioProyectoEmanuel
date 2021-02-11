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
     * @Route("/getAllUsers", name="getAllUsers")
     */
    public function getAllUsers( Request $request, EntityManagerInterface $em, CacheService $cache){
        $usuario = $cache->get('usuario');
        if($usuario){
            $usuarios = $em->getRepository(Usuario::class)->findAll(['nombre'=>'ASC']);
            return $this->json($usuarios);
        }else{
            return $this->json(null);
        }
        
    }

    /**
     * @Route("/addUser", name="addUser")
     */
    public function addUser(Request $request, EntityManagerInterface $em, CacheService $cache){
        $nombre = $request->request->get('nombre');
        $pws = $request->request->get('passw');
        $correo = $request->request->get('correo');
        $tipo = $request->request->get('tipoU');
        $id = $request->request->get('id');
        $ipC = $request->getClientIp();
        $userLogin = $cache->get('usuario');
        $rol = $em->getRepository(Rol::class)->findOneBy(['id'=>$tipo]);
        
        if(!$id){
            $usuario = new Usuario;
            $aux = "creado";
        }else{
            $aux = "modificado";
        }
        $usuario = $this->setUser($rol,$nombre,$pws,$correo,$usuario,$ipC);
        $this->flushUser($usuario,$em);

        return $this->json([$aux,$userLogin->getIdRol()->getId()]);
    }

    /**
     * @Route("/deleteUser", name="deleteUser")
     */
    public function deleteUser(Request $request, EntityManagerInterface $em,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idU = $request->request->get('id');
        $tipoRol = $usuario->getIdRol()->getId();
        if($tipoRol === 1){
            $userD = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            $em->remove($userD);
            $em->flush();
            return $this->json(true);
        }else{
            return $this->json("Usuario no permitido");
        }
    }

    /**
     * @Route("/getUserData", name="getUserData")
     */
    public function getUserData( CacheService $cache){
        $usuario = $cache->get('usuario');
        if($usuario){
            return $this->json([$usuario->getNombre(),$usuario->getIdRol()->getId()]);
        }else{
            return $this->json(null);
        }
        
    }
    
    /**
     * @Route("/logOut", name="logOut")
     */
    public function limpiarCacheUser( CacheService $cache){
        $cache->delete('usuario');
        return $this->json(true);
    }
    //                  funciones privadas   
    private function setUser(Rol $rol, $nombre, $pws, $correo,Usuario $usuario,$ipC){
        $fechaActual = date('Y-m-d');
        $fechaOperacion = \DateTime::createFromFormat('Y-m-d', $fechaActual);

        $usuario 
                ->setNombre($nombre)
                ->setUsuario($correo)
                ->setPassword($pws)
                ->setEstado(true)
                ->setNuevaClave(false)
                ->setFechaModificacion($fechaOperacion)
                ->setIpModificacion($ipC)
                ->setIdRol($rol)
                ;
        return $usuario;
    }

    private function flushUser(Usuario $user, EntityManagerInterface $em){
        $em->persist($user);
        $em->flush();
        return "save";
    }
    
}
