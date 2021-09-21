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
        $listData = [];
        $lote = "";
        $idProductoPatrimonio = $cache->get('patrimonio'); 

        if($idProductoPatrimonio){
            if($idProductoPatrimonio === "1"){//productos generales
                $data = $request->request;
                $listData = $this->cargaDatosProductosGenerales($data);
            }else{//vehiculos
                $data = $request->request;
                $listData = $this->cargaDatosVehiculos($data);
            }
        }else{
            if($request->request->get('lote')){
                $lote = $request->request->get('lote');
            }
            $data = $request->request->get('producto');
            $listData = $this->cargaDatosProductosInsumosTrans($data,$lote);
        }
        
        $idUnidad = $cache->get('departamentoPE');
        $cacheProducto = $cache->get('viewProducto');
        $cachePatrimonio = $cache->get('patrimonioUpdate');
        $ip = $request->getClientIp();
        if($cachePatrimonio){
            $codP = intval($cachePatrimonio[0]);
            $usuarioModificacion = $cache->get('usuario');
            $boolCheckIp = false;
            $idRol = null;
            foreach($usuarioModificacion as $user){
                if($user->getIpModificacion() == $ip){
                    $boolCheckIp = true;
                    $idRol = $user->getIdRol()->getId();
                    break;
                }
            }
            if($boolCheckIp == false && !$idRol ){
                return $this->json(null);
            }
            $producto = $em->getRepository(Producto::class)->find($codP);
            $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idRol]);
            $transaccion = new Transaccion();
            $transaccion = $this->flushDataTransac($em, $transaccion, $producto, $usuario, $listData);
        }

        if((!$cacheProducto) && (!$cachePatrimonio)):
            $producto = new Producto();
            $productRepeat = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$listData[0]['codigo']]);
            if($productRepeat){
                return $this->json(null);
            }else{
                $aux = $this->addProduct($producto, $listData, $em, $ip, $idUnidad, $cache); 
                return $this->json(['agregado',$idUnidad]);
            }
        else:
            if($cacheProducto){
                $producto = $em->getRepository(Producto::class)->find($cacheProducto->getId());
            }else{
                $idP = intval($cachePatrimonio[0]);
                $producto = $em->getRepository(Producto::class)->find($idP);
            }
            $this->addProduct($producto, $listData, $em, $ip, $idUnidad, $cache);
            return $this->json(['actualizó',$idUnidad]);
        endif;
    }

    /**
     * @Route("/newTransaccionsProduct", name="newTransaccionsProduct")
     */
    public function newTransaccionsProduct(Request $request, EntityManagerInterface $em,CacheService $cache)//no asignar otra variable de entrada
    {  
        $dataTransaccion = $request->request;
        //return $this->json($dataTransaccion->get('dataMotivo'));
        $data1 = $dataTransaccion->get('action');
        $cantidad = $dataTransaccion->get('number');
        $fecha = $dataTransaccion->get('date');
        $usuarioExterno = $dataTransaccion->get('person');
        $codP = $dataTransaccion->get('idP');
        $marca = $dataTransaccion->get('marca');
        $color = $dataTransaccion->get('color');
        $idT = $dataTransaccion->get('idT');
        $procedencia = $dataTransaccion->get('proceden');
        $ip = $request->getClientIp();
        $usuarioModificacion = $cache->get('usuario');
        $boolCheckIp = false;
        $idU = null;
        foreach($usuarioModificacion as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idU = $user->getId();
                break;
            }
        }
        if($boolCheckIp == false ){
            return $this->json(null);
        }
        $producto = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$codP]);
        $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idU]);
        
        if($boolCheckIp){;
            $operacion = 0;
            if($data1 === 'salida'){
                $transaccion = $em->getRepository(Transaccion::class)->findOneBy(['id'=>$idT]);
                if($dataTransaccion->get('idM') !== "null"){
                    $extraDetalleT = $transaccion->getDataOperacion(). "[".$dataTransaccion->get('motivo').",".$dataTransaccion->get('detalleM')."]";
                }else{
                    $extraDetalleT = "[salida casa hogar]";
                }
                $operacion = $producto->getCantidadProducto() - $cantidad;
                $operacionTransac = $transaccion->getDescripcionProducto() - $cantidad;
                $detailTransaction = $transaccion->getDetalleTransaccion()."[".$cantidad.",".$fecha.",".$usuarioExterno.",S]";
                $producto
                        ->setCantidadProducto($operacion);
                $transaccion
                        ->setDetalleTransaccion($detailTransaction)
                        ->setDataOperacion($extraDetalleT)
                        ->setDescripcionProducto($operacionTransac);
            }else{
                $transaccion = new Transaccion();
                $operacion = $producto->getCantidadProducto() + $cantidad;
                $detailTransaction = "[".$cantidad.",".$fecha.",".$usuarioExterno.",E]"; //add . before = if concatenate a strings
                $extraDetalleT = "[".$dataTransaccion->get('motivo').",".$dataTransaccion->get('detalleM')."]";
                $producto
                        ->setCantidadProducto($operacion);
                $transaccion
                        ->setDetalleTransaccion($detailTransaction)
                        ->setDataOperacion($extraDetalleT)
                        ->setDescripcionProducto($cantidad);
            }
            
            $transaccion = $this->seteoDataTransaccion($procedencia,$transaccion,$data1,$cantidad,$fecha,$usuario,$producto,$usuarioExterno,$codP,$marca,$color);
            $aux = $this->envioDatosDB($transaccion,$producto,$em);

            return $this->json($aux);
        }else{
            return $this->json("Usuario no permitido");
        }
    }
    //seccion asignacion custodio
    /**
     * @Route("/productNoCustodio", name="productNoCustodio")
     */
    public function productNoCustodio(Request $request, EntityManagerInterface $em, CacheService $cache)
    {
        $listaT = [];
        $ip = $request->getClientIp();
        $usuario = $cache->get('usuario');
        $idRol = null;
        $boolCheckIp = false;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($boolCheckIp == false ){
            return $this->json(null);
        }
        if($idRol === 1){
            $productos = $em->getRepository(Producto::class)->findAll();
            if($productos){
                foreach($productos as $producto){
                    if(!$producto->getCustodio()){
                        array_push($listaT,[
                            'id'=> $producto->getId(),
                            'codigo'=> $producto->getCodigo(),
                            'nombre'=> $producto->getDescripcionProducto(),
                            'cantidad'=> $producto->getCantidadProducto(),
                            'marca'=> $producto->getMarca(),
                            'color'=> $producto->getColor(),
                            'estado'=> $producto->getEstado(),
                            'departamento'=> $producto->getIdUnidad()->getNombreUnidad(),
                            'observaciones'=> $producto->getObservaciones()
                        ]);
                    }
                }
                return $this->json($listaT);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no permitido");
        }
    }
    //get listado checks de tablas
    /**
     * @Route("/productNoCustodioMarcado", name="productNoCustodioMarcado")
     */
    public function productNoCustodioMarcado(Request $request, EntityManagerInterface $em, CacheService $cache)
    {
        $listaT = [];
        $ip = $request->getClientIp();
        $usuario = $cache->get('usuario');
        $idRol = null;
        $boolCheckIp = false;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($boolCheckIp == false ){
            return $this->json(null);
        }
        if($idRol === 1){
            $selectC = $cache->get('selectCustodio');
            if($selectC){
                foreach($selectC as $check){
                        if( $check['estado'] == 1){
                            $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$check['id']]);
                            array_push($listaT,[
                                'id'=> $producto->getId(),
                                'codigo'=> $producto->getCodigo(),
                                'nombre'=> $producto->getDescripcionProducto(),
                                'cantidad'=> $producto->getCantidadProducto(),
                                'marca'=> $producto->getMarca(),
                                'color'=> $producto->getColor(),
                                'estado'=> $producto->getEstado(),
                                'departamento'=> $producto->getIdUnidad()->getNombreUnidad(),
                                'observaciones'=> $producto->getObservaciones()
                            ]);
                        }
                }
                return $this->json($listaT);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no permitido");
        }
    }
    //modificar producto por cutodio
    /**
     * @Route("/modificarProductoCustodio", name="modificarProductoCustodio")
     */
    public function modificarProductoCustodio(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $idPT = $request->request->get('idUC');
        $tipoAccion = $request->request->get('tipoAccionC');
        $usuario = $em->getRepository(Usuario::class)->findOneBy(['id'=>$idPT]);
        if($usuario){
            $selectC = $cache->get('selectCustodio');
            if($selectC){
                if($tipoAccion == 0){
                    foreach($selectC as $check){
                        if( $check['estado'] == 1){
                            $producto = $em->getRepository(Producto::class)->findOneBy(['id'=>$check['id']]);
                            $producto->setCustodio($idPT); 

                            $em->persist($producto);
                            $em->flush();
                        }
                    }
                }
                return $this->json("Ok");
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/modificarCustodioExistente", name="modificarCustodioExistente")
     */
    public function modificarCustodioExistente(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $idUE = $request->request->get('idUE');
        $idUR = $request->request->get('idUR');
        $productos = $em->getRepository(Producto::class)->findBy(['custodio'=>$idUE]);
        //return $this->json($productos);
        if($productos){
            foreach($productos as $producto){
                $producto->setCustodio($idUR); 

                $em->persist($producto);
                $em->flush();
            }
            return $this->json("ok");
        }else{
            return $this->json(null);
        }
    }
    //estado check
    /**
     * @Route("/deleteSelectCustodio", name="deleteSelectCustodio")
     */
    public function deleteSelectCustodio( CacheService $cache)
    {
        $cache->delete('selectCustodio');
        return $this->json(true);
    }
    /**
     * @Route("/estadoSelectCustodio", name="estadoSelectCustodio")
     */
    public function estadoSelectCustodio(EntityManagerInterface $em, CacheService $cache, Request $request)
    {
        $listaT = [];
        $selectC = [];
        $idPC = intval($request->request->get('id'));
        $selectC = $cache->get('selectCustodio');
        //return $this->json($idPC);
        if($selectC){
            $listaT = $selectC;
            $cache->delete('selectCustodio');
            $valueExist = false;
            foreach($selectC as $object){
                if(intval($object['id']) === $idPC){
                    $valueExist = true;
                }
            }
            if($valueExist !== true){
                array_push($listaT, [
                    'id'=> $idPC,
                    'estado'=> 1
                ]);
            }else{
                $listaT = [];
                foreach($selectC as $object){
                    if(intval($object['id']) === $idPC){
                        if($object['estado'] === 0){
                            array_push($listaT, [
                                'id'=> $idPC,
                                'estado'=> 1
                            ]);
                        }else{
                            array_push($listaT, [
                                'id'=> $idPC,
                                'estado'=> 0
                            ]);
                        }
                    }else{
                        array_push($listaT,$object);
                    }
                }
            }
            $cache->add('selectCustodio', $listaT);
            return $this->json($cache->get('selectCustodio'));
        }else{
            array_push($listaT, [
                'id'=> $idPC,
                'estado'=> 1
            ]);
            $cache->add('selectCustodio', $listaT);
            return $this->json($cache->get('selectCustodio'));
        }
    }
    //seccion transaccion
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
     * @Route("/listarTransaccionAF", name="listarTransaccionAF")
     */
    public function listarTransaccionAF(EntityManagerInterface $em, CacheService $cache,Request $request)
    {
        $idInm = $request->request->get('idInm');
        $id = intval($idInm);
        $usuario = $cache->get('usuario');
        $ip = $request->getClientIp();
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($boolCheckIp == false ){
            return $this->json(null);
        }
        if($idRol === 1){
            $productos = $em->getRepository(Producto::class)->findBy(['idUnidad'=>3],['id'=>'ASC']);
            if($productos){
                $listaT = [];
                if($idInm === "1"){
                    foreach($productos as $listadoProd){
                        if($listadoProd->getTipoVehiculo()){
                            $transaccion = $em->getRepository(Transaccion::class)->findBy(['codigoProducto'=>$listadoProd->getId()],['id'=>'ASC']);
                            array_push($listaT, $transaccion);
                        }
                    }
                }else{
                    if($idInm === "2"){
                        foreach($productos as $listadoProd){
                            if(!$listadoProd->getTipoVehiculo() && !$listadoProd->getClaveCatastral()){
                                $transaccion = $em->getRepository(Transaccion::class)->findBy(['codigoProducto'=>$listadoProd->getId()],['id'=>'ASC']);
                                array_push($listaT, $transaccion);
                            }
                        }
                    }else{
                        foreach($productos as $listadoProd){
                            if($listadoProd->getClaveCatastral()){
                                $transaccion = $em->getRepository(Transaccion::class)->findBy(['codigoProducto'=>$listadoProd->getId()],['id'=>'ASC']);
                                array_push($listaT, $transaccion);
                            }
                        }
                    }
                }
                return $this->json($listaT);
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("Usuario no valido!");
        }
    }
    /**
     * @Route("/listarInmuebles", name="listarInmuebles")
     */
    public function listInmuebles(EntityManagerInterface $em, CacheService $cache,Request $request)
    {
        $idInm = $request->request->get('idInm');
        $id = intval($idInm);
        $usuario = $cache->get('usuario');
        $ip = $request->getClientIp();
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($boolCheckIp == false && !$idRol ){
            return $this->json(null);
        }
        if($idRol === 1){
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
                    if($idInm === "2"){
                        $listaT = [];
                        foreach($productos as $listadoProd){
                            if(!$listadoProd->getTipoVehiculo() && !$listadoProd->getClaveCatastral()){
                                array_push($listaT,$listadoProd);
                            }
                        }
                        return $this->json($listaT);
                    }else{
                        $listaT = [];
                        foreach($productos as $listadoProd){
                            if($listadoProd->getClaveCatastral()){
                                array_push($listaT,$listadoProd);
                            }
                        }
                        return $this->json($listaT);
                    }  
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
    public function getTransaccionSalida(EntityManagerInterface $em, Request $request, CacheService $cache)
    {
        $usuario = $cache->get('usuario');

        if($usuario){
            $idP = $request->request->get('codigo');
            $transaccion = $em->getRepository(Transaccion::class)->findOneBy(['id'=>$idP]);
            $usuario = $em->getRepository(Usuario::class)->findAll();
            $usuarioExternos = $this->filtroUsuariosExternos($usuario);
            $usuarioInterno = $this->filtroUsuariosInternos($usuario);
            if($transaccion){
                return $this->json([$transaccion,$usuarioExternos,$usuarioInterno]);
            }else{
                return $this->json(null);
            }
        }else{      
            return $this->json("No permitido!");
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
            $transacciones = $em->getRepository(Transaccion::class)->findBy(['codigoProducto'=>$producto->getId()]);
            if($transacciones){
                foreach($transacciones as $data){//delete all transaccion of the product for delete de product
                    $em->remove($data);
                    $em->flush();
                }
            }
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
        $usuarioInterno = $this->filtroUsuariosInternos($usuario);
        if($producto){
            return $this->json([$producto,$usuarioExternos, $usuarioInterno]);   
        }else{
            return $this->json(null);
        }
    }
    /**
     * @Route("/getAllAF", name="getAllAF")
     */
    public function getAllAF(EntityManagerInterface $em,CacheService $cache, Request $request)
    {
        $usuario = $cache->get('usuario');
        $listaT = [];
        $ip = $request->getClientIp();
        $boolCheckIp = false;
        $idRol = null;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $idRol = $user->getIdRol()->getId();
                break;
            }
        }
        if($boolCheckIp == false ){
            return $this->json(null);
        }
        if($idRol === 1){
            $producto = $em->getRepository(Producto::class)->findAll(['id'=>'ASC']);
            if($producto){    
                return $this->json($producto);
            }else{
                return $this->json("No se encontro productos");
            }
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
     * @Route("/getProductUserCustodio", name="getProductUserCustodio")
     */
    public function getProductUserCustodio(EntityManagerInterface $em, CacheService $cache)
    {
        $listaT = [];
        $listaUserCheck = $cache->get('seleccionCustodios');
        if($listaUserCheck == false || $listaUserCheck[0]['id']=="---" || count($listaUserCheck)<=1 ){
            return $this->json(null);
        }
        if($listaUserCheck[1]['id']=="---"){
            return $this->json(null);
        }
        $idUCustodio = $listaUserCheck[0]['id'];
        $productos = $em->getRepository(Producto::class)->findBy(['custodio'=>$idUCustodio],['id'=>'ASC']);
        //return $this->json(count($productos));
        if($productos){
            foreach($productos as $producto){
                array_push($listaT,[
                    'id'=> $producto->getId(),
                    'codigo'=> $producto->getCodigo(),
                    'nombre'=> $producto->getDescripcionProducto(),
                    'cantidad'=> $producto->getCantidadProducto(),
                    'marca'=> $producto->getMarca(),
                    'color'=> $producto->getColor(),
                    'estado'=> $producto->getEstado(),
                    'departamento'=> $producto->getIdUnidad()->getNombreUnidad(),
                    'observaciones'=> $producto->getObservaciones()
                ]);
            }
            return $this->json($listaT);
        }else{
            return $this->json([]);
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
     * @Route("/tipoPatrimonioCache", name="tipoPatrimonioCache")
     */
    public function tipoPatrimonioCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $departamento = $request->request->get('id');
        $cache->add('patrimonio', $departamento);
        return $this->json($departamento);
    }
    //cache seleccion 2 usuarios
     /**
     * @Route("/deleteCacheUsersCustodio", name="deleteCacheUsersCustodio")
     */
    public function deleteCacheUsersCustodio(CacheService $cache)
    {
        $cache->delete('seleccionCustodios');
        return $this->json(true);
    }
    /**
     * @Route("/cacheDosUsuarios", name="cacheDosUsuarios")
     */
    public function cacheDosUsuarios(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $lista = [];
        $idU = $request->request->get('id');
        $nombreU = $request->request->get('nombre');
        $listaSelect = $cache->get('seleccionCustodios');

        if($listaSelect){
            if(count($listaSelect) == 1){
                if($listaSelect[0]['id'] !== $idU){
                    array_push($listaSelect,[
                        'id'=> $idU,
                        'nombre'=>$nombreU,
                        'renovar'=>2
                    ]);
                    $cache->add('seleccionCustodios',$listaSelect);
                }else{
                    $cache->delete('seleccionCustodios');
                }
            }else{
                $boolMoreCheck = false;
                foreach($listaSelect as $user){
                    if($user['id'] == $idU || $user['id'] == "---"){
                        $boolMoreCheck = true;
                        break;
                    }
                }
                if(!$boolMoreCheck){
                    return $this->json("morecheck");
                }
                $boolRepeat = false;
                $boolDoubleDesmark = false;
                $countPosition = 0;
                foreach($listaSelect as $user){
                    if($user['id'] === $idU){
                        $boolRepeat = true;
                        $listaSelect[$countPosition]['id'] = "---";
                        $listaSelect[$countPosition]['nombre'] = "---";
                        break;
                    }
                    $countPosition++;
                }
                if($boolRepeat == false){
                    $countPosition = 0;
                    foreach($listaSelect as $user){
                        if($user['id']=="---"){
                            $listaSelect[$countPosition]['id'] = $idU;
                            $listaSelect[$countPosition]['nombre'] = $nombreU;
                        }
                        $countPosition++;
                    }
                }
                $cache->add('seleccionCustodios',$listaSelect);
            }
        }else{
            array_push($lista,[
                'id'=>$idU,
                'nombre'=>$nombreU,
                'renovar'=>1
            ]);
            $cache->add('seleccionCustodios',$lista);
        }
        return $this->json($cache->get('seleccionCustodios'));
    }
    /**
     * @Route("/UsersForPdf", name="UsersForPdf")
     */
    public function UsersForPdf(EntityManagerInterface $em, CacheService $cache)
    {
        $listaU = [];
        $usuariosPdf = $cache->get('seleccionCustodios');
        if($usuariosPdf){
            foreach($usuariosPdf as $user){
                $dataUser =  $em->getRepository(Usuario::class)->findOneBy(['id'=>$user['id']]);
                array_push($listaU,[
                    'id'=>$dataUser->getId(),
                    'nombre'=>$dataUser->getNombre(),
                    'organizacion'=>$dataUser->getDetalle()
                ]);
            }
            $cache->delete('seleccionCustodios');
            return $this->json($listaU);
        }else{
            return $this->json(null);
        }
        
    }
    //cache para patrimonio
    /**
     * @Route("/cacheUpdateAF", name="cacheUpdateAF")
     */
    public function cacheUpdateAF(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $usuario = $cache->get('usuario');
        $ip = $request->getClientIp();
        $boolCheckIp = false;
        $tipoRol = null;
        foreach($usuario as $user){
            if($user->getIpModificacion() == $ip){
                $boolCheckIp = true;
                $tipoRol = $user->getIdRol()->getId();
                break;
            }
        }
        
        $id = $request->request->get('id');
        $tipo = $request->request->get('tipo');
        if($tipoRol){
            $activoFijo =  $em->getRepository(Producto::class)->findOneBy(['id'=>$id]);
            if($activoFijo){
                $cache->add('patrimonioUpdate', [$id, $tipo]);
                return $this->json("ok");
            }else{
                return $this->json(null);
            }
        }else{
            return $this->json("usuario no permitido!");
        }
    }
    /**
     * @Route("/limpiarCacheModifieAF", name="limpiarCacheModifieAF")
     */
    public function limpiarCacheModifieAF(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        return $this->json($cache->delete('patrimonioUpdate'));
    }
    /**
     * @Route("/getCacheAF", name="getCacheAF")
     */
    public function getCacheAF(EntityManagerInterface $em, CacheService $cache)
    {
        $activosFijos = [];
        $activosFijos = $cache->get('patrimonioUpdate');
        if($activosFijos){
            $idP = intval($activosFijos[0]); //convertir a int
            $dataProducto = $em->getRepository(Producto::class)->findOneBy(['id'=>$idP]); //buscar el producto
            array_push($activosFijos,$dataProducto); //insertar en la cola el producto
            return $this->json($activosFijos);
        }else{
            return $this->json(null);
        }
        
    }

    /**
     * @Route("/deleteTipoPatrimonioCache", name="deleteTipoPatrimonioCache")
     */
    public function deleteTipoPatrimonioCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        return $this->json($cache->delete('patrimonio'));
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
        $productos = $em->getRepository(Transaccion::class)->findBy([],['id'=>'ASC']);
        if($productos){
            foreach($productos as $listadoProd){
                if($listadoProd->getFechaCaducidad()){
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
            }    
            return $this->json($newList);
        }else{
            return $this->json([]);
        }
        
    }
    // ----------------------- private function ---------------
    private function cargaDatosProductosGenerales($data){
        $lista = [];    
        array_push($lista,[
            'idGrupo'=>"2",
            'codigo'=>$data->get('codigo'),
            'descripcionProducto'=>$data->get('descripcion'),
            'cantidad'=>$data->get('cantidad'),
            'unidadMedida'=>"",
            'estado'=> "activo",
            'procedencia'=> "donaciones",
            'observaciones'=>$data->get('observaciones'),
            'fechaCaducidad'=> "",
            'fechaIngreso'=> "",
            'marca'=>$data->get('marca'),
            'color'=>$data->get('color'),
            'motor'=>"",
            'cilindraje'=>"",
            'modelo'=>$data->get('modelo'),
            'numPasajeros'=>0,
            'chasis'=>"",
            'anioModelo'=>"",
            'tipoVehiculo'=>"",
            'combustible'=>"",
            'ramvcpn'=>"",
            'remarcado'=>"",
            'claveCatastral'=>$data->get('claveCatastral'),
            'tamanio'=>$data->get('tamanio'),
            'forma'=>$data->get('forma'),
            'kilometraje'=>0,
            'lote'=>""
        ]);
        return $lista;
    }
    private function cargaDatosVehiculos($data){
        $lista = [];    
        array_push($lista,[
            'idGrupo'=>"2",
            'codigo'=>$data->get('placa'),
            'descripcionProducto'=>"Vehiculo",
            'cantidad'=>1,
            'unidadMedida'=>"",
            'estado'=> "activo",
            'procedencia'=> "donaciones",
            'observaciones'=>$data->get('observaciones'),
            'fechaCaducidad'=> "",
            'fechaIngreso'=> "",
            'marca'=>$data->get('marca'),
            'color'=>$data->get('color'),
            'motor'=>$data->get('motor'),
            'cilindraje'=>$data->get('cilindraje'),
            'modelo'=>$data->get('modelo'),
            'numPasajeros'=>$data->get('pasajeros'),
            'chasis'=>$data->get('chasis'),
            'anioModelo'=>$data->get('anioModelo'),
            'tipoVehiculo'=>$data->get('claseV'),
            'combustible'=>$data->get('conbustible'),
            'ramvcpn'=>$data->get('ramvcpn'),
            'remarcado'=>$data->get('remarcado'),
            'claveCatastral'=>"",
            'tamanio'=>"",
            'forma'=>"",
            'kilometraje'=>$data->get('kilometro'),
            'lote'=>""
        ]);
        return $lista;
    }
    private function cargaDatosProductosInsumosTrans($data,$lote){
        $lista = [];  
        array_push($lista,[
            'idGrupo'=>"1",
            'codigo'=>$data['codigo'],
            'descripcionProducto'=>$data['descripcionProducto'],
            'cantidad'=>$data['cantidadProducto'],
            'unidadMedida'=>$data['unidadMedida'],
            'estado'=> $data['estado'],
            'procedencia'=> $data['procedencia'],
            'observaciones'=>$data['observaciones'],
            'fechaCaducidad'=> $data['fechaCaducidad'],
            'fechaIngreso'=> $data['fechaIngreso'],
            'marca'=>$data['marca'],
            'color'=>$data['color'],
            'motor'=>"",
            'cilindraje'=>"",
            'modelo'=>"",
            'numPasajeros'=>0,
            'chasis'=>"",
            'anioModelo'=>"",
            'tipoVehiculo'=>"",
            'combustible'=>"",
            'ramvcpn'=>"",
            'remarcado'=>"",
            'claveCatastral'=>"",
            'tamanio'=>"",
            'forma'=>"",
            'kilometraje'=>0,
            'lote'=>$lote
        ]);  
        return $lista;
    }
    private function addProduct(Producto $producto, $data,EntityManagerInterface $em, $ip, $idUnidad, CacheService $cache){
        
        $departamento = $em->getRepository(Unidad::class)->findOneBy(['id'=>$idUnidad]);
        $categoriaProducto = $em->getRepository(GrupoMaterial::class)->findOneBy(['id'=>$data[0]['idGrupo']]);
        $producto = $this->setDataProduct($producto, $data, $ip, $departamento, $categoriaProducto, $cache);
        $em->persist($producto);
        $em->flush();
    }
    private function setDataProduct(Producto $producto, $data, $ip,Unidad $departamento,GrupoMaterial $grupo, CacheService $cache){
        $fechaCaducidad = $data[0]['fechaCaducidad'];
        $cachePatrimonio = $cache->get('patrimonioUpdate');
        if($fechaCaducidad):
            $fechaCaducidad = \DateTime::createFromFormat('Y-m-d', $fechaCaducidad);
        else:   
            $fechaCaducidad = null;
        endif;

        $fechaIngreso = $data[0]['fechaIngreso'];
        if($cachePatrimonio){
            $fechaIngreso = $producto->getFechaIngreso();
        }else{
            if($fechaIngreso):
                $fechaIngreso = \DateTime::createFromFormat('Y-m-d', $fechaIngreso);
            else:
                $fechaActual = date('Y-m-d');
                $fechaIngreso = \DateTime::createFromFormat('Y-m-d', $fechaActual);
            endif;
        }
        

        if($data[0]['remarcado'] || $data[0]['remarcado']!= "no"){
            $valorBool = true;
        }else{
            $valorBool = false;
        }
        if($data[0]['numPasajeros'] != 0){
            $numPas = intval($data[0]['numPasajeros']);
        }else{
            $numPas = 0;
        }
        if($data[0]['cantidad'] != 0){
            $cantidad = intval($data[0]['cantidad']);
        }else{
            $cantidad = 0;
        }
        if($data[0]['kilometraje'] != 0){
            $km = intval($data[0]['kilometraje']);
        }else{
            $km = 0;
        }
        if($data[0]['claveCatastral']){
            $claveCatastral = $data[0]['claveCatastral'];
        }else{
            $claveCatastral = "";
        }

        $producto
            ->setCodigo($data[0]['codigo'])
            ->setDescripcionProducto($data[0]['descripcionProducto'])
            ->setCantidadProducto($cantidad)
            ->setUnidadMedida($data[0]['unidadMedida'])
            ->setEstado($data[0]['estado'])
            ->setFechaIngreso($fechaIngreso)
            ->setFechaCaducidad($fechaCaducidad)
            ->setProcedencia($data[0]['procedencia'])
            ->setObservaciones($data[0]['observaciones'])
            ->setMarca($data[0]['marca'])
            ->setColor($data[0]['color'])
            ->setMotor($data[0]['motor'])
            ->setCilindraje($data[0]['cilindraje'])
            ->setModelo($data[0]['modelo'])
            ->setNumPasajero($numPas)
            ->setkilometraje($km)
            ->setChasis($data[0]['chasis'])
            ->setAnioModelo($data[0]['anioModelo'])
            ->setTipoVehiculo($data[0]['tipoVehiculo'])
            ->setCombustible($data[0]['combustible'])
            ->setRamvCpn($data[0]['ramvcpn'])
            ->setRemarcado($valorBool)
            ->setClaveCatastral($claveCatastral)
            ->setTamanio($data[0]['tamanio'])
            ->setForma($data[0]['forma'])
            //->setTiempoEntreGestion()
            ->setIdUnidad($departamento)
            ->setIdGrupo($grupo)
            ->setLote($data[0]['lote'])
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
    private function filtroUsuariosInternos($usuario){
        $lista =[];
        foreach($usuario as $data){
            if($data->getIdRol()->getId() <= 5)
                if($data->getEstado()){
                    array_push($lista,[
                        'nombre'=> $data->getNombre(),
                        'mail'=>$data->getUsuario(),
                        'id'=>$data->getId()
                    ]);
                }
                
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
        if($fecha):
            $fechaCaducidad = \DateTime::createFromFormat('Y-m-d', $fecha);
        else:   
            $fechaCaducidad = $transaccion->getFechaCaducidad();
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
    private function flushDataTransac(EntityManagerInterface $em, Transaccion $transaccion, Producto $producto, Usuario $usuarioModificacion,$data){
        $fechaActual = date('Y-m-d');
        $fechaOperacion = \DateTime::createFromFormat('Y-m-d', $fechaActual);
        if($data[0]['motor'] !== ""){
            $valorSalida=$data[0]['codigo'];
            $observacion = $data[0]['observaciones'];
            $descripcion = 1;
        }else{
            $observacion = $data[0]['observaciones'];
            $descripcion = $data[0]['cantidad'];
        }
        $transaccion
                    ->setDescripcionProducto($descripcion)
                    ->setResponsable("Activos fijos")
                    ->setEntradaProducto($observacion)
                    ->setSalidaProducto("")
                    ->setMarca($data[0]['marca'])
                    ->setColor($data[0]['color'])
                    ->setFechaOperacion($fechaOperacion)
                    ->setFechaCaducidad(null)
                    ->setIdUsuario($usuarioModificacion)
                    ->setCodigoProducto($producto)
                    ->setProcedencia("Donacion/compra")
                    ;

        $em->persist($transaccion);
        $em->flush();
    }
}