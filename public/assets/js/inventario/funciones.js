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
            <th>Medida</th>
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
        <td onclick="selectProduct(${producto.id})">${producto.codigo}</td>
        <td onclick="selectProduct(${producto.id})">${producto.descripcionProducto}</td>
        <td>${producto.cantidadProducto}</td>
        <td>${producto.medida} ${producto.unidadMedida}</td>`
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
//buscadores
async function addEventSearchCodProcedencia(){
    const formcod = document.searchCodProceden
    const formProcedencia = document.searchProcedencia
    const formNombre = document.searchNombre
    formcod.codProduct.value = $formHidenProducto.codProducto.value
    formProcedencia.ProcedenciaProd.value = $formHidenProducto.procedenciaProducto.value
    formNombre.nombreProduct.value = $formHidenProducto.nombreProducto.value
    //$divListInventary.innerHTML=""
    console.log("prueba")
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
    switch(data.length){//manejo de 2 casos
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
