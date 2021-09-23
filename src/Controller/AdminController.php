<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CacheService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\{ProductoType, UsuarioType};
use App\Entity\{GrupoMaterial,Producto,Unidad,Usuario,Rol};
use Symfony\Component\HttpFoundation\Request; //librerias http

class AdminController extends AbstractController
{
    public function index(): Response
    {
        return $this->render('admin/index.html.twig');
    }

    public function viewAdmin(EntityManagerInterface $em ,CacheService $cache,Request $request){
        $idUserHash = $request->cookies->get('hash');
        $usuario = $cache->get('usuario');
        if($usuario){
            $boolCheckIp = false;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    break;
                }
            }
            if(!$boolCheckIp){
                return $this->redirectToRoute('login');
            }else{
                return $this->render('user/index.html.twig');
            }
        }else{
            return $this->redirectToRoute('login');
        };
    }
    
    public function manualUsuario(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        return $this->render('user/manualUsuario.html.twig');
    }
    
    public function controlPanel(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($idRol == 1){
                return $this->render('user/panelControlUsers.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }

    public function listCasaHogar(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($idRol === 2 || $idRol === 1){
                return $this->render('inventory/listarInvCH.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }

    public function listCentroMedico(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($idRol === 3 || $idRol === 1){
                return $this->render('inventory/listarCM.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }
    
    public function newInventory(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        $cacheProducto = $cache->get('viewProducto');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($idRol === 2){
            return $this->redirectToRoute('casaHogar');
        }else{
            if($idRol === 3)
            return $this->redirectToRoute('centroMedico');
        }
        if($cacheProducto){
            $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$cacheProducto->getId()]);
            $form = $this->createForm(ProductoType::class, $producto = $producto);
        }else{
            $form = $this->createForm(ProductoType::class, $producto = new Producto());
        }
        return $this->render('inventory/crearNuevoProducto.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    public function transaccionProducto(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $cacheProductoDetallado = $cache->get('transaccionProductoId');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        if($cacheProductoDetallado){
            return $this->render('inventory/listaFiltradatransaccion.html.twig');
        }else{
            return $this->redirectToRoute('viewAdmin');
        }
    }

    public function usuariosGestion(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($idRol >= 1 && $idRol<=5){
            $form = $this->createForm(UsuarioType::class, $usuario = new Usuario());
            return $this->render('user/newUpdateUser.html.twig', [
                'form' => $form->createView(),
            ]);
        }else{
            return $this->redirectToRoute('login');
        }
    }
    public function listPatrimonio(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($idRol === 1){
                return $this->render('inventory/listaProductoPrimario.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }//asignarCustodio
    public function asignarCustodio(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuario as $user){
                if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($idRol === 1){
                return $this->render('inventory/cambiarCustodio.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }
    public function gestionPatrimonio(Request $request, EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $idUserHash = $request->cookies->get('hash');
        $cacheProducto = $cache->get('viewProducto');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if(password_verify($user->getId()."2".$user->getNombre(), $idUserHash)){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($idRol === 2){
            return $this->redirectToRoute('casaHogar');
        }else{
            if($idRol === 3)
            return $this->redirectToRoute('centroMedico');
        }
        if($cacheProducto){
            $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$cacheProducto->getId()]);
            $form = $this->createForm(ProductoType::class, $producto = $producto);
        }else{
            $form = $this->createForm(ProductoType::class, $producto = new Producto());
        }
        return $this->render('inventory/crearProductoPatrimonio.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    
}
