async function getTableCasaHogar($container){
    $container.innerHTML=""
    const lista = await getData('getCasaHogar')
    getInventario(lista,$container)
}
async function getInventario(lista,$container){
    $container.innerHTML=""
    await renderCasaHogar(lista,$container)
    await addEventSearchCodProcedencia()
}
async function renderCasaHogar(lista,$container){
    let numero = 1
    let table =`<table id="casaHogarTable" class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    const responseUser= await getData('getUserData');
    
    switch(responseUser[1]){
        case 1:
            table = templateTitleProyectoEmanuel(table)
            break;
        case 2:
            table = templateTitleUsuariosNormales(table)
            break;
        case 3:
            table = templateTitleUsuariosNormales(table)
            break;
        
    }    
    if(lista.length != 0){
        lista.forEach((productos)=>{
            switch(responseUser[1]){
                case 1:
                    table = templateCasaHogar(table,productos,numero)
                    break;
                case 2:
                    table = templateUsuariosNormales(table,productos,numero)
                    break;
                case 3:
                    table = templateUsuariosNormales(table,productos,numero)
                    break;
                
            }
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleProyectoEmanuel(table){
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
            <th>
                <div >  
                    <form name="searchNombre">
                        <input type="text" class="form-control" name="nombreProduct" placeholder="Nombre:">
                    </form>
                </div>
            </th>
            <th >Cantidad</th>
            <th >Unidad</th>
            <th >
                <div  >
                    <form name="searchProcedencia">
                        <input type="text" class="form-control" name="ProcedenciaProd" placeholder="Procedencia:">
                    </form>
                </div>
            </th>
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
        <td onclick="selectProduct(${producto.id})"><a href="#">${producto.codigo}</a></td>
        <td onclick="selectProduct(${producto.id})"><a href="#">${producto.descripcionProducto}</a></td>
        <td>${producto.cantidadProducto}</td>
        <td>${producto.unidadMedida}</td>`
    //table = controlDates(table,producto)
    table += `<td>${producto.procedencia}</td>
        <td>${producto.observaciones}</td>
        <td>${producto.idUnidad.nombreUnidad}</td>
        <td>${producto.idGrupo.nombreGrupoM}</td>
        <td>${producto.estado}</td>
        <td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${producto.id})"></i></td>`
    table+=`</tr>`
    return table
}
//tabla usuario no admin
function templateTitleUsuariosNormales(table){
    table += `
    <thead> 
        <tr>
            <th><big>N°</big></th>
            <th>
                <div >  
                    <form name="searchCodProceden">
                        <input type="text" class="form-control" name="codProduct" placeholder="Codigo:">
                    </form>
                </div>
            </th>
            <th>
                <div >  
                    <form name="searchNombre">
                        <input type="text" class="form-control" name="nombreProduct" placeholder="Nombre:">
                    </form>
                </div>
            </th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>
                <div  >
                    <form name="searchProcedencia">
                        <input type="text" class="form-control" name="ProcedenciaProd" placeholder="Procedencia:">
                    </form>
                </div>
            </th>
            <th>Obervaciones</th>
            <th>Proyecto</th>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Accion</th>
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
function templateUsuariosNormales(table,producto,numero){
    table += `<tr>
        <td>${numero}</td>
        <td onclick="selectProductModiUserNormal('${producto.codigo}')"><a href="#">${producto.codigo}</a></td>
        <td onclick="selectProductModiUserNormal('${producto.codigo}')"><a href="#">${producto.descripcionProducto}</a></td>
        <td>${producto.cantidadProducto}</td>
        <td>${producto.unidadMedida}</td>`
    //table = controlDates(table,producto)
    table += `<td>${producto.procedencia}</td>
        <td>${producto.observaciones}</td>
        <td>${producto.idUnidad.nombreUnidad}</td>
        <td>${producto.idGrupo.nombreGrupoM}</td>
        <td>${producto.estado}</td>
        <td><a style="posittion:center;" href="#" onclick="productoDetallado(${producto.id})"> Ver</a></td>`
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
// funciones para crear el modal de dialogo

async function selectProductModiUserNormal(id){
    const data = new URLSearchParams(`codigo=${id}`)
    let productoTransaccion = await getDataPost('getProducto',data)
    
    $divModalUpdate.innerHTML = ""
    createTemplateModal(id,$divModalUpdate,productoTransaccion)
    
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

    //llamar div contenido procedencia
    informacionProcedencia(producto)
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
        let valueFecha = document.getElementById('fechaCaducidad')
        let valueCantidad = document.getElementById('accionProductoCantidad').value;
        if(valueFecha.value !== ""){
            valueFecha = document.getElementById('fechaCaducidad').value
        }else{valueFecha = null}
        let valuePersonExternal = document.getElementById('usuariosExternos').value
        let valueProcedencia = document.getElementById('procedenciaT').value
        await validacionDatosTransaccionModal(valueProcedencia,valueCantidad,valueFecha,valuePersonExternal,producto)
        modal.style.display = "none";
        await getTableCasaHogar($divListInventary)
    }
    if(bttCreateUserExternl){
        bttCreateUserExternl.onclick = async function(){
            location.href="usuariosGestion";
        }
    }
}
function nuevoDonante(){
    location.href="usuariosGestion";
}
function informacionProcedencia(producto){
    const tipoProcedencia = document.getElementById('procedenciaT');
    const divProcedencia = document.getElementById('divTransferencia')
    tipoProcedencia.addEventListener('change', async (event)=>{
        divProcedencia.innerHTML = ""
        let bodyDiv = ""
        if(tipoProcedencia.value == "donacion"){
            bodyDiv += `<p><br>Donante:  <select id="usuariosExternos" name="usuariosExternos">`
            producto[1].forEach((userExternal)=>{
                bodyDiv+=`<option value="${userExternal.nombre}">${userExternal.nombre}</option>`
            })
            bodyDiv +=`</select> <br><a href="#" id="nuevoDonante" onclick="nuevoDonante('usuarioExterno')">nuevo donante</a></p>`  
        }else{
            if(tipoProcedencia.value == "compra"){
                bodyDiv += `<p><br>Proveedor:  <select id="usuariosExternos" name="usuariosExternos">`
                producto[1].forEach((userExternal)=>{
                    bodyDiv+=`<option value="${userExternal.nombre}">${userExternal.nombre}</option>`
                })
                bodyDiv +=`</select> <a href="#" id="nuevoDonante" onclick="nuevoDonante('usuarioExterno')">nuevo donante</a><br>`  
                bodyDiv += `<br><letter>*N° Ruc</letter><br>
                            <input type="number" id="rucCliente"  min="0" placeholder="060606054001" ><br>
                            <letter>*Subtotal</letter><br>
                            <input type="number" id="subtotal"  min="0" placeholder="400" ><br>
                            <letter>*Iva</letter><br>
                            <input type="number" id="iva" min="0" placeholder="12" ><br>
                            </p>`
            }else{
                bodyDiv += `<p><br>Responsable:  <select id="usuariosExternos" name="usuariosExternos">`
                producto[2].forEach((userExternal)=>{
                    bodyDiv+=`    <option value="${userExternal.nombre}">${userExternal.mail}(${userExternal.nombre})</option>`
                })
                bodyDiv += `</p>`
            }
        }
        const element = createTemplate(bodyDiv)
        divProcedencia.append(element)
    })
}
async function validacionDatosTransaccionModal(valueProcedencia,valueCantidad,valueFecha,valuePersonExternal,producto){
    if(valueCantidad && (valueCantidad > 0)){
        if(producto[0].idGrupo.id===1){
            if(valueFecha){
                if(Date.parse(valueFecha) > Date.parse(new Date()))
                    await registrarAccionesModal(valueProcedencia,valueCantidad,valueFecha,valuePersonExternal,producto) 
                else   
                    alertify.error('Ingrese fecha valida!')   
            }else{
                alertify.error('Ingrese fecha de caducidad!') 
            }
        }else
            await registrarAccionesModal(valueProcedencia,valueCantidad,valueFecha,valuePersonExternal,producto)
    }else
        alertify.error('Ingresar valor valido!')
}
async function registrarAccionesModal(procedencia,cantidad,valueFecha,persona,producto){
    let accion = "entrada"
    var marca = document.getElementById('marcaT').value
    var color = document.getElementById('colorT').value
    var motivo = null
    motivo = dataDetalles()
    if(motivo[0] && motivo[1]){
        const data = new URLSearchParams(`action=${accion}&number=${cantidad}&date=${valueFecha}&person=${persona}&idP=${producto[0].codigo}&marca=${marca}&color=${color}&proceden=${procedencia}&motivo=${motivo[0]}&detalleM=${motivo[1]}`)
        const response = await getDataPost('newTransaccionsProduct', data)

        if(response){
            alertify.success('transaccion guardada!')
        }
    }else{
        alertify.error('Llene campos vacios!') 
    }
}

function dataDetalles(){
    var motivo, detalle = null;
    var procedencia = document.getElementById('procedenciaT')
    if(procedencia.value === "donacion"){
        motivo = "Donacion";
        detalle = "Externo"
    }else{ if(procedencia.value === "compra"){
            if(document.getElementById('iva').value && document.getElementById('subtotal').value){
                var iva = parseInt(document.getElementById('iva').value)
                var subtotal = parseInt(document.getElementById('subtotal').value)
                motivo = "Compra";
                detalle = `Ruc:${document.getElementById('rucCliente').value},Subtotal${subtotal} + ${iva}%=${(subtotal+((subtotal/100)*iva))}`
            }
        }else{ if(procedencia.value === "Transferencia"){
                motivo = "Transferencia";
                detalle = "Interno"
            }
        }
    }
    return [motivo, detalle];
}

function templateModalDialogo(modal,producto){
    modal +=`<div class="modal-posision"><div class="modal-header">
                <span class="close">&times;</span>
                <h4 align="center">Ingreso de producto concurrente</h4>
            </div>
            <div class="modal-body"><br>
                <pre>            <black>Codigo:</black>          ${producto[0].codigo}           
            <b>Producto:</b>        ${producto[0].descripcionProducto}
            <b>Cantidad:</b>        ${producto[0].cantidadProducto}          
            <b>Unidad:</b>          ${producto[0].unidadMedida}`
    if(producto[0].lote){
        modal += `<br><b>            Lote:</b>            ${producto[0].lote}`
    }
    modal += `</pre>
                <laber>Operacion: <b>Ingreso Producto<b></label>
                <br>
                <br>Cantidad: 
                <input type="number" id="accionProductoCantidad" name="accionProductoCantidad" min="0" placeholder="ejemplo: 3">`
                if(producto[0].idGrupo.id===1){
                    modal += `<br><br>Fecha Caducidad: <input type="date" id="fechaCaducidad"></input>`
                }else{
                    modal += `<input type="date" id="fechaCaducidad" style="display:none;"></input>`
                }
    modal +=`   <br><br>Marca: <input type="text" id="marcaT" placeholder="ejemplo: Nike">
                <br><br>Color: <input type="text" id="colorT" placeholder="ejemplo: Rojo">
                <br><br>Procedencia:<select id="procedenciaT" name="procedenciaT">
                <option selected>-Seleccione opcion-</option>
                <option value="donacion">Donacion</option>
                <option value="compra">Compra</option>
                <option value="Transferencia">Transferencia</option>
                <select>
                <br>
                <div id="divTransferencia"></div>
                <br>
                    <button id="registrar_edicion" name="registrar_edicion" value="Guardar cambios">Guardar</button>
                            <button id="closeModal" >Cancelar</button>
                    <br><br></div>
                    <div class="modal-footer"><h4 align="center">Llene todos los datos!<h4></div>
                </div>
            </div>`
    return modal
}

//eliminar produto//
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

//buscadores
async function addEventSearchCodProcedencia(){
    const formcod = document.searchCodProceden
    const formProcedencia = document.searchProcedencia
    const formNombre = document.searchNombre
    formcod.codProduct.value = $formHidenProducto.codProducto.value
    formProcedencia.ProcedenciaProd.value = $formHidenProducto.procedenciaProducto.value
    formNombre.nombreProduct.value = $formHidenProducto.nombreProducto.value
    
    formcod.addEventListener('submit', async (event)=>{
        
        event.preventDefault()//recarga solo la tabla, no la pagina
        const datos = dataInputProduct(formcod,formProcedencia,formNombre)// asigna a una lista valores para busqueda de nombre, procedencia y codigo
        const listaProducto = await getData('getCasaHogar')
        const list = await getFilterProduct(listaProducto, datos)// genera una lista de los valores encontrados 
        await getInventario(list, $divListInventary) //actualiza tabla con datos encontrados
    })
    formProcedencia.addEventListener('submit', async (event)=>{
        event.preventDefault()
        const datos = dataInputProduct(formcod,formProcedencia,formNombre)
        const listaProducto = await getData('getCasaHogar')
        const list = await getFilterProduct(listaProducto, datos)
        await getInventario(list,$divListInventary)
    })
    formNombre.addEventListener('submit', async (event)=>{
        event.preventDefault()
        const datos = dataInputProduct(formcod,formProcedencia,formNombre)
        const listaProducto = await getData('getCasaHogar')
        const list = await getFilterProduct(listaProducto, datos)
        await getInventario(list,$divListInventary)
    })
} 
function dataInputProduct(formcod,formProcedencia, formNombre){
    let data = []
    const codigo = formcod.elements.codProduct.value
    $formHidenProducto.codProducto.value = codigo
    if(codigo != ""){data.push({name:'codigo',val:codigo})} //inserta en lista valores para buscar si no son vacios
   
    const procedencia = formProcedencia.elements.ProcedenciaProd.value
    $formHidenProducto.procedenciaProducto.value = procedencia
    if(procedencia != ""){data.push({name:'procedencia',val:procedencia})}

    const nombre = formNombre.elements.nombreProduct.value
    $formHidenProducto.nombreProducto.value = nombre
    if(nombre != ""){data.push({name:'nombre',val:nombre})}

    return data
}
async function getFilterProduct(list,data){
    if(data.length == 0){return list }//si no ingresa ningun valor a buscar

    let codigoP = procedenciaP = nombre = null //ahorar codigo asignando null a multiples variables
    let lista = []
    for(var i = 0; i< data.length;i++){//recorre lista de valores antes guardados y asigna a listas independientes
        if(data[i].name === 'codigo'){
            codigoP = data[i].val
        }else{
            if(data[i].name === 'procedencia'){
                procedenciaP = data[i].val
            }else{
                nombre = data[i].val
            }
        }
    }   
    switch(data.length){//manejo de 2 ca
        case 2: //caso si ingreso valores en todos los inputs
            list.forEach((lt)=>{ if(lt.codigo.indexOf(codigoP) !== -1 && lt.procedencia.indexOf(procedenciaP) !== -1){ lista.push(lt) } })//guarda en lista si encontro el nombre y estado
            break
        case 1: //caso si solo ingreso valor en nombre o estado
            if(codigoP != null){
                list.forEach((lt)=>{ if(lt.codigo.indexOf(codigoP) !== -1){ lista.push(lt) } }) 
            }else{
                if(procedenciaP != null){
                    list.forEach((lt)=>{ if(lt.procedencia.indexOf(procedenciaP) !== -1){ lista.push(lt) } }) 
                }else{
                    list.forEach((lt)=>{ if(lt.descripcionProducto.indexOf(nombre) !== -1){ lista.push(lt) } })    
                }        
            }
            break   
    }
    return lista
}
//redirrecion productos detallados
async function productoDetallado(idProd){
    await getData('deleteCacheTransaccion')
    const data = new URLSearchParams(`idP=${idProd}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('cacheSetproductoDetallado', data)
    
    if(response)
        location.href="transaccionProducto";  
}