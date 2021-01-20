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
    let table =`<table id="casaHogarTable" class="table table-hover table-condensed table-bordered">`
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
            <th>Fecha ingreso</th>
            <th>Fecha caducidad</th>
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
            <th>Fecha ingreso</th>
            <th>Fecha caducidad</th>
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
    table = controlDates(table,producto)
    table += `<td>${producto.procedencia}</td>
        <td>${producto.observaciones}</td>
        <td>${producto.idUnidad.nombreUnidad}</td>
        <td>${producto.idGrupo.nombreGrupoM}</td>
        <td>${producto.estado}</td>
        <td><a style="posittion:center;" href="#" onclick=""productoDetallado(${producto.codigo})>Ver</a></td>`
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
async function createTemplateModal(id,$divModalUpdate,producto){
    let modal = `<div class="modal" id="modalEdit">`
    modal = templateModalDialogo(modal,producto)   

    const element = createTemplate(modal)
    $divModalUpdate.append(element)
}
async function selectProductModiUserNormal(id){
    const data = new URLSearchParams(`codigo=${id}`)
    let productoTransaccion = await getDataPost('getProducto',data)
    
    $divModalUpdate.innerHTML = ""
    createTemplateModal(id,$divModalUpdate,productoTransaccion)
    
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("modalEdit");
    var bttonCancel = document.getElementById('closeModal');
    var bttonGuardar = document.getElementById('registrar_edicion');
    let auxAction = document.getElementById('accionProducto')
  
    await activationModal(span,modal,bttonCancel,bttonGuardar,productoTransaccion,auxAction)
}
async function activationModal(span,modal,bttonCancel,bttonGuardar,producto,auxAction){
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
    bottonsEvents(bttonCancel, bttonGuardar,producto)
    auxAction.addEventListener('change', (event) => {
        event.preventDefault()
        let auxDivFecha = document.getElementById('divFechaIngreso')
        if(auxAction.value != "ingresos"){
            auxDivFecha.style.display = "none";
        }else{
            auxDivFecha.style.display = "inline"; //block
        }
    }) 
}
async function bottonsEvents(bttonCancel, bttonGuardar){
    bttonCancel.onclick = function(){
        modal.style.display = "none";
    }
    bttonGuardar.onclick = async function(){
        let valueCantidad = document.getElementById('accionProductoCantidad').value;
        let valueAccion = document.getElementById('accionProducto').value;
        let valueFecha = document.getElementById('fechaIngreso').value
        if(valueCantidad && (valueCantidad > 0)){
            if((valueAccion == "salida") && valueCantidad > producto.cantidadProducto){
                alertify.error('Valor ingresado supera a la cantidad existen!')
            }else{
                if((Date.parse(valueFecha) > Date.parse(new Date())) &&  valueFecha)
                    await registrarAccionesModal(valueAccion,valueCantidad,valueFecha)    
                else
                    alertify.error('Ingrese fecha valida')
            }
        }else
            alertify.error('Ingresar valor valido!')
    }
}
async function registrarAccionesModal(accion,cantidad,valueFecha){
    const data = new URLSearchParams(`action=${accion}&number=${cantidad}&date=${valueFecha}`)
    const response = await getDataPost('newTransaccionsProduct', data)
    console.log(response)
}
function templateModalDialogo(modal,producto){
    modal +=`<div class="modal-posision"><div class="modal-header">
                <span class="close">&times;</span>
                <h4 align="center">Salida/entrada de producto</h4>
            </div>
            <div class="modal-body"><br>
                <pre>            <black>Codigo:</black>          ${producto.codigo}           
            <b>Producto:</b>        ${producto.descripcionProducto}
            <b>Cantidad:</b>        ${producto.cantidadProducto}          
            <b>Unidad:</b>          ${producto.unidadMedida}</pre>
                <laber>Seleccione operacion</label>
                <select id="accionProducto" name="accionProducto">
                    <option value="ingresos">Ingreso Producto</option>
                    <option value="salida">Salida producto</option>
                </select>
                <br><br>
                <div id="divFechaIngreso">Fecha caducidad: <input type="date" id="fechaIngreso"></div>
                <br><br>Cantidad: 
                <input type="number" id="accionProductoCantidad" name="accionProductoCantidad" min="0"><br><br>
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
