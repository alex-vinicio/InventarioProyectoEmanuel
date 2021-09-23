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
        
        $listaU = [];
        if($mail && $passw){
            $usuario = $em->getRepository(Usuario::class)->findOneBy(['usuario'=>$mail,'password'=>$passw]);
        }else{
            return $this->json(false);
        }

        if($usuario){
            
            $textHash = password_hash($usuario->getId()."2".$usuario->getNombre(), PASSWORD_BCRYPT);
            $listaU = $cache->get('usuario');
            if($listaU){
                if(!password_verify($usuario->getId()."2".$usuario->getNombre(), $textHash)){// return null or false if decrypt don't return value valid
                    return $this->json(false);
                }
                
                if($request->cookies->get('hash')){//check if login usin a existential cache in browsers
                    $idUserHash = $request->cookies->get('hash');
                    $listaTemporalCheck = [];
                    foreach($listaU as $user){
                        if(!password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                            array_push($listaTemporalCheck, $user);//add value in list aux if id encryoted is diferent or don't exist that user in cache    
                        }
                    } 
                    $listaU = $listaTemporalCheck;
                }
                $boolrepetido = false;
                foreach($listaU as $user){
                    if($user->getId() == $usuario->getId()){//compara if request of the client is in cache users
                        $boolrepetido = true;
                        break;
                    }
                }
                if($boolrepetido == false){
                    $cache->delete('usuario');
                    array_push($listaU,$usuario);
                    $cache->add('usuario',$listaU);
                }else{
                    $listaTemporal = [];
                    foreach($listaU as $user){
                        if($user->getId() != $usuario->getId()){
                            array_push($listaTemporal, $user);
                        }
                    } 
                    $cache->delete('usuario');
                    array_push($listaTemporal, $usuario);
                    $cache->add('usuario',$listaTemporal);
                }
            }else{
                $listaUAux = [];
                $cache->delete('usuario');
                array_push($listaUAux, $usuario);
                $cache->add('usuario',$listaUAux);
            }

            return $this->json([true,$usuario->getNombre(),$textHash]);
        }else{
            return $this->json(false);
        }
    }
    /**
     * @Route("/verificacionIpCliente", name="verificacionIpCliente")
     */
    public function prueba(Request $request, EntityManagerInterface $em, CacheService $cache)//no asignar otra variable de entrada
    {  
        $idUserHash = $request->cookies->get('hash');
        $users = $cache->get('usuario');
        if($users){ 
            $boolCheckIp = false;
            foreach($users as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    break;
                }
            }
            //return $this->json($boolCheckIp);
            if($boolCheckIp){
                return $this->json("ok");
            }else{
                return $this->json(false);
            }
        }else{
            return $this->json(null);
        }
    }

    /**
     * @Route("/getAllUsers", name="getAllUsers")
     */
    public function getAllUsers( Request $request, EntityManagerInterface $em, CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if($usuario){
            $boolCheckIp = false;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    break;
                }
            }
            if($boolCheckIp){
                $usuarios = $em->getRepository(Usuario::class)->findAll(['nombre'=>'ASC']);
                return $this->json($usuarios);
            }else{
                return $this->json(false);
            }
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/getAllUsersCustodio", name="getAllUsersCustodio")
     */
    public function getAllUsersCustodio( Request $request, EntityManagerInterface $em, CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if($usuario){
            $boolCheckIp = false;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    break;
                }
            }
            if(!$boolCheckIp){
                return $this->json(null);
            }
            $listaUser = [];
            $usuarios = $em->getRepository(Usuario::class)->findAll(['nombre'=>'ASC']);
            foreach($usuarios as $user){
                if($user->getIdRol()->getId()>=1 && $user->getIdRol()->getId()<=5 ){
                    if($user->getEstado() == true){
                        array_push($listaUser,[
                            'id'=> $user->getId(),
                            'nombre'=>$user->getNombre(),
                            'mail'=>$user->getUsuario(),
                            'cargo'=> $user->getIdRol()->getNombreRol()
                        ]);
                    }
                }
            }
            return $this->json($listaUser);
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
        $idUserHash = $request->cookies->get('hash');
        $ipC = $request->getClientIp();
        $userLogin = $cache->get('usuario');
        $telefono = $request->request->get('telefono');
        $organizacion = $request->request->get('organizacion');
        $rol = $em->getRepository(Rol::class)->findOneBy(['id'=>$tipo]);
        if($userLogin){
            $boolCheckIp = false;
            $idRol = null;
            foreach($userLogin as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if(!$boolCheckIp && ($idRol==null)){
                return $this->json(null);
            }
            if(!$id){
                $usuario = new Usuario;
                $aux = "creado";
            }else{
                $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$id]);
                $aux = "modificado";
            }
            $usuario = $this->setUser($rol,$nombre,$pws,$correo,$usuario,$ipC, $telefono,$organizacion);
            $this->flushUser($usuario,$em);
        
            return $this->json([$aux,$idRol]);
        }else{
            return $this->json("Usuario no permitido");
        }
    }

    /**
     * @Route("/deleteUser", name="deleteUser")
     */
    public function deleteUser(Request $request, EntityManagerInterface $em,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idU = $request->request->get('id');
        $idUserHash = $request->cookies->get('hash');
        $boolCheckIp = false;
        $boolId = false;
        if(!$usuario){
            return $this->json(null);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                if($user->getIdRol()->getId() == 1){
                    $boolId = true;
                }
                break;
            }
        }
        if(!$boolCheckIp){
            return $this->json(null);
        }
        if($boolId == true){
            $userD = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            $em->remove($userD);
            $em->flush();
            return $this->json(true);
        }else{
            return $this->json("Usuario no permitido");
        }
    }

     /**
     * @Route("/cacheUpdateUser", name="cacheUpdateUser")
     */
    public function cacheUpdateUser(Request $request, EntityManagerInterface $em,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idU = $request->request->get('idU');
        $idUserHash = $request->cookies->get('hash');
        $boolCheckIp = false;
        $boolId = false;
        if(!$usuario){
            return $this->json(null);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                if($user->getIdRol()->getId() == 1){
                    $boolId = true;
                }
                break;
            }
        }
        if(!$boolCheckIp){
            return $this->json(null);
        }
        if($boolId == true){
            $userModifie = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            if($userModifie){
                $cache->add('idUserModifie',$idU);
                return $this->json(true);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no permitido");
        }
    }
    //custodio cache
    /**
     * @Route("/cacheCustodioAsignacion", name="cacheCustodioAsignacion")
     */
    public function cacheCustodioAsignacion(Request $request, EntityManagerInterface $em,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idU = $request->request->get('idU');
        $idUserHash = $request->cookies->get('hash');
        $boolCheckIp = false;
        $boolId = false;
        if(!$usuario){
            return $this->json(null);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                if($user->getIdRol()->getId() == 1){
                    $boolId = true;
                }
                break;
            }
        }
        if(!$boolCheckIp){
            return $this->json(null);
        }
        if($boolId == true){
            $userModifie = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            if($userModifie){
                $cache->add('idUserCustodio',$idU);
                return $this->json(true);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no permitido");
        }
    }
    /**
     * @Route("/getUserCustodio", name="getUserCustodio")
     */
    public function getUserCustodio(Request $request, CacheService $cache, EntityManagerInterface $em){
        $idU = $cache->get('idUserCustodio');
        if($idU){
            $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            return $this->json([$usuario->getNombre(),$usuario->getId(), $usuario->getDetalle()]);
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/limpiarCacheCustodioU", name="limpiarCacheCustodioU")
     */
    public function limpiarCacheCustodioU( CacheService $cache){
        $cache->delete('idUserCustodio');
        if($cache->get('idUserCustodio')){
            return $this->json(false);
        }else{
            return $this->json(true);
        }
    }
    /**
     * @Route("/getUserModifie", name="getUserModifie")
     */
    public function getUserModifie(Request $request, CacheService $cache, EntityManagerInterface $em){
        $usuario = $cache->get('usuario');
        $id = $cache->get('idUserModifie');
        $idUserHash = $request->cookies->get('hash');
        $boolCheckIp = false;
        $boolId = false;
        if(!$usuario){
            return $this->json(null);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                if($user->getIdRol()->getId() == 1){
                    $boolId = true;
                }
                break;
            }
        }
        if(!$boolCheckIp){
            return $this->json(null);
        }
        if($boolId == true){
            $userModifie = $em->getRepository(Usuario::class)->findOneBy(['id'=>$id]);
            if($userModifie){
                return $this->json([$userModifie,true]);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("usuario no permitido!");
        }
    }

    /**
     * @Route("/limpiarCacheModifie", name="limpiarCacheModifie")
     */
    public function limpiarCacheModifie( CacheService $cache){
        $cache->delete('idUserModifie');
        return $this->json(true);
    }

    /**
     * @Route("/getUserData", name="getUserData")
     */
    public function getUserData(Request $request, CacheService $cache, EntityManagerInterface $em){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        $boolCheckIp = false;
        $idU = null;
        if(!$usuario){
            return $this->json(null);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                $idU = $user->getId();
                break;
            }
        }
        if(!$boolCheckIp){
            return $this->json(null);
        }
        if($idU){
            $user = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
            return $this->json([$user->getNombre(),$user->getIdRol()->getId(), $user->getDetalle()]);
        }else{
            return $this->json(null);
        }
    }
    
    /**
     * @Route("/logOut", name="logOut")
     */
    public function limpiarCacheUser(Request $request, CacheService $cache){
        $usuario = $cache->get('usuario');
        $listaU = [];
        $idUserHash = $request->cookies->get('hash');
        $ip = $request->getClientIp();
        $boolCheckIp = false;
        if(!$usuario){
            return $this->json(false);
        }
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
            }else{
                array_push($listaU, $user);
            }
        }
        if($boolCheckIp){
            $cache->delete('usuario');
            $cache->add('usuario',$listaU);
        }else{
            return $this->json(false);
        }   
        // limpieza cache usuario
        $cache->delete('idUserModifie');
        $cache->delete('idUserCustodio');
        //limpieza cache productos
        $cache->delete('patrimonio');
        $cache->delete('departamentoPE');
        $cache->delete('viewProducto');
        $cache->delete('patrimonioUpdate');
        $cache->delete('transaccionProductoId');
        $cache->delete('seleccionCustodios');
        $cache->delete('selectCustodio');
        return $this->json(true);
    }
    //                  funciones privadas   
    private function setUser(Rol $rol, $nombre, $pws, $correo,Usuario $usuario,$ipC, $telefono, $organizacion){
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
                ->setTelefono($telefono)
                ->setDetalle($organizacion)
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
