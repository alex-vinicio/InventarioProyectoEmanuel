async function getTableTransaccion($container){
    $container.innerHTML=""
    const lista = await getData('listTransaccion')
    
    getInventario(lista,$container)
}
async function getInventario(lista,$container){
    $container.innerHTML=""
    await renderTransaccion(lista,$container)
    await addEventSearchTransaccion()
}
async function renderTransaccion(lista,$container){
    let numero = 1
    let table =`<table id="transaccionProducto" class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleProducTransaccion(table)
    if(lista){
        lista.forEach((productos)=>{
            table = templateProducTransaccion(table,productos,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="9">No hay Datos para mostrar</td></tr>`
    }
    
    const element = createTemplate(table)
    $container.append(element)
    
    
}
function templateTitleProducTransaccion(table){
    table += `
    <thead> 
        <tr>
            <th scope="col">N°</th>
            <th scope="col">Responsable</th>
            <th scope="col">
                <div >  
                    <form name="searchSalida">
                        <input type="text" class="form-control" name="salida" placeholder="Salida:">
                    </form>
                </div>
            </th>
            <th scope="col">
                <div >  
                    <form name="searchIngreso">
                        <input type="text" class="form-control" name="ingreso" placeholder="Ingreso:">
                    </form>
                </div>
            </th>
            <th scope="col">Donante/Adquiriente</th>
            <th scope="col">Fecha registro</th>
            <th scope="col">Caducidad</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Procedencia</th>
            <th scope="col">accion</th>
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
                <td class="text-center"><a href="#" onclick="salidaRegistro(${producto.id})">Editar</a></td>
            </tr>`
    return table
} 
function llenarEspaciosTabla(table,producto){
    if(producto.salidaProducto){
        table += `<td>${producto.salidaProducto}</td>
                <td style="text-align: center">  </td>`
    }else{
        table += `<td style="text-align: center">  </td>
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
//generacion modal
async function salidaRegistro(idTransaccion){
    const data = new URLSearchParams(`codigo=${id}`)
    let productoTransaccion = await getDataPost('getProducto',data)
    
    $divModalUpdate.innerHTML = ""
    createTemplateModal(id,$divModalUpdate,productoTransaccion)
    
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("modalEdit");
    var bttonCancel = document.getElementById('closeModal');
    var bttonGuardar = document.getElementById('registrar_edicion');
  
    await activationModal(span,modal,bttonCancel,bttonGuardar,productoTransaccion)
}

//buscadores             
async function addEventSearchTransaccion(){
    const formSalida = document.searchSalida
    const formIngreso = document.searchIngreso
    formSalida.salida.value = $formHidenProductoTran.salida.value
    formIngreso.ingreso.value = $formHidenProductoTran.ingreso.value
    
    formSalida.addEventListener('submit', async (event)=>{
        event.preventDefault()//recarga solo la tabla, no la pagina
        const datos = dataInputProduct(formSalida,formIngreso)// asigna a una lista valores para busqueda de nombre, procedencia y codigo
        const listaTransaccion = await getData('listTransaccion')
        const list = await getFilterProduct(listaTransaccion, datos)// genera una lista de los valores encontrados 
        await getInventario(list, $divListInventary) //actualiza tabla con datos encontrados
    })
    formIngreso.addEventListener('submit', async (event)=>{
        event.preventDefault()
        const datos = dataInputProduct(formSalida,formIngreso)
        const listaTransaccion = await getData('listTransaccion')
        const list = await getFilterProduct(listaTransaccion, datos)
        await getInventario(list,$divListInventary)
    })
} 
function dataInputProduct(formSalida,formIngreso){
    let data = []
    const salida = formSalida.elements.salida.value
    $formHidenProductoTran.salida.value = salida
    if(salida != ""){data.push({name:'salida',val:salida})} //inserta en lista valores para buscar si no son vacios
   
    const ingreso = formIngreso.elements.ingreso.value
    $formHidenProductoTran.ingreso.value = ingreso
    if(ingreso != ""){data.push({name:'ingreso',val:ingreso})}

    return data
}
async function getFilterProduct(list,data){
    if(data.length == 0){return list }//si no ingresa ningun valor a buscar

    let ingresoT = salidaT = null //ahorar codigo asignando null a multiples variables
    let lista = []
    for(var i = 0; i< data.length;i++){//recorre lista de valores antes guardados y asigna a listas independientes
        if(data[i].name === 'salida'){
            salidaT = data[i].val
        }else{
            ingresoT = data[i].val
        }
    }   
    
    switch(data.length){//manejo de 2 ca
        case 2: //caso si ingreso valores en todos los inputs
            list.forEach((lt)=>{ if(lt.entradaProducto.indexOf(ingresoT) !== -1 && lt.salidaProducto.indexOf(salidaT) !== -1){ lista.push(lt) } })//guarda en lista si encontro el nombre y estado
            break
        case 1: //caso si solo ingreso valor en nombre o estado
            if(ingresoT != null){
                list.forEach((lt)=>{ if(lt.entradaProducto.indexOf(ingresoT) !== -1 ){ lista.push(lt) } }) 
            }else{
                list.forEach((lt)=>{ if(lt.salidaProducto.indexOf(salidaT) !== -1 ){ lista.push(lt) } })    
            }
            break   
    }
    return lista
}