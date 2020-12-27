async function getTableCasaHogar($container){
    $container.innerHTML=""
    const lista = await getData('getCasaHogar')
    await renderCasaHogar(lista,$container)
}
async function renderCasaHogar(lista,$container){
    let numero = 1
    let table =`<table id="casaHogarTable" class="table table-hover table-condensed table-bordered">`
    table = templateTitleCasaHogar(table)
    if(lista.length != 0){
        lista.forEach((productos)=>{
            table = templateCasaHogar(table,productos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleCasaHogar(table){
    table += `
    <thead> 
        <tr>
            <th><big>N°</big></th>
            <th>Codigo</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Medida</th>
            <th>Unidad</th>
            <th>Fecha ingreso</th>
            <th>Fecha caducidad</th>
            <th>procedencia</th>
            <th>Obervaciones</th>
            <th>Proyecto</th>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
    </thead>`
    return table
}
function controlDates(table,producto){
    let fechaCaducidad
    if(!producto.fechaCaducidad){
        fechaCaducidad = `-- -- --`
    }else{
        fechaCaducidad = setDateString(producto.fechaCaducidad)
    }
    let fechaIngreso = setDateString(producto.fechaIngreso)
    table += `  <td >${fechaIngreso}</td>
                <td >${fechaCaducidad}</td>`
    return table
}
function templateCasaHogar(table,producto,numero){
    table += `<tr>
        <td>${numero}</td>
        <td onclick="selectProduct(${producto.id})">${producto.codigo}</td>
        <td onclick="selectProduct(${producto.id})">${producto.descripcionProducto}</td>
        <td>${producto.cantidadProducto}</td>
        <td>${producto.unidadMedida}</td>
        <td>${producto.medida}</td>`
    table = controlDates(table,producto)
    table += `<td>${producto.procedencia}</td>
        <td>${producto.observaciones}</td>
        <td>${producto.idUnidad.nombreUnidad}</td>
        <td>${producto.idGrupo.nombreGrupoM}</td>
        <td>${producto.estado}</td>
        <td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${producto.id})"></i></td>`
    table+=`</tr>`
    return table
}
async function newProuct(){
    await getData('deleteCacheProducto');
    location.href="newInventory";
}
async function selectProduct(idProd){
    const data = new URLSearchParams(`idProd=${idProd}`)
    const response = await getDataPost('cacheSetProducto',data)
    if(response){
        location.href="newInventory";
    }else{
        alertify.error('Accion no realizada')
    } 
}
async function confirmDeleteProducto(codProd){
    alertify.confirm('¿Estás seguro de Eliminar el producto?', function(e){
        if(e){ deleteProducto(codProd)}
    });
}
async function deleteProducto(id){
    const data = new URLSearchParams(`id=${id}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('deleteProducto', data)
    if(response){ //if(response === true){ es exactamente igual que colocal if(response){}
        alertify.success('Se eliminó con éxito')
        await getTableCasaHogar($divListInventary)
    }else{
        alertify.error('Error al eliminar el producto')
    }
}