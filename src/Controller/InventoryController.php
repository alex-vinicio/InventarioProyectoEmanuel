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
            $data = $request->request->get('producto');
            $listData = $this->cargaDatosProductosInsumosTrans($data);
        }
        $idUnidad = $cache->get('departamentoPE');
        $cacheProducto = $cache->get('viewProducto');
        $ip = $request->getClientIp();
        /* return $this->json([$data->get('claveCatastral'),$idUnidad]); */
        if(!$cacheProducto):
            $producto = new Producto();
            $productRepeat = $em->getRepository(Producto::class)->findOneBy(['codigo'=>$listData[0]['codigo']]);
            if($productRepeat){
                return $this->json(null);
            }else{
                $aux = $this->addProduct($producto, $listData, $em, $ip, $idUnidad); 
                return $this->json(['agregado',$idUnidad]);
            }
        else:
            $producto = $em->getRepository(Producto::class)->find($cacheProducto->getId());
            $this->addProduct($producto, $listData, $em, $ip, $idUnidad);
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
        $id = intval($idInm);
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
     * @Route("/tipoPatrimonioCache", name="tipoPatrimonioCache")
     */
    public function tipoPatrimonioCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        $departamento = $request->request->get('id');
        $cache->add('patrimonio', $departamento);
        return $this->json($departamento);
    }

    /**
     * @Route("/deleteTipoPatrimonioCache", name="deleteTipoPatrimonioCache")
     */
    public function deleteTipoPatrimonioCache(EntityManagerInterface $em, Request $request,CacheService $cache)
    {
        return $this->json($cache->delete('patrimonio', $departamento));
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
            'kilometraje'=>0
        ]);
        return $lista;
    }
    private function cargaDatosVehiculos($data){
        $lista = [];    
        array_push($lista,[
            'idGrupo'=>"2",
            'codigo'=>$data->get('placa'),
            'descripcionProducto'=>"",
            'cantidad'=>0,
            'unidadMedida'=>"",
            'estado'=> "activo",
            'procedencia'=> "donaciones",
            'observaciones'=>"",
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
            'kilometraje'=>$data->get('kilometro')
        ]);
        return $lista;
    }
    private function cargaDatosProductosInsumosTrans($data){
        $lista = [];  
        rray_push($lista,[
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
            'kilometraje'=>0
        ]);  
        return $lista;
    }
    private function addProduct(Producto $producto, $data,EntityManagerInterface $em, $ip, $idUnidad){
        
        $departamento = $em->getRepository(Unidad::class)->findOneBy(['id'=>$idUnidad]);
        $categoriaProducto = $em->getRepository(GrupoMaterial::class)->findOneBy(['id'=>$data[0]['idGrupo']]);
        $producto = $this->setDataProduct($producto, $data, $ip, $departamento, $categoriaProducto);
        $em->persist($producto);
        $em->flush();
    }
    private function setDataProduct(Producto $producto, $data, $ip,Unidad $departamento,GrupoMaterial $grupo){
        $fechaCaducidad = $data[0]['fechaCaducidad'];
        if($fechaCaducidad):
            $fechaCaducidad = \DateTime::createFromFormat('Y-m-d', $fechaCaducidad);
        else:   
            $fechaCaducidad = null;
        endif;
        $fechaIngreso = $data[0]['fechaIngreso'];
        if($fechaIngreso):
            $fechaIngreso = \DateTime::createFromFormat('Y-m-d', $fechaIngreso);
        else:
            $fechaActual = date('Y-m-d');
            $fechaIngreso = \DateTime::createFromFormat('Y-m-d', $fechaActual);
        endif;

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