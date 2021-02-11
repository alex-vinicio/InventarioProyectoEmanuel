async function getVehiculo(lista,$container){
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
            <th>N° Pasajeros</th>
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
        <td>${inventario.numPasajero}</td>  
    `
    table = getAccionsVehiculo(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsVehiculo(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteCur(${ inventario.id})"></i></td>`
    return table
}

// -------------------- separacion de vehiculo y demas vienes
async function getInmueble(lista,$container){
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
        table += `<tr class="text-center"><td colspan="11">No hay Datos para mostrar</td></tr>`
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
        <th>Nombre</th>
        <th >Cantidad</th>
        <th >Unidad</th>
        <th>Procedencia</th>
        <th>Obervaciones</th>
        <th>Grupo</th>
        <th>Estado</th>
        <th>Fecha registro</th>
        <th>Acciones</th>
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
        <td>${inventario.unidadMedida}</td>
        <td>${inventario.procedencia}</td>
        <td>${inventario.observaciones}</td>
        <td>${inventario.idGrupo.nombreGrupoM}</td>
        <td>${inventario.estado}</td>
        <td>${inventario.fechaIngreso}</td>
    `
    table = getAccionsInmueble(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsInmueble(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteCur(${ inventario.id})"></i></td>`
    return table
}
