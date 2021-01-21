async function getTableTransaccion($container){
    $container.innerHTML=""
    const lista = await getData('getProductosTransacciones')
    getInventario(lista,$container)
}
async function getInventario(lista,$container){
    $container.innerHTML=""
    await renderTransaccion(lista,$container)
    //await addEventSearchCodProcedencia()
}
async function renderTransaccion(lista,$container){
    let numero = 1
    let table =`<table id="transaccionProducto" class="table table-hover table-condensed table-bordered">`
    table = templateTitleProducTransaccion(table)
    if(lista.length != 0){
        lista.forEach((productos)=>{
            table = templateProducTransaccion(table,productos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleProducTransaccion(table){
    table += `
    <thead> 
        <tr>
            <th>N°</th>
            <th>Responsable</th>
            <th>Salida</th>
            <th>Entrada</th>
            <th>Donante/Adquiriente</th>
            <th>Fecha registro</th>
            <th>Caducidad</th>
            <th>Cantidad</th>
            <th>Procedencia</th>
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
    let fechaIngreso = setDateString(producto.fechaOperacion)
    table += `  <td style="text-align: center">${fechaIngreso}</td>
                <td style="text-align: center">${fechaCaducidad}</td>`
    return table
}
function templateProducTransaccion(table,producto,numero){
    table += `<tr>
            <td>${numero}</td>
            <td>${producto.idUsuario.usuario}</td>`
    table = llenarEspaciosTabla(table,producto)    
    table += `<td style="text-align: center">${producto.responsable} </td>`
    table = controlDates(table,producto)
    table += `  <td style="text-align: center">${producto.descripcionProducto}</td>
                <td>${producto.codigoProducto.procedencia}</td>
            </tr>`
    return table
}
function llenarEspaciosTabla(table,producto){
    if(producto.salidaProducto){
        table += `<td>${producto.salidaProducto}</td>
                <td style="text-align: center"> ------------ </td>`
    }else{
        table += `<td style="text-align: center"> ------------ </td>
                <td>${producto.entradaProducto}</td>`
    }
    return table;
}
async function retornarLista(){
    const responsDelete = await getData('deleteCacheTransaccion')
    const response = await getData('getUserData')
    if(response[1] === 2){
        location.href="casaHogar";
    }else{
        location.href="centroMedico";
    }
}