<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request; //librerias http
use Symfony\Component\Validator\Constraints\Date;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\CacheService;
use App\Entity\{GrupoMaterial,Producto,Unidad,Usuario,Transaccion};

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
        $cantidad = $request->request->get('number');
        $fecha = $request->request->get('date');
        $usuarioExterno = $request->request->get('person');
        $codP = $request->request->get('idP');
        $marca = $request->request->get('marca');
        $color = $request->request->get('color');
        $idT = $request->request->get('idT');
        $procedencia = $request->request->get('proceden');

        $usuarioModificacion = $cache->get('usuario');
        $producto = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$codP]);
        $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$usuarioModificacion->getId()]);
        /* return $this->json($procedencia); */
        
        $operacion = 0;
        if($data1 === 'salida'){
            $transaccion = $em->getRepository(Transaccion::class)->findOneBy(['id'=>$idT]);
            
            $operacion = $producto->getCantidadProducto() - $cantidad;
            $operacionTransac = $transaccion->getDescripcionProducto() - $cantidad;
            $producto
                    ->setCantidadProducto($operacion);
            $transaccion
                    ->setDescripcionProducto($operacionTransac);
        }else{
            $transaccion = new Transaccion();
            $operacion = $producto->getCantidadProducto() + $cantidad;
            $producto
                    ->setCantidadProducto($operacion);
            $transaccion
                    ->setDescripcionProducto($cantidad);
        }
        
        $transaccion = $this->seteoDataTransaccion($procedencia,$transaccion,$data1,$cantidad,$fecha,$usuario,$producto,$usuarioExterno,$codP,$marca,$color);
        $aux = $this->envioDatosDB($transaccion,$producto,$em);

        return $this->json($aux);
    }
    /**
     * @Route("/listTransaccion", name="listTransaccion")
     */
    public function listTransaccion(EntityManagerInterface $em, CacheService $cache)
    {
        $listaT = [];
        $idTransaccion = $cache->get('transaccionProductoId');
        $transacciones = $em->getRepository(Transaccion::class)->findBy(['codigoProducto'=>$idTransaccion]);
        if($transacciones){
            foreach($transacciones as $object){
                if($object->getDescripcionProducto() !== "")
                    array_push($listaT,$object);
            }
            return $this->json($listaT);
        }else{
            return $this->json(null);
        }
        
    }
    /**
     * @Route("/listarInmuebles", name="listarInmuebles")
     */
    public function listInmuebles(EntityManagerInterface $em, CacheService $cache,Request $request)
    {
        $idInm = $request->request->get('idInm');
        $usuario = $cache->get('usuario');
        if($usuario->getIdRol()->getId() === 1){
            $departamento = $cache->get('departamentoPE');
            $productos = $em->getRepository(Producto::class)->findBy(['idUnidad'=>$departamento],['id'=>'ASC']);
            if($productos){
                if($idInm === "1"){
                    $listaT = [];
                    foreach($productos as $listadoProd){
                        if($listadoProd->getTipoVehiculo()){
                            array_push($listaT,$listadoProd);
                        }
                    }
                    return $this->json($listaT);
                }else{
                    $listaT = [];
                    foreach($productos as $listadoProd){
                        if(!$listadoProd->getTipoVehiculo()){
                            array_push($listaT,$listadoProd);
                        }
                    }
                    return $this->json($listaT);
                }  
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no valido!");
        } 
    }
    /**
     * @Route("/getOneProductTransaction", name="getOneProductTransaction")
     */
    public function getOneProductTransaction(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $idPT = $request->request->get('codigo');
        $producto = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$idP]);
        $usuario = $em->getRepository(Usuario::class)->findAll();
        $usuarioExternos = $this->filtroUsuariosExternos($usuario);
        if($producto){
            return $this->json([$producto,$usuarioExternos]);   
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/cacheSetproductoDetallado", name="cacheSetproductoDetallado")
     */
    public function cacheSetproductoDetallado(EntityManagerInterface $em, CacheService $cache, Request $request)
    {
        $idP = $request->request->get('idP');
        if($idP){
            $cache->add('transaccionProductoId',$idP);
            return $this->json("ok");
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/deleteCacheTransaccion", name="deleteCacheTransaccion")
     */
    public function deleteCacheTransaccion(EntityManagerInterface $em, CacheService $cache)
    {
        return $this->json($cache->delete('transaccionProductoId'));
    }

    /**
     * @Route("/getTransaccionSalida", name="getTransaccionSalida")
     */
    public function getTransaccionSalida(EntityManagerInterface $em, Request $request)
    {
        $idP = $request->request->get('codigo');
        $transaccion = $em->getRepository(Transaccion::class)->findOneBy(['id'=>$idP]);
        $usuario = $em->getRepository(Usuario::class)->findAll();
        $usuarioExternos = $this->filtroUsuariosExternos($usuario);
        if($transaccion){
            return $this->json([$transaccion,$usuarioExternos]);
        }else{
            return $this->json(null);
        }
    }

    /**
     * @Route("/getCacheTransaccion", name="getCacheTransaccion")
     */
    public function getCacheTransaccion(EntityManagerInterface $em, CacheService $cache)
    {
        return $this->json($cache->get('transaccionProductoId'));
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
        $usuario = $em->getRepository(Usuario::class)->findAll();
        $usuarioExternos = $this->filtroUsuariosExternos($usuario);
        if($producto){
            return $this->json([$producto,$usuarioExternos]);   
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
            ->setMarca($data['marca'])
            ->setColor($data['color'])
            //->setTiempoEntreGestion()
            ->setIdUnidad($departamento)
            ->setIdGrupo($grupo)
            ;
        return $producto;
    }
    private function filtroUsuariosExternos($usuario){
        $lista =[];
        foreach($usuario as $data){
            if($data->getIdRol()->getId() > 5)
                array_push($lista,$data);
        }
        return $lista;
    }
    private function envioDatosDB(Transaccion $transaccion,Producto $producto, EntityManagerInterface $em){
        $em->persist($producto);
        $em->flush();

        $em->persist($transaccion);
        $em->flush();
        return "ok";
    }
    private function seteoDataTransaccion($procedencia,Transaccion $transaccion,$accion,$cantidad,$fecha,Usuario $usuarioModificacion,Producto $producto,$usuarioExterno,$codP,$marca,$color){
        $entrada = $salida = "";
        $nombre = $producto->getDescripcionProducto();
        if($fecha !== "null"):
            $fechaCaducidad = \DateTime::createFromFormat('Y-m-d', $fecha);
        else:   
            $fechaCaducidad = null;
        endif;
        
        if(!$marca){$marca = "desconocida";}
        if(!$color){$color = "desconocido";}
        $fechaActual = date('Y-m-d');
        $fechaOperacion = \DateTime::createFromFormat('Y-m-d', $fechaActual);
        if($accion === "entrada"){
            $entrada = "Se aumento ${cantidad} unidades al producto: ${nombre}";
        }else{
            $salida = "Se resto ${cantidad} unidades al producto: ${nombre}";
        }
        $transaccion
                    
                    ->setResponsable($usuarioExterno)
                    ->setEntradaProducto($entrada)
                    ->setSalidaProducto($salida)
                    ->setMarca($marca)
                    ->setColor($color)
                    ->setFechaOperacion($fechaOperacion)
                    ->setFechaCaducidad($fechaCaducidad)
                    ->setIdUsuario($usuarioModificacion)
                    ->setCodigoProducto($producto)
                    ->setProcedencia($procedencia)
                    ;
        return $transaccion;
    }
}