<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request; //librerias http
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CacheService;
use App\Entity\{GrupoMaterial,Producto,Unidad};

class InventoryController extends AbstractController
{
    /**
     * @Route("/newProduct", name="newProduct")
     */
    public function newProduct(Request $request, EntityManagerInterface $em,CacheService $cache)//no asignar otra variable de entrada
    {  
        $data = $request->request->get('producto');
        $idUnidad = $cache->get('departamentoPE');
        $cacheProducto = $cache->get('viewProducto');
        $ip = $request->getClientIp();
        if(!$cacheProducto):
            $producto = new Producto();
            $productRepeat = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$data['codigo']]);
            if($productRepeat){
                return $this->json(null);
            }else{
                $aux = $this->addProduct($producto, $data, $em, $ip, $idUnidad); 
                return $this->json(['agregado',$idUnidad]);
            }
        else:
            $producto = $em->getRepository(Producto::class)->find($cacheProducto->getId());
            $this->addProduct($producto, $data, $em, $ip, $idUnidad);
            return $this->json(['actualizó',$idUnidad]);
        endif;
    }
    /**
     * @Route("/newTransaccionsProduct", name="newTransaccionsProduct")
     */
    public function newTransaccionsProduct(Request $request, EntityManagerInterface $em,CacheService $cache)//no asignar otra variable de entrada
    {  
        $data1 = $request->request->get('action');
        $data2 = $request->request->get('number');
        $fecha = $request->request->get('date');

        return $this->json([$data1,$data2,$fecha]);
        
        $idUnidad = $cache->get('departamentoPE');
        $cacheProducto = $cache->get('viewProducto');
        $ip = $request->getClientIp();
        if(!$cacheProducto):
            $producto = new Producto();
            $productRepeat = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$data['codigo']]);
            if($productRepeat){
                return $this->json(null);
            }else{
                $aux = $this->addProduct($producto, $data, $em, $ip, $idUnidad); 
                return $this->json(['agregado',$idUnidad]);
            }
        else:
            $producto = $em->getRepository(Producto::class)->find($cacheProducto->getId());
            $this->addProduct($producto, $data, $em, $ip, $idUnidad);
            return $this->json(['actualizó',$idUnidad]);
        endif;
    }
    /**
     * @Route("/deleteProducto", name="deleteProducto")
     */
    public function deleteProductos(EntityManagerInterface $em, Request $request)
    {
        $idP = $request->request->get('id');
        $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$idP]);
        if($producto){
            $em->remove($producto);
            $em->flush();
            return $this->json(True);   
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/getProducto", name="getProducto")
     */
    public function getProducto(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $idP = $request->request->get('codigo');
        $producto = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$idP]);
        
        if($producto){
            return $this->json($producto);   
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/cacheGetProducto", name="cacheGetProducto")
     */
    public function cacheGetProducto(EntityManagerInterface $em, CacheService $cache)
    {
        $cacheProducto = $cache->get('viewProducto');
        if($cacheProducto){
            $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$cacheProducto->getId()]);
            return $this->json($producto);
        }else{
            return $this->json(false);
        }
    }
    /**
     * @Route("/deleteCacheProducto", name="deleteCacheProducto")
     */
    public function deleteCacheProducto(EntityManagerInterface $em, CacheService $cache)
    {
        return $this->json($cache->delete('viewProducto'));
    }
    
    /**
     * @Route("/cacheSetProducto", name="cacheSetProducto")
     */
    public function cacheSetProducto(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $idP = $request->request->get('idProd');
        $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$idP]);
        $cache->add('viewProducto',$producto);
        if($producto){
            return $this->json(true);   
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/getCasaHogar", name="getCasaHogar")
     */
    public function getList(EntityManagerInterface $em, CacheService $cache)
    {
        $departamento = $cache->get('departamentoPE');
        $productos = $em->getRepository(Producto::class)->findBy(['idUnidad'=>$departamento],['id'=>'ASC']);
        if($productos){
            return $this->json($productos);
        }else{
            return $this->json(null);
        }
        
    }

    /**
     * @Route("/typePoductoCache", name="typePoductoCache")
     */
    public function typeProductCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $departamento = $request->request->get('id');
        $cache->add('departamentoPE', $departamento);
        return $this->json($departamento);
    }
    /**
     * @Route("/getTypePoductoCache", name="getTypePoductoCache")
     */
    public function getTypePoductoCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        return $this->json($cache->get('departamentoPE'));
    }
    /**
     * @Route("/deleteTypePoductoCache", name="deleteTypePoductoCache")
     */
    public function deleteTypePoductoCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        return $this->json($cache->delete('departamentoPE'));
    }
    /**
     * @Route("/getProxCaducar", name="getProxCaducar")
     */
    public function getListProxCaducidad(EntityManagerInterface $em)
    {
        $newList = [];
        $productos = $em->getRepository(Producto::class)->findBy([],['id'=>'ASC']);
        if($productos){
            foreach($productos as $listadoProd){
                $dateFormat = $listadoProd->getFechaCaducidad();
                $dateMod = new \DateTime('now');
                if($dateFormat){
                    $aux = $dateFormat;
                    $aux->modify("-3 day");
                    if(($dateMod >= $dateFormat) || ($dateMod >= $aux)){//|| ($dateFormat->modify("-3 day") <= $dateMod))){
                        $aux->modify("+3 day");
                        array_push($newList,$listadoProd);
                    }
                }
            }    
            return $this->json($newList);
        }else{
            return $this->json([]);
        }
        
    }
    // ----------------------- private function ---------------
    private function addProduct(Producto $producto, $data,EntityManagerInterface $em, $ip, $idUnidad){
        
        $departamento = $em->getRepository(Unidad::class)->findOneBy(['id'=>$idUnidad]);
        $categoriaProducto = $em->getRepository(GrupoMaterial::class)->findOneBy(['id'=>$data['idGrupo']]);
        $producto = $this->setDataProduct($producto, $data, $ip, $departamento, $categoriaProducto);
        $em->persist($producto);
        $em->flush();
    }
    private function setDataProduct(Producto $producto, $data, $ip,Unidad $departamento,GrupoMaterial $grupo){
        $fechaCaducidad = $data['fechaCaducidad'];
        if($fechaCaducidad):
            $fechaCaducidad = \DateTime::createFromFormat('Y-m-d', $fechaCaducidad);
        else:   
            $fechaCaducidad = null;
        endif;
        $fechaIngreso = \DateTime::createFromFormat('Y-m-d', $data['fechaIngreso']);
        $producto
            ->setCodigo($data['codigo'])
            ->setDescripcionProducto($data['descripcionProducto'])
            ->setCantidadProducto($data['cantidadProducto'])
            ->setUnidadMedida($data['unidadMedida'])
            ->setEstado($data['estado'])
            ->setFechaIngreso($fechaIngreso)
            ->setFechaCaducidad($fechaCaducidad)
            ->setProcedencia($data['procedencia'])
            ->setObservaciones($data['observaciones'])
            //->setTiempoEntreGestion()
            ->setIdUnidad($departamento)
            ->setIdGrupo($grupo)
            ;
        return $producto;
    }
}