<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CacheService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\ProductoType;
use App\Entity\{GrupoMaterial,Producto,Unidad};
use Symfony\Component\HttpFoundation\Request; //librerias http

class AdminController extends AbstractController
{
    public function index(): Response
    {
        return $this->render('admin/index.html.twig');
    }

    public function viewAdmin(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        return $this->render('user/index.html.twig');
    }

    public function controlPanel(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        return $this->render('user/panelControlUsers.html.twig');
    }


    public function listCasaHogar(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
       
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $idRol = $usuario->getIdRol()->getId();
            if($idRol === 2 || $idRol === 1){
                return $this->render('inventory/listarInvCH.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
    }

    public function listCentroMedico(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        
        if(!$usuario){
            return $this->redirectToRoute('login');
        }else{
            $idRol = $usuario->getIdRol()->getId();
            if($idRol === 3 || $idRol === 1){
                return $this->render('inventory/listarCM.html.twig');
            }else{
                return $this->redirectToRoute('viewAdmin');
            }
        }
       
    }
    
    public function newInventory(EntityManagerInterface $em ,CacheService $cache){
        $usuario = $cache->get('usuario');
        $cacheProducto = $cache->get('viewProducto');
        if(!$usuario):return $this->redirectToRoute('login');endif;
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
        $cacheProductoDetallado = $cache->get('transaccionProducto');
        if(!$usuario):return $this->redirectToRoute('login');endif;
        if($cacheProductoDetallado){
            return $this->render('inventory/listaFiltradatransaccion.html.twig');
        }else{
            return $this->redirectToRoute('viewAdmin');
        }
        
    }
    
}
