async function getTableProxCaducar($container){
    $container.innerHTML=""
    const lista = await getData('getProxCaducar')
    await renderProductoProxCad(lista,$container)
}
async function renderProductoProxCad(lista,$container){
    let numero = 1
    let table =`<table id="productCaduTable" class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleProducCadu(table)
    if(lista.length != 0){
        lista.forEach((productos)=>{
            table = templateProducCadu(table,productos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="10">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleProducCadu(table){
    table += `
    <thead> 
        <tr>
            <th>N°</th>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Ingreso</th>
            <th>Caducidad</th>
            <th>Proyecto</th>
            <th>Grupo</th>
            <th>Procedencia</th>
        </tr>
    </thead>`
    return table
}
function controlDates(table,producto){
    fechaCaducidad = setDateString(producto.fechaCaducidad)
    let fechaIngreso = setDateString(producto.codigoProducto.fechaIngreso)
    table += `  <td >${fechaIngreso}</td>
                <td style="color:red;">${fechaCaducidad}</td>`
    return table
}
function templateProducCadu(table,producto,numero){
    table += `<tr>
            <td>${numero}</td>
            <td>${producto.codigoProducto.id}</td>
            <td>${producto.codigoProducto.descripcionProducto}</td>
            <td>${producto.descripcionProducto}</td>
            <td>${producto.codigoProducto.unidadMedida} </td>`
    table = controlDates(table,producto)
    table += `<td>${producto.codigoProducto.idUnidad.nombreUnidad}</td>
            <td>${producto.codigoProducto.idGrupo.nombreGrupoM}</td>`
    table += `<td>${producto.procedencia}</td>`
    table+=`</tr>`
    return table
}
//mostrar navegacion usuario
async function userNavigation($divNameUser){
    $divNameUser.innerHTML = ""
    const dateUser = await getData('getUserData')
    
    if(dateUser[1] === 1){
        let informacion = `<a href="#" onclick="panelUsuario(${dateUser[1]})"><h4>${dateUser[0]}</h4></a>`
        const element = createTemplate(informacion)
        $divNameUser.append(element)
    }else{
        let informacion = `<a><h4>${dateUser[0]}</h4></a>`
        const element = createTemplate(informacion)
        $divNameUser.append(element)
    }
}
async function panelUsuario(id){
    location.href="controlPanel";
}