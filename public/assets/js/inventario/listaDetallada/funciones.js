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
            <th >Responsable</th>
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
            <th scope="col">Marca</th>
            <th scope="col">color</th>
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
                <td>${producto.marca}</td>
                <td>${producto.color}</td>`
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
    var modal = document.getElementById('modalEdit');
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
    //divs para desplegar informacion segun seleccion 
    var formSelectACtion = document.forms.selectOptions;
    var divContainCM = document.getElementById('containDivsMedicCenter')
    if(formSelectACtion && divContainCM){
        var buttonSelectCH = document.getElementById('salidaMedicamento')
        buttonSelectCH.addEventListener('change', async (event)=>{
            divContainCM.innerHTML =""
            let container = ""
            switch (buttonSelectCH.value) {
                case "Entrega consumo":
                    container = entregaConsumoDiv(container, producto)
                    break;
                case "Baja por caducidad":
                    container = bajaCaducidadDiv(container, producto)
                    break;
                case "Venta":
                    container = ventaDiv(container, producto)
                    break;
                case "Traspaso":
                    container = traspasoDiv(container, producto)
                    break
                default:
                    container = errorDiv(container)
                    break;
            }
            container += `<br><br>`
            const element = createTemplate(container)
            divContainCM.append(element)
        })
    }   
}
function errorDiv(data){
    data += `<p><letter>¡Seleccione campo correcto!</letter></p>`
    return data;
}
function entregaConsumoDiv(data, producto){
    data += `<p>
            Seleccione al personal autorizado: <select id="usuariosExternos" name="usuariosExternos">`
            producto[2].forEach( funcionario => {
                data += `<option value="${funcionario.nombre}">${funcionario.nombre} (${funcionario.mail})</option>`
            });
            data+=`</select><p>`
    return data;
}
function bajaCaducidadDiv(data, producto){

    data += `<p><letter>Proceso de baja por caducidad </letter>
                <br><br>Personal encargado de autirozar: <select id="usuariosExternos" name="usuariosExternos">
            `
            producto[2].forEach( funcionario => {
                data += `<option value="${funcionario.nombre}">${funcionario.nombre} (${funcionario.mail})</option>`
            });
            data+=`</select><br><br>
            Motivo o detalle: <select id="motivoBaja">
                                <option value="Desecho">Por desecho</option>
                                <option value="Incineración">Por Incineración</option>
                                <option value="otroMotivo">Otros motivos</option></select>                                
                                <p>`
    return data;
}
function ventaDiv(data){
    data += `<p><letter>Informacion del cliente</letter><br>
                <letter>*N° cedula:</letter>
                <input type="text" id="civenta" name="civenta" placeholder="065231665-7" required="required">
                <br><br><letter>*Nombre:</letter>
                <input type="text" id="usuariosExternos" name="usuariosExternos" placeholder="Julio Roca" required="required">
                <br><br><letter>*Precio:</letter>
                <input type="number" id="presio" name="presio" min=0 placeholder="30" required="required">
                <br><br><letter>*N° Recibo:</letter>
                <input type="text" id="reciboventa" name="reciboventa" placeholder="NUM12" required="required"><p>`
    return data;
}
function traspasoDiv(data, producto){
    data += `<p> <letter>Informacion de traspaso</letter>
                <br><br>Persona encargada del traspaso: <select id="usuariosExternos" name="usuariosExternos">`
                producto[2].forEach( funcionario => {
                    data += `<option value="${funcionario.nombre}">${funcionario.nombre} (${funcionario.mail})</option>`
                });
            data += `</select>
                    <br><br><letter>*Detalle traspaso: </letter><br>
                    <textarea id="detalleTraspaso" name="detalleTraspaso" required="required" placeholder="Detalle el traspaso..."></textarea><p>`
    return data;
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
function asignarDataOperacion(listDataOperacion,valueMotivoSalida){
    if(valueMotivoSalida){
        if(valueMotivoSalida.value == "Entrega consumo"){
            listDataOperacion.push(1)
            listDataOperacion.push("Entrega consumo")
            listDataOperacion.push("personal")
        }else{
            if( valueMotivoSalida.value == "Baja por caducidad"){
                var motivoBaja = document.getElementById('motivoBaja').value
                listDataOperacion.push(2)
                listDataOperacion.push("Caducidad")
                listDataOperacion.push(motivoBaja)
            }else{
                if(valueMotivoSalida.value == "Venta"){
                    var precioCompra = document.getElementById('presio').value
                    var numCaja = document.getElementById('reciboventa').value
                    if(precioCompra && numCaja){
                        listDataOperacion.push(3)
                        listDataOperacion.push("Venta")
                        listDataOperacion.push(`valor=${precioCompra} caja=${numCaja}`)
                    }
                }else{
                    if(valueMotivoSalida.value == "Traspaso"){
                        var detalleTraspaso = document.getElementById('detalleTraspaso').value
                        listDataOperacion.push(4)
                        listDataOperacion.push("Traspaso")
                        listDataOperacion.push(detalleTraspaso)
                    }
                }
            }
        }
    }
}

async function bottonsEvents(bttonCancel, bttonGuardar, producto,modal,bttCreateUserExternl){
    bttonCancel.onclick = function(){
        modal.style.display = "none";
    }
    bttonGuardar.onclick = async function(event){
        event.preventDefault()
        let valuePersonExternal = null
        var listDataOperacion = [];
        let valueMotivoSalida = document.getElementById('salidaMedicamento')
        if(valueMotivoSalida){
            asignarDataOperacion(listDataOperacion,valueMotivoSalida)
        }else{listDataOperacion = null}
        let valueCantidad = document.getElementById('cantidadP').value;
        if(document.getElementById('usuariosExternos')){
            valuePersonExternal = document.getElementById('usuariosExternos').value
        }
        await validacionDatosTransaccionModal(valueCantidad,valuePersonExternal,producto, listDataOperacion)
        modal.style.display = "none";
        getTableTransaccion($divListInventary)
    }
    if(bttCreateUserExternl){
        bttCreateUserExternl.onclick = async function(){
            location.href="usuariosGestion";
        }
    }
}
async function validacionDatosTransaccionModal(valueCantidad,valuePersonExternal,producto, forData){
    if(valueCantidad){
        if((valueCantidad > 0) && (valueCantidad <= producto[0].descripcionProducto)){
            if(valuePersonExternal){
                if(forData){
                    if(forData[0] && forData[1] && forData[2]){
                        await registrarAccionesModal(valueCantidad,valuePersonExternal,producto, forData)
                    }else{
                        alertify.error('Complete campos vacios!')
                    }
                }else{
                    await registrarAccionesModal(valueCantidad,valuePersonExternal,producto, forData)
                }
            }else{alertify.error('Ingrese valores!')}
        }else{alertify.error('Valor incorrecto!')}        
    }else
        alertify.error('Ingrese un valor valido!')
}
async function registrarAccionesModal(cantidad,persona,producto, forData){
    let accion = "salida"
    let valueFecha = setDateString(producto[0].fechaCaducidad)
    let marca = producto[0].marca
    let color = producto[0].color 
    let proceden= producto[0].procedencia
    if(forData){
        var $dataMotivo1=forData[0]
        var $dataMotivo2=forData[1]
        var $dataMotivo3=forData[2]
    }else{
        var $dataMotivo1=null
        var $dataMotivo2=null
        var $dataMotivo3=null
    }
    if($dataMotivo1 ==2){
        generatePDF(persona,marca,color,producto[0].id,cantidad,valueFecha,producto[0].codigoProducto.codigo,$dataMotivo3);
    }
    const data = new URLSearchParams(`idT=${producto[0].id}&action=${accion}&number=${cantidad}&date=${valueFecha}&person=${persona}&idP=${producto[0].codigoProducto.codigo}&marca=${marca}&color=${color}&proceden=${proceden}&idM=${$dataMotivo1}&motivo=${$dataMotivo2}&detalleM=${$dataMotivo3}`)
    const response = await getDataPost('newTransaccionsProduct', data)
    if(response){
        alertify.success('transaccion guardada!')
    }
}
function generatePDF(personaA,marca,color,idT,cantidad,valueFecha,idP, motivo){
    let fecha = new Date();
    var dd = {
        content: [
            {
                text: 'Autorizacion de la baja del producto\n\n',
                style: 'header',
                alignment: 'center'
            },
            {
                text: [
                    '\n Fecha: '+setDateString(fecha)+'\n',
                    'Encargado autorizar: '+personaA+'\n',
                    'Codigo transaccion: '+idT+'\n',
                    'Codigo Producto: '+idP+'\n',
                    'Marca: '+marca+'\n',
                    'Color: '+color+'\n',
                    'Cantidad: '+cantidad+'\n',
                    'Fecha caducidad:'+valueFecha+'\n\n',
                    ],
                style: 'header',
                bold: false
            },
            {
                text: ['\n',
                    'Motivo de baja por caducidad: Por '+motivo+'\n\n\n\n\n'],
                style: 'subheader'
            },
            {
                text: ['........................\n',
                        personaA+'\n'],
                style: 'subheader'
            },
            {
                text: ['\n\n\n\n\n\n\n\n\n\n         ........................                                   ........................\n',
                        '                 Entregado                                            Recibido\n'],
                style: 'subheader'
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            },
            subheader: {
                fontSize: 15,
                bold: true
            }
        }
    }
    pdfMake.createPdf(dd).download();
} 
function templateModalDialogo(modal,producto){
    modal +=`<div class="modal-posision">
                <div class="modal-header">
                    <span class="close">&times;</span>
                    <h4 align="center">Salida de producto</h4>
                </div>
                <div class="modal-body"><br>
                <pre>            <black>Producto:</black>          ${producto[0].codigoProducto.descripcionProducto}           
                <b>Procedencia:</b>        ${producto[0].procedencia}
                <b>Cantidad:</b>        ${producto[0].descripcionProducto}          
                <b>Unidad:</b>          ${producto[0].codigoProducto.unidadMedida}
                <b>Marca:</b>          ${producto[0].marca}
                <b>Color:</b>          ${producto[0].color}`
        if(producto[0].codigoProducto.lote){   
            modal += `<br><b>            Lote:</b>            ${producto[0].codigoProducto.lote}`
        }
        modal +=`</pre>
                <laber>Operacion: <b>salida Producto<b></label>
                <br>
                <br>Cantidad: 
                <input type="number" id="cantidadP" placeholder="ejemplo: 3">
                <br><br> `
        modal = changueModal(modal, producto)
        
        modal +=       `<button id="registrar_edicion" name="registrar_edicion" value="Guardar cambios">Guardar</button>
                        <button id="closeModal" >Cancelar</button>
                    <br><br></div>
                    <div class="modal-footer"><h4 align="center">Llene todos los datos!<h4></div>
                </div>
            </div>`
    return modal
}

function changueModal(modal, producto){

    if(producto[0].codigoProducto.idUnidad.id === 2){
        modal += `Motivo salida: <select style="margin-ledt: 5px;" id="salidaMedicamento" name="salidaMedicamento">
                    <option selected>-Seleccione-</option>
                    <option value="Entrega consumo">Entrega para consumo</option>
                    <option value="Baja por caducidad">Baja por caducidad</option>
                    <option value="Venta">Venta</option>
                    <option value="Traspaso">Traspaso</option></select><br><br>
                <form action="" name="selectOptions">
                    <div id="containDivsMedicCenter"></div>
                </form>`
    }else{
        modal +=`Beneficiario: <select id="usuariosExternos" name="usuariosExternos">`
        producto[1].forEach((userExternal)=>{
            modal+=`<option value="${userExternal.nombre}">${userExternal.nombre}</option>`
        })
        modal +=`</select><br><a style="margin-left:15px;" href="#" id="nuevoDonante" onclick="nuevoDonante('usuarioExterno')">nuevo beneficiario</a><br><br>`    
    }
    return modal;
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