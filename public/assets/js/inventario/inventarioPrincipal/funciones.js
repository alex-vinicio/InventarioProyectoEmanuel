async function generalTableVehiculo($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=1`) 
    const lista = await getDataPost('listarInmuebles',data)  
    await getVehiculo(lista,$container)
}
async function getVehiculo(lista,$container){
    $container.innerHTML = ""
    await renderVehiculo(lista,$container)
    await addEventSearchActivosFijos1()
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
                    <form name="searchCod1">
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
function templateDataVehiculo(table,inventario,numero){
    table += `<tr>
        <td>${numero}</td>
        <td onclick="updateAF(${inventario.id},1)"><a href="#">${inventario.codigo}</a></td>
        <td>${inventario.motor}</td>
        <td>${inventario.cilindraje}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.color}</td>
        <td>${inventario.chasis}</td>
        <td>${inventario.tipoVehiculo}</td>  
        <td>${inventario.anioModelo}</td>
        <td>${inventario.combustible}</td>
        <td>${inventario.ramvCpn}</td>`
        if(inventario.remarcado === true ){
            table += `<td><input type="checkbox" value="true" checked></td>`
        }else{
            table += `<td><input type="checkbox" value="false" ></td>`
        }
        
    table = getAccionsVehiculo(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsVehiculo(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${ inventario.id})"></i></td>`
    return table
}

// -------------------- separacion de vehiculo y demas vienes
async function generalTableInmueble($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=3`) 
    const lista = await getDataPost('listarInmuebles',data) 
    await getInmueble(lista,$container)
}
async function getInmueble(lista,$container){
    $container.innerHTML = ""
    await renderInmueble(lista,$container)
    await addEventSearchActivosFijos2()
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
        table += `<tr class="text-center"><td colspan="14">No hay Datos para mostrar</td></tr>`
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
                <form name="searchCod2">
                    <input type="text" class="form-control" name="inmueble" placeholder="Codigo:">
                </form>
            </div>
        </th>
        <th>Descripcion</th>
        <th >Cantidad</th>
        <th >Marca</th>
        <th>Modelo</th>
        <th>Tamaño</th>
        <th>Color</th>
        <th>Estado</th>
        <th>Forma</th>
        <th>Observaciones</th>
        <th>Clave catastral</th>
        <th>fecha actualizacion</th>
        <th>accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataInmueble(table,inventario,numero){
    
    table += `<tr>
        <td>${numero}</td>
        <td onclick="updateAF(${inventario.id},3)"><a href="#">${inventario.codigo}</a></td>  
        <td>${inventario.descripcionProducto}</td>
        <td>${inventario.cantidadProducto}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.tamanio}</td>
        <td>${inventario.color}</td>
        <td>${inventario.estado}</td>
        <td>${inventario.forma}</td>
        <td>${inventario.observaciones}</td>`
        if(inventario.claveCatastral){
            table+=`<td>${inventario.claveCatastral}</td>`
        }else{
            table+=`<td class="text-center"> ----</td>`
        }
        
        table+=`<td>${inventario.fechaIngreso}</td>
    `
    table = getAccionsInmueble(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsInmueble(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProducto(${ inventario.id})"></i></td>`
    return table
}
//eliminar produto//
async function confirmDeleteProducto(codProd){
    console.log(codProd)
    alertify.confirm('¿Estás seguro de Eliminar el producto?', function(e){
        if(e){ deleteProducto(codProd)}
    });
}
async function deleteProducto(id){
    const data = new URLSearchParams(`id=${id}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('deleteProducto', data)
    if(response){ //if(response === true){ es exactamente igual que colocal if(response){}
        alertify.success('Se eliminó con éxito')
        location.reload();
    }else{
        alertify.error('Error al eliminar el producto')
    }
}
// -------------------- separacion activo fijo de tipo nueble
async function generalTableMueble($container){
    $container.innerHTML = ""
    const data = new URLSearchParams(`idInm=2`) 
    const lista = await getDataPost('listarInmuebles',data)  
    await getMueble(lista,$container)
}
async function getMueble(lista,$container){
    $container.innerHTML = ""
    await renderMueble(lista,$container)
    await addEventSearchActivosFijos3()
}
async function renderMueble(lista,$container){
    let numero = 1
    let table =`<table class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleMueble(table)
    if(lista.length != 0){
        lista.forEach((inventario)=>{
            table = templateDataMueble(table,inventario,numero)
            numero++
        })
    }else{
        table += `<tr class="text-center"><td colspan="14">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleMueble(table){
    table += `
    <thead> 
        <tr>
        <th>N°</th>
        <th>
            <div >  
                <form name="searchCod3">
                    <input type="text" class="form-control" name="mueble" placeholder="Codigo:">
                </form>
            </div>
        </th>
        <th>Descripcion</th>
        <th >Cantidad</th>
        <th >Marca</th>
        <th>Modelo</th>
        <th>Tamaño</th>
        <th>Color</th>
        <th>Estado</th>
        <th>Forma</th>
        <th>Observaciones</th>
        <th>fecha actualizacion</th>
        <th>accion</th>
        </tr>
    </thead>`
    return table
}
function templateDataMueble(table,inventario,numero){
    
    table += `<tr>
        <td>${numero}</td>
        <td onclick="updateAF(${inventario.id},2)"><a href="#">${inventario.codigo}</a></td>  
        <td>${inventario.descripcionProducto}</td>
        <td>${inventario.cantidadProducto}</td>
        <td>${inventario.marca}</td>
        <td>${inventario.modelo}</td>
        <td>${inventario.tamanio}</td>
        <td>${inventario.color}</td>
        <td>${inventario.estado}</td>
        <td>${inventario.forma}</td>
        <td>${inventario.observaciones}</td>
        <td>${inventario.fechaIngreso}</td>
    `
    table = getAccionsMueble(table,inventario)
    table+=`</tr>`
    return table
}

function getAccionsMueble(table, inventario){
    table += `<td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteProductoInm(${ inventario.id})"></i></td>`
    return table
}
async function nuevoProducto(){
    const clearCache = await getData('limpiarCacheModifieAF')
    location.href="gestionPatrimonio";
}
//eliminar produto//
async function confirmDeleteProductoInm(codProd){
    console.log(codProd)
    alertify.confirm('¿Estás seguro de Eliminar el producto?', function(e){
        if(e){ deleteProductoInm(codProd)}
    });
}
async function deleteProductoInm(id){
    const data = new URLSearchParams(`id=${id}`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
    const response = await getDataPost('deleteProducto', data)
    if(response){ //if(response === true){ es exactamente igual que colocal if(response){}
        alertify.success('Se eliminó con éxito')
        location.reload();
    }else{
        alertify.error('Error al eliminar el producto')
    }
}
//Buscadores------------------
async function addEventSearchActivosFijos1(){//buscador para vehiculos
	const form = document.searchCod1
    form.placa.value = $formHidden.placaVehi.value
			
	form.addEventListener('submit', async (event)=>{
		event.preventDefault()
        const search = form.elements.placa.value
        $formHidden.placaVehi.value = search
		const data = new URLSearchParams(`idInm=1`) 
        const respose = await getDataPost('listarInmuebles',data)
		let lista = [];
		const listaPersonas = respose;

		if(search === ""){
			await getVehiculo(listaPersonas, $divListInventaryP)
		}else{
			listaPersonas.forEach((lt)=>{ 
			if(lt.codigo.indexOf(search) !== -1){ lista.push(lt) } }) 
            await getVehiculo(lista, $divListInventaryP);
		}
	 })
}
async function addEventSearchActivosFijos3(){//buscador para muebles general
	const form = document.searchCod3
    form.mueble.value = $formHidden.codMueble.value
			
	form.addEventListener('submit', async (event)=>{
		event.preventDefault()
        const search = form.elements.mueble.value
        $formHidden.codMueble.value = search
		const data = new URLSearchParams(`idInm=2`) 
        const respose = await getDataPost('listarInmuebles',data)
		let lista = [];
		const listaPersonas = respose;

		if(search === ""){
			await getMueble(listaPersonas, $divListInventaryP)
		}else{
			listaPersonas.forEach((lt)=>{ 
			if(lt.codigo.indexOf(search) !== -1){ lista.push(lt) } }) 
            await getMueble(lista, $divListInventaryP);
		}
	 })
}
async function addEventSearchActivosFijos2(){//buscador para inmuebles
	const form = document.searchCod2
    form.inmueble.value = $formHidden.codInmueble.value
			
	form.addEventListener('submit', async (event)=>{
		event.preventDefault()
        const search = form.elements.inmueble.value
        $formHidden.codInmueble.value = search
		const data = new URLSearchParams(`idInm=3`) 
        const respose = await getDataPost('listarInmuebles',data)
		let lista = [];
		const listaPersonas = respose;

		if(search === ""){
			await getInmueble(listaPersonas, $divListInventoryInmueble)
		}else{
			listaPersonas.forEach((lt)=>{ 
			if(lt.codigo.indexOf(search) !== -1){ lista.push(lt) } }) 
            await getInmueble(lista, $divListInventoryInmueble);
		}
	 })
}

//funciones para generacion de documento excel 
async function generacionExporteExcel(tipoReporte){
    //creacion libro de trabajo
    let activosFijos = null;
    var wb = XLSX.utils.book_new();
    var ws_data = null;
    wb.Props = {//asignacion de datos generales del libro
        Title: "Reporte activos fijos proyectos Emanuel",
        Subject: "Reporte activos fijos",
        Author: "Sistema web inventarios Proyectos Emanuel",
        CreatedDate: new Date()
    };
    await casosGeneracionHojaTrabajo(activosFijos,wb,ws_data,tipoReporte)
    //function exportar libro xlms
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    s2ab(wbout)//convertir de tipo binario a octeto
    let fecha = new Date();
    if(tipoReporte === "total"){
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'ReporteGeneral-'+setDateString(fecha)+'.xlsx');
    }else{
        if(list[0] === 1){
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'reporteVehiculos'+setDateString(fecha)+'.xlsx');//guardar el archivo excel con libreria FIleSaver.js y blob
        }else{
            if(list[0] === 2){
                saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'reporteBienesMueblesGeneral'+setDateString(fecha)+'.xlsx');
            }else{
                saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'reporteBienesInmueblesGeneral'+setDateString(fecha)+'.xlsx');
            }   
        }
    }
    alertify.success('!Se genero el reporte con exito!')
}
async function exportarExcel(tipoReporte){
    alertify.confirm('¿Desea continuar con la exportacion del reporte de activos fijos en excel?', function(e){
        if(e){ generacionExporteExcel(tipoReporte)}
    });
}
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}
function encabezadoExcelGeneral(date, user, title){
     // creacion hoja de trabajo y agregar al libro
    ws_data = [['','','', title]];
    ws_data.push(['']);
    ws_data.push(['','fecha:', date.toUTCString()]);
    ws_data.push(['','Usuario:', user[0]]);
    ws_data.push(['']);
    return ws_data;
}
async function casosGeneracionHojaTrabajo(activosFijos,wb,ws_data,tipoReporte){
    var fechaActual = new Date()
    var userName = await getData('getUserData')
    let d1, d2, date1, date2 = "";
    if($forDatesReport.elements.starDate.value){
        console.log(d1)
        d1 = $forDatesReport.elements.starDate.value + " "
        d2 = $forDatesReport.elements.finishDate.value + " 23:59"
        date1 = new Date(d1)
        date2 = new Date(d2)
    }
    if(tipoReporte === "total"){
        const response = await getData('getAllAF')
        activosFijos = response
        wb.SheetNames.push("Activos fijos");
        ws_data = encabezadoExcelGeneral(fechaActual,userName,'Reporte activos fijos')
        ws_data.push(['','Bienes mueles'])
        ws_data.push(['','Codigo','Descripcion','Cantidad','Marca','Modelo','Tamaño','Color','Estado','Forma','Observaciones','FechaIngreso']);
        if(d1){
            activosFijos.forEach((activos)=>{
                var auxDate = new Date(activos.fechaIngreso)
                if((activos.chasis === "") && (activos.claveCatastral === "")){
                    if((auxDate.getTime() >= date1.getTime()) && (auxDate.getTime() <= date2.getTime()))
                        ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones,activos.fechaIngreso]);
                }
            })
        }else{
            activosFijos.forEach((activos)=>{
                if((activos.chasis === "") && (activos.claveCatastral === ""))
                    ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones,activos.fechaIngreso]);
            })
        }
        ws_data.push([''])
        ws_data.push(['','Placa','Motor','Cilindraje','Modelo','Marca','Color','Chasis','clase','Año modelo','Combustible','Ramv/cpn','Remarcado','FechaIngreso']);
        if(d1){
            activosFijos.forEach((activos)=>{
                var auxDate = new Date(activos.fechaIngreso)
                if(activos.motor){
                    if((auxDate.getTime() >= date1.getTime()) && (auxDate.getTime() <= date2.getTime()))
                        ws_data.push(['',activos.codigo, activos.motor, activos.cilindraje, activos.modelo, activos.marca, activos.color, activos.chasis, activos.tipoVehiculo,activos.anioModelo,activos.combustible, activos.ramvCpn,activos.remarcado,activos.fechaIngreso]);
                }
            })
        }else{
            activosFijos.forEach((activos)=>{
                if(activos.motor)
                    ws_data.push(['',activos.codigo, activos.motor, activos.cilindraje, activos.modelo, activos.marca, activos.color, activos.chasis, activos.tipoVehiculo,activos.anioModelo,activos.combustible, activos.ramvCpn,activos.remarcado,activos.fechaIngreso]);
            })
        }
        ws_data.push([''])
        ws_data.push(['','Bienes Inmuebles'])
        ws_data.push(['','Codigo','Descripcion','Cantidad','Marca','Modelo','Tamaño','Color','Estado','Forma','Observaciones','Clave catastral','FechaIngreso']);
        if(d1){
            activosFijos.forEach((activos)=>{
                var auxDate = new Date(activos.fechaIngreso)
                if(activos.claveCatastral !== ""){
                    if((auxDate.getTime() >= date1.getTime()) && (auxDate.getTime() <= date2.getTime()))
                        ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones, activos.claveCatastral,activos.fechaIngreso]);
                }
            })
        }else{
            activosFijos.forEach((activos)=>{
                if(activos.claveCatastral !== "")
                    ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones, activos.claveCatastral,activos.fechaIngreso]);
            })
        }
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["Activos fijos"] = ws;
    }else{
        if(list[0] === 1){
            const data = new URLSearchParams(`idInm=1`) 
            const lista = await getDataPost('listarInmuebles',data)
            const listaTrans = await getDataPost('listarTransaccionAF',data)
            activosFijos = lista
            wb.SheetNames.push("Bienes muebles-vehiculo");
            ws_data = encabezadoExcelGeneral(fechaActual,userName,'Reporte Bienes muebles-vehiculo')
            ws_data.push(['','Placa','Motor','Cilindraje','Modelo','Marca','Color','Chasis','clase','Año modelo','Combustible','Ramv/cpn','Remarcado']);
            activosFijos.forEach((activos)=>{
                ws_data.push(['',activos.codigo, activos.motor, activos.cilindraje, activos.modelo, activos.marca, activos.color, activos.chasis, activos.tipoVehiculo,activos.anioModelo,activos.combustible, activos.ramvCpn,activos.remarcado]);
                generateReportModificationAF(ws_data,activos,listaTrans)
            })
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets["Bienes muebles-vehiculo"] = ws;
        }else{
            if(list[0] === 2){
                const data = new URLSearchParams(`idInm=2`) 
                const lista = await getDataPost('listarInmuebles',data)
                const listaTrans = await getDataPost('listarTransaccionAF',data)
                activosFijos = lista
                wb.SheetNames.push("Bienes muebles-general");
                ws_data = encabezadoExcelGeneral(fechaActual,userName,'Reporte Bienes muebles-general')
            
                activosFijos.forEach((activos)=>{
                    ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones]);
                    generateReportModificationAF(ws_data,activos,listaTrans)
                })
                var ws = XLSX.utils.aoa_to_sheet(ws_data);
                wb.Sheets["Bienes muebles-general"] = ws;
            }else{               
                    const data = new URLSearchParams(`idInm=3`) 
                    const lista = await getDataPost('listarInmuebles',data)
                    const listaTrans = await getDataPost('listarTransaccionAF',data)
                    activosFijos = lista
                    wb.SheetNames.push("Bienes inmuebles");
                    ws_data = encabezadoExcelGeneral(fechaActual,userName,'Reporte Bienes inmuebles-general')
                    ws_data.push(['','Codigo','Descripcion','Cantidad','Marca','Modelo','Tamaño','Color','Estado','Forma','Observaciones','Clave catastral']);
                    activosFijos.forEach((activos)=>{
                        ws_data.push(['',activos.codigo, activos.descripcionProducto, activos.cantidadProducto, activos.marca, activos.modelo, activos.tamanio, activos.color, activos.estado,activos.forma,activos.observaciones, activos.claveCatastral]);
                        generateReportModificationAF(ws_data,activos,listaTrans)
                    })
                    var ws = XLSX.utils.aoa_to_sheet(ws_data);
                    wb.Sheets["Bienes inmuebles"] = ws;
            }
        }
    }
}
async function generateReportModificationAF(ws_data,activos,listaTrans){
    ws_data.push(['']);
    ws_data.push(['','Modificaciones realizadas a '+activos.codigo]);
    ws_data.push(['','Observaciones','Fecha modificacion']);
    listaTrans.forEach((transaccion)=>{
        for (let i = 0; i < transaccion.length; i++) {
            if(transaccion[i].codigoProducto.id === activos.id){
                ws_data.push(['',transaccion[i].entradaProducto,setDateString(transaccion[i].fechaOperacion)]);
            }  
        }
    })
    ws_data.push(['']);
}
//direcionamiento a interfaz modificacion de activos fijos
async function updateAF(id, tipo){
    const data = new URLSearchParams(`id=${id}&tipo=${tipo}`)
    const clearCache = await getData('limpiarCacheModifieAF')
    const response = await getDataPost('cacheUpdateAF',data)
    
    if(response === "ok"){
        location.href="gestionPatrimonio";
    }else{
        alertify.error("Accion no permitida!");
    }
   
}