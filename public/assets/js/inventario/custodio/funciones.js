// generador del listado de la tabla
async function getTableUsers($divTableU){
    $divTableU.innerHTML=""
    const lista = await getData('getAllUsersCustodio')
    await getUsuarios(lista,$divTableU)
}
async function getUsuarios(lista,$container){
    $container.innerHTML=""
    await renderAllUser(lista,$container)
    await addEventSearchUsersFilters()
}
async function renderAllUser(lista,$container){
    let numero = 1
    let table =`<table id="usuarioTable" class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleProducCadu(table)
    if(lista.length != 0){
        lista.forEach((usuario)=>{
            table = templateUsuario(table,usuario,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="4">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleProducCadu(table){
    table += `
    <thead> 
        <tr>
            <th>N°</th>
            <th>
                <div >  
                    <form name="searchNombre">
                        <input type="text" class="form-control" name="nombreU" placeholder="Nombre:">
                    </form>
                </div>
            </th>
            <th>Email</th>
            <th>
                <div >  
                    <form name="searchRol">
                        <input type="text" class="form-control" name="rol" placeholder="Rol:">
                    </form>
                </div>
            </th>
            <th>Asignar custodio</th>
        </tr>
    </thead>`
    return table
}
function templateUsuario(table,usuario,numero){
    table += `<tr>
            <td>${numero}</td>
            <td ><a >${usuario.nombre}</a></td>
            <td ><a >${usuario.mail}</a></td>`
    table += `<td>${usuario.cargo}</td>`
    table += `<td><input type="checkbox" id="${usuario.id}" name="${usuario.id}" onclick="selecionarUsuario(${usuario.id},'${usuario.nombre}')" value="${usuario.nombre}"></td>`
    table+=`</tr>`
    return table
}
//buscadores para usuario
async function addEventSearchUsersFilters(){
    const formNombre = document.searchNombre
    const formRol = document.searchRol
    formNombre.nombreU.value = $formHidenUser.nombreUser.value
    formRol.rol.value = $formHidenUser.rolUser.value
        
    formNombre.addEventListener('submit', async (event)=>{
        event.preventDefault()//recarga solo la tabla, no la pagina
        const datos = dataInputUsers(formNombre,formRol)// asigna a una lista valores para busqueda de nombre, procedencia y codigo
        const listaUsers = await getData('getAllUsersCustodio')
        const list = await getFilterUser(listaUsers, datos)// genera una lista de los valores encontrados 
        await getUsuarios(list, $divTableU) //actualiza tabla con datos encontrados
    })
    formRol.addEventListener('submit', async (event)=>{
        event.preventDefault()
        const datos = dataInputUsers(formNombre,formRol)
        const listaUsers = await getData('getAllUsersCustodio')
        const list = await getFilterUser(listaUsers, datos)
        await getUsuarios(list,$divTableU)
    })
} 
function dataInputUsers(formNombre,formRol){
        let data = []
        const nombre = formNombre.elements.nombreU.value
        $formHidenUser.nombreUser.value = nombre
        if(nombre != ""){data.push({name:'nombre',val:nombre})} //inserta en lista valores para buscar si no son vacios
       
        const rol = formRol.elements.rol.value
        $formHidenUser.rolUser.value = rol
        if(rol != ""){data.push({name:'rol',val:rol})}
    
        return data
}
async function getFilterUser(list,data){
        if(data.length == 0){return list }//si no ingresa ningun valor a buscar
    
        let nombreU = rolU = null //ahorar codigo asignando null a multiples variables
        let lista = []
        for(var i = 0; i< data.length;i++){//recorre lista de valores antes guardados y asigna a listas independientes
            if(data[i].name === 'nombre'){
                nombreU = data[i].val
            }else{
                rolU = data[i].val
            }
        }   
        
        switch(data.length){//manejo de 2 ca
            case 2: //caso si ingreso valores en todos los inputs
                list.forEach((lt)=>{ if(lt.nombre.indexOf(nombreU) !== -1 && lt.idRol.nombreRol.indexOf(rolU) !== -1){ lista.push(lt) } })//guarda en lista si encontro el nombre y estado
                break
            case 1: //caso si solo ingreso valor en nombre o estado
                if(nombreU != null){
                    list.forEach((lt)=>{ if(lt.nombre.indexOf(nombreU) !== -1 ){ lista.push(lt) } }) 
                }else{
                    list.forEach((lt)=>{ if(lt.cargo.indexOf(rolU) !== -1 ){ lista.push(lt) } })    
                }
                break   
        }
        return lista
}
//usuarios selecionados
async function selecionarUsuario(id, nombre){
    const data = new URLSearchParams(`id=${id}&nombre=${nombre}`)
    const response = await getDataPost('cacheDosUsuarios',data)
    if(response == "morecheck"){
        alertify.error('Solo puede marcar 2 opciones!')
        await getData('deleteCacheUsersCustodio')
        await getTableUsers($divTableU)
        $usuarioEntrega.value = "---"
        $usuarioRecibe.value = "---"
    }else{
        if(response.length == 1){
            $usuarioEntrega.value = response[0].nombre
        }else{
            if(response){
                if(response[0].id === "---" && response[1].id === "---"){
                    await getData('deleteCacheUsersCustodio')
                    $usuarioEntrega.value = "---"
                    $usuarioRecibe.value = "---"
                }
                $usuarioEntrega.value = response[0].nombre
                $usuarioRecibe.value = response[1].nombre
            }else{
                await getData('deleteCacheUsersCustodio')
                $usuarioEntrega.value = "---"
                $usuarioRecibe.value = "---"
            }
        }
    }
}
async function generarCuadro(){
    const $divTablaCustodio = document.getElementById('productosSegunUsuario');
    $divTablaCustodio.innerHTML=""
    const lista = await getData('getProductUserCustodio')
    if(lista){
        await renderAllUserProduct(lista,$divTablaCustodio)
    }else{
        alertify.error('Seleccione usuarios para el cambio de custodio!')
    }
}
async function renderAllUserProduct(lista,$container){
    let numero = 1
    let table =`<table id="usuarioCustodioProductTable" class="table table-responsive table-striped table-hover table-condensed table-bordered">`
    table = templateTitleProducCustodio(table)
    if(lista.length != 0){
        lista.forEach((productoU)=>{
            table = templateUsuarioCustodio(table,productoU,numero)
            numero++
        })
    }else{
        table += `<tr><td colspan="5">No hay Datos para mostrar</td></tr>`
    }
    const element = createTemplate(table)
    $container.append(element)
}
function templateTitleProducCustodio(table){
    table += `
    <thead> 
        <tr>
            <th>N°</th>
            <th>Codigo</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Observacion</th>
        </tr>
    </thead>`
    return table
}
function templateUsuarioCustodio(table,productoU,numero){
    table += `<tr>
                <td>${numero}</td>
                <td>${productoU.codigo}</td>
                <td>${productoU.nombre}: Marca ${productoU.marca}, color ${productoU.color}, \ncantidad ${productoU.cantidad}, pertenece a ${productoU.departamento}</td>
                <td>${productoU.estado}</td>
                <td>${productoU.observaciones} </td>`
    table+=`</tr>`
    return table
}
//generacion de reporte en pdf para firmar
async function generarReportePdf(){
    const $divTablaCustodio = document.getElementById('productosSegunUsuario');
    $divTablaCustodio.innerHTML=""
    const lista = await getData('getProductUserCustodio')
    if(lista){
        if(lista.length>=1){
            await asignarCustodio(lista)
        }else{
            alertify.error('¡El usuario no tiene a cargo activos de custodia!')
        }
    }else{
        alertify.error('Seleccione usuarios para el cambio de custodio!')
    }
}
async function asignarCustodio(lista){
    alertify.confirm('¿Desea continuar con el cambio de custodio?', function(e){
        if(e){generatePDFCustodio(lista)}
    });
}
async function generatePDFCustodio(lista){
    let fecha = new Date();
    let mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre","Octubre", "Noviembre", "Diciembre"]
    const userData = await getData('UsersForPdf')
    var objetos = []
    var objetosArray = []
    var count = 1;
    objetosArray.push([{text: 'N°', style: 'tableHeader',bold: true},{text: 'Codigo', style: 'tableHeader',bold: true},{ text: 'Descripcion', style: 'tableHeader',bold: true},{text: 'Estado', style: 'tableHeader',bold: true},{text:'Observaciones', style: 'tableHeader',bold: true}])
    lista.forEach((rowsData)=>{
        objetos.push({
            0 : count,
            1 : rowsData.codigo,
            2: `${rowsData.nombre}: Marca ${rowsData.marca}, color ${rowsData.color}, \ncantidad ${rowsData.cantidad}, pertenece a ${rowsData.departamento}`,
            3 : rowsData.estado,
            4 : rowsData.observaciones
        });
    
        count++;
    })
    objetos.forEach((rowsData)=>{
        objetosArray.push([rowsData[0], rowsData[1],rowsData[2],rowsData[3],rowsData[4]])
    })

    var dd = {
        content: [
            {
                stack: [
                    'Cayambe, '+fecha.getDate()+' de '+ mes[fecha.getMonth()]+' del '+fecha.getFullYear(),
                ],
                style: 'subheader',
                alignment: 'left'
            },
            {
                text: '\nACTA DE ENTREGA - RECEPCION\n',
                style: 'header',
                alignment: 'center'
            },
            {
                text: [
                    '\n Por medio del presente dejo constancia de la entrega de los siguientes Bienes Muebles y/o Equipos/Productos que se detallan a continuación: \n\n',
                    ],
                style: 'subheader',
                bold: false
            },//desarrollo de la tabla
            {
                style: 'tableExample',
                table: {
                    body:
                        objetosArray
                }
            },
            {
                text: ['\n',
                    'En acuerdo de lo expresado en este documento las partes que intervienen firman de común acuerdo para fines de control interno, archivo y custodia de bienes.\n\n'],
                style: 'subheader',
                bold: false
            },
            {
                alignment: 'justify',
                bold: false,
                columns: [
                    {
                        text: ['ENTREGADO POR: \n\n',
                        '\n'+userData[0].nombre+'\n',
                        userData[0].organizacion],
                        style: 'subheader',
                        bold: false
                    },
                    {
                        text: ['\tRECIBIDO POR: \n\n',
                        '\n\t'+userData[1].nombre+'\n',
                        '\t'+userData[1].organizacion ],
                        style: 'subheader',
                        bold: false
                    }
                ]
            },
            {
                text: ['\n\n\nAUTORIZADO POR:\n',
                        '\n\nIng. Rolando Escola',
                    '\nDirector Proyectos Emanuel'],
                style: 'subheader',
                alignment: 'center'
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
    pdfMake.createPdf(dd).open() //download('Cambio_custodio_activos.pdf')
    const data = new URLSearchParams(`idUE=${userData[0].id}&idUR=${userData[1].id}`)
    const response = await getDataPost('modificarCustodioExistente',data)
    if(response){
        alertify.success("Custodio inicial asignado correctamente!")
        await getTableUsers($divTableU)
    }else{
        alertify.error("Accion no permitida!");
    }
} 
async function retornarPC(){
    location.href="controlPanel";
}