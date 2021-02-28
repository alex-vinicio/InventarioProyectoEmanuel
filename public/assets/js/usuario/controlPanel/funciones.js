//mostrar navegacion usuario
async function userNavigation($divNameUser){
    $divNameUser.innerHTML = ""
    const dateUser = await getData('getUserData')
    
    let informacion = `<a href="#" onclick="panelUsuario(${dateUser[1]})"><h4>${dateUser[0]}</h4></a>`
    const element = createTemplate(informacion)
    $divNameUser.append(element)
}
async function panelUsuario(id){
    location.href="controlPanel";
}
// generador del listado de la tabla
async function getTableUsers($divTableU){
    $divTableU.innerHTML=""
    const lista = await getData('getAllUsers')
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
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>
                <div >  
                    <form name="searchRol">
                        <input type="text" class="form-control" name="rol" placeholder="Rol:">
                    </form>
                </div>
            </th>
            <th>Accion</th>
        </tr>
    </thead>`
    return table
}
function controlDates(table,usuario){
    let fechaIngreso = setDateString(usuario.fechaModificacion)
    table += `  <td >${fechaIngreso}</td>`
    return table
}
function templateUsuario(table,usuario,numero){
    
    table += `<tr>
            <td>${numero}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.usuario}</td>`
    if(usuario.estado === true){
        table += `<td>Activo</td>`
    }else{
        table += `<td>Suspendido</td>`
    }
    table = controlDates(table,usuario)
    table += `<td>${usuario.idRol.nombreRol}</td>
    <td class="text-center"><i class="text-danger fa fa-trash" onclick="confirmDeleteCur(${usuario.id})"></i></td>`
    table+=`</tr>`
    return table
}
//eliminar un usuario
function confirmDeleteCur(id){
    alertify.confirm('¿Estás seguro de que deseas Eliminar el usuario?', function(e){
        if(e){ deleteCursos(id)}
    });
}
async function deleteCursos(id){
    const data = new URLSearchParams(`id=${id}`)
    const response = await getDataPost('deleteUser', data)
    console.log(response)
    if(response === true){
        alertify.success('Se eliminó con éxito')
        getTableUsers($divTableU)
    }else{
        alertify.error(`Error ${response}`)
    }
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
        const listaUsers = await getData('getAllUsers')
        const list = await getFilterUser(listaUsers, datos)// genera una lista de los valores encontrados 
        await getUsuarios(list, $divTableU) //actualiza tabla con datos encontrados
    })
    formRol.addEventListener('submit', async (event)=>{
        event.preventDefault()
        const datos = dataInputUsers(formNombre,formRol)
        const listaUsers = await getData('getAllUsers')
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
                    list.forEach((lt)=>{ if(lt.idRol.nombreRol.indexOf(rolU) !== -1 ){ lista.push(lt) } })    
                }
                break   
        }
        return lista
}
async function listarPatrimonio(){
    const data = new URLSearchParams(`id=3`)
    const response = await getData('getUserData')
    const departament = await getDataPost('typePoductoCache',data)
    console.log(departament)
    if(response[1]===1){
        location.href="patrimonio";
    }else{
        location.href="viewAdmin";
    }
}