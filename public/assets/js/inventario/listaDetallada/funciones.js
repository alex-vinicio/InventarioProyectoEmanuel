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
                <td>${producto.codigoProducto.procedencia}</td>`
    if(producto.descripcionProducto != "0"){
        table += `<td class="text-center"><a href="#" onclick="salidaRegistro(${producto.id})">Editar</a></td>`
    }else{
        table += `<td class="text-center">--</td>`
    }

                
        table += `</tr>`
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
    const data = new URLSearchParams(`codigo=${idTransaccion}`)
    let productoTransaccion = await getDataPost('getTransaccionSalida',data)

    $divModalUpdate.innerHTML = ""
    createTemplateModal(idTransaccion,$divModalUpdate,productoTransaccion)
    
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("modalEdit");
    var bttonCancel = document.getElementById('closeModal');
    var bttonGuardar = document.getElementById('registrar_edicion');
    var bttCreateUserExternl = document.getElementById('nuevoDonante');
  
    await activationModal(span,modal,bttonCancel,bttonGuardar,productoTransaccion,bttCreateUserExternl)
}
async function createTemplateModal(id,$divModalUpdate,producto){
    let modal = `<div class="modal" id="modalEdit">`
    modal = templateModalDialogo(modal,producto)   

    const element = createTemplate(modal)
    $divModalUpdate.append(element)
}
async function activationModal(span,modal,bttonCancel,bttonGuardar,producto,bttCreateUserExternl){
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
    bottonsEvents(bttonCancel, bttonGuardar,producto,modal,bttCreateUserExternl)
}
async function bottonsEvents(bttonCancel, bttonGuardar, producto,modal,bttCreateUserExternl){
    bttonCancel.onclick = function(){
        modal.style.display = "none";
    }
    bttonGuardar.onclick = async function(){
        let valueCantidad = document.getElementById('cantidadP').value;
        let valuePersonExternal = document.getElementById('usuariosExternos').value
        await validacionDatosTransaccionModal(valueCantidad,valuePersonExternal,producto)
        modal.style.display = "none";
        getTableTransaccion($divListInventary)
    }
    bttCreateUserExternl.onclick = async function(){
        location.href="usuariosGestion";
    }
}
async function validacionDatosTransaccionModal(valueCantidad,valuePersonExternal,producto){
    if(valueCantidad){
        console.log(valueCantidad)
        if((valueCantidad > 0) && (valueCantidad <= producto[0].descripcionProducto)){
            
            await registrarAccionesModal(valueCantidad,valuePersonExternal,producto)
        }else{
            alertify.error('Valor incorrecto!')
        }        
    }else
        alertify.error('Ingrese un valido!')
}
async function registrarAccionesModal(cantidad,persona,producto){
    let accion = "salida"
    let valueFecha = null
    let marca = color = proceden= null
    const data = new URLSearchParams(`idT=${producto[0].id}&action=${accion}&number=${cantidad}&date=${valueFecha}&person=${persona}&idP=${producto[0].codigoProducto.codigo}&marca=${marca}&color=${color}&proceden=${proceden}`)
    const response = await getDataPost('newTransaccionsProduct', data)
    console.log(response)
    if(response){
        alertify.success('transaccion guardada!')
    }
}
function templateModalDialogo(modal,producto){
    modal +=`<div class="modal-posision"><div class="modal-header">
                <span class="close">&times;</span>
                <h4 align="center">Salida de producto</h4>
            </div>
            <div class="modal-body"><br>
                <pre>            <black>Producto:</black>          ${producto[0].codigoProducto.descripcionProducto}           
            <b>Procedencia:</b>        ${producto[0].procedencia}
            <b>Cantidad:</b>        ${producto[0].descripcionProducto}          
            <b>Unidad:</b>          ${producto[0].codigoProducto.unidadMedida}
            <b>Marca:</b>          ${producto[0].marca}
            <b>Color:</b>          ${producto[0].color}</pre>
            <laber>Operacion: <b>Ingreso Producto<b></label>
                <br>
                <br>Cantidad: 
                <input type="number" id="cantidadP" placeholder="ejemplo: 3">
                <br><br>Donante:<select id="usuariosExternos" name="usuariosExternos">`
    producto[1].forEach((userExternal)=>{
        modal+=`    <option value="${userExternal.nombre}">${userExternal.nombre}</option>`
    })
    modal +=`       </select> <a href="#" id="nuevoDonante" onclick="nuevoDonante('usuarioExterno')">nuevo donante</a><br><br>
                    <button id="registrar_edicion" name="registrar_edicion" value="Guardar cambios">Guardar</button>
                            <button id="closeModal" >Cancelar</button>
                    <br><br></div>
                    <div class="modal-footer"><h4 align="center">Llene todos los datos!<h4></div>
                </div>
            </div>`
    return modal
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