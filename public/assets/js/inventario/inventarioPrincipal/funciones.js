async function generalTableVehiculo($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=1`) 
    const lista = await getDataPost('listarInmuebles',data)  
    await getVehiculo(lista,$container)
}
async function getVehiculo(lista,$container){
    $container.innerHTML = ""
    await renderVehiculo(lista,$container)
    //addEventSearchCurso()
}
async function renderVehiculo(lista,$container){
    let numero = 1
    let table =`<table class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleVehiculo(table)
    if(lista.length != 0){
        lista.forEach((inventario)=>{
            table = templateDataVehiculo(table,inventario,numero)
            numero++
        })
    }else{
        table += `<tr class="text-center"><td colspan="15">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleVehiculo(table){
    table += `
    <thead> 
        <tr>
            <th>N°</th>
            <th scope="col">
                <div >
                    <form name="searPlaca">
                        <input type="text" class="form-control" name="placa" placeholder="Placa:">
                    </form>
                </div>
            </th>
            <th>Motor</th>
            <th>Cilindraje</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Color</th>
            <th>Chasis</th>
            <th>Clase vehiculo</th>
            <th>Año modelo</th>
            <th>Combustible</th>
            <th>Ramv/cpn</th>
            <th>Remarcado</th>
            <th>Combustible</th>
            <th>Ramv/cpn</th>
            <th>Accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataVehiculo(table,inventario,numero){
    table += `<tr>
        <td>${numero}</td>
        <td>${inventario.codigo}</td>
        <td>${inventario.motor}</td>
        <td>${inventario.cilindraje}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.color}</td>
        <td>${inventario.chasis}</td>
        <td>${inventario.tipoVehiculo}</td>  
        <td>${inventario.anioModelo}</td>
        <td>${inventario.combustible}</td>
        <td>${inventario.ramvCpn}</td>  
        <td>${inventario.remarcado}</td>
        <td>${inventario.combustible}</td>
        <td>${inventario.ramvCpn}</td>
    `
    table = getAccionsVehiculo(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsVehiculo(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${ inventario.id})"></i></td>`
    return table
}

// -------------------- separacion de vehiculo y demas vienes
async function generalTableInmueble($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=3`) 
    const lista = await getDataPost('listarInmuebles',data) 
    await getInmueble(lista,$container)
}
async function getInmueble(lista,$container){
    $container.innerHTML = ""
    await renderInmueble(lista,$container)
    //addEventSearchCurso()
}
async function renderInmueble(lista,$container){
    let numero = 1
    let table =`<table class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleInmueble(table)
    if(lista.length != 0){
        lista.forEach((inventario)=>{
            table = templateDataInmueble(table,inventario,numero)
            numero++
        })
    }else{
        table += `<tr class="text-center"><td colspan="14">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleInmueble(table){
    table += `
    <thead> 
        <tr>
        <th>N°</th>
        <th>
            <div >  
                <form name="searchCodProceden">
                    <input type="text" class="form-control" name="codProduct" placeholder="Codigo:">
                </form>
            </div>
        </th>
        <th>Descripcion</th>
        <th >Cantidad</th>
        <th >Marca</th>
        <th>Modelo</th>
        <th>Tamaño</th>
        <th>Color</th>
        <th>Estado</th>
        <th>Forma</th>
        <th>Observaciones</th>
        <th>Clave catastral</th>
        <th>fecha actualizacion</th>
        <th>accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataInmueble(table,inventario,numero){
    
    table += `<tr>
        <td>${numero}</td>
        <td>${inventario.codigo}</td>  
        <td>${inventario.descripcionProducto}</td>
        <td>${inventario.cantidadProducto}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.tamanio}</td>
        <td>${inventario.color}</td>
        <td>${inventario.estado}</td>
        <td>${inventario.forma}</td>
        <td>${inventario.observaciones}</td>`
        if(inventario.claveCatastral){
            table+=`<td>${inventario.claveCatastral}</td>`
        }else{
            table+=`<td class="text-center"> ----</td>`
        }
        
        table+=`<td>${inventario.fechaIngreso}</td>
    `
    table = getAccionsInmueble(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsInmueble(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${ inventario.id})"></i></td>`
    return table
}
//eliminar produto//
async function confirmDeleteProducto(codProd){
    console.log(codProd)
    alertify.confirm('¿Estás seguro de Eliminar el producto?', function(e){
        if(e){ deleteProducto(codProd)}
    });
}
async function deleteProducto(id){
    const data = new URLSearchParams(`id=${id}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('deleteProducto', data)
    if(response){ //if(response === true){ es exactamente igual que colocal if(response){}
        alertify.success('Se eliminó con éxito')
        location.reload();
    }else{
        alertify.error('Error al eliminar el producto')
    }
}
// -------------------- separacion activo fijo de tipo nueble
async function generalTableMueble($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=2`) 
    const lista = await getDataPost('listarInmuebles',data)  
    await getMueble(lista,$container)
}
async function getMueble(lista,$container){
    $container.innerHTML = ""
    await renderMueble(lista,$container)
    //addEventSearchCurso()
}
async function renderMueble(lista,$container){
    let numero = 1
    let table =`<table class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleMueble(table)
    if(lista.length != 0){
        lista.forEach((inventario)=>{
            table = templateDataMueble(table,inventario,numero)
            numero++
        })
    }else{
        table += `<tr class="text-center"><td colspan="14">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleMueble(table){
    table += `
    <thead> 
        <tr>
        <th>N°</th>
        <th>
            <div >  
                <form name="searchCodProceden">
                    <input type="text" class="form-control" name="codProduct" placeholder="Codigo:">
                </form>
            </div>
        </th>
        <th>Descripcion</th>
        <th >Cantidad</th>
        <th >Marca</th>
        <th>Modelo</th>
        <th>Tamaño</th>
        <th>Color</th>
        <th>Estado</th>
        <th>Forma</th>
        <th>Observaciones</th>
        <th>fecha actualizacion</th>
        <th>accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataMueble(table,inventario,numero){
    
    table += `<tr>
        <td>${numero}</td>
        <td>${inventario.codigo}</td>  
        <td>${inventario.descripcionProducto}</td>
        <td>${inventario.cantidadProducto}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.tamanio}</td>
        <td>${inventario.color}</td>
        <td>${inventario.estado}</td>
        <td>${inventario.forma}</td>
        <td>${inventario.observaciones}</td>
        <td>${inventario.fechaIngreso}</td>
    `
    table = getAccionsMueble(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsMueble(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProductoInm(${ inventario.id})"></i></td>`
    return table
}
function nuevoProducto(){
    location.href="gestionPatrimonio";
}
//eliminar produto//
async function confirmDeleteProductoInm(codProd){
    console.log(codProd)
    alertify.confirm('¿Estás seguro de Eliminar el producto?', function(e){
        if(e){ deleteProductoInm(codProd)}
    });
}
async function deleteProductoInm(id){
    const data = new URLSearchParams(`id=${id}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('deleteProducto', data)
    if(response){ //if(response === true){ es exactamente igual que colocal if(response){}
        alertify.success('Se eliminó con éxito')
        location.reload();
    }else{
        alertify.error('Error al eliminar el producto')
    }
}
