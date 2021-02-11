async function getVehiculo(lista,$container){
    await renderVehiculo(lista,$container)
    //addEventSearchCurso()
}
async function renderVehiculo(lista,$container){
    let numero = 1
    let table =`<table class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleVehiculo(table)
    /* if(lista.length != 0){
        lista.forEach((cursos)=>{
            table = templateDataVehiculo(table,cursos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    } */
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
            <th>Accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataVehiculo(table,curso,numero){
    /* table += `<tr>
        <td>${numero}</td>
        <td>${curso.descripcion}</td>  
    `
    table = getAccionsVehiculo(table,curso)
    table+=`</tr>`
    return table */
}

function getAccionsVehiculo(table, curso){
    /* table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteCur(${ curso.id})"></i></td>`
    return table */
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
    /* if(lista.length != 0){
        lista.forEach((cursos)=>{
            table = templateDataInmueble(table,cursos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    } */
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
        <th>Proyecto</th>
        <th>Grupo</th>
        <th>Estado</th>
        <th>Acciones</th>
        </tr>
    </thead>`
    return table
}
function templateDataInmueble(table,curso,numero){
    /* table += `<tr>
        <td>${numero}</td>
        <td>${curso.descripcion}</td>  
    `
    table = getAccionsInmueble(table,curso)
    table+=`</tr>`
    return table */
}

function getAccionsInmueble(table, curso){
    /* table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteCur(${ curso.id})"></i></td>`
    return table */
}
