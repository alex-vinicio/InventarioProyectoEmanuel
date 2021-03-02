const $form = document.getElementById('usuario');
const $divPwd = document.getElementById('passwordDiv'); 
const $divTipoU = document.getElementById('tipoUsuario');
const $buttonCancel = document.getElementById('usuario_cancelar');
const $pwd = document.getElementById('passUserInter');

//listado automatico
(async function load(){
    await generalSelector($divPwd,$divTipoU)
    const request = await getData('getUserModifie'); //verifica si se redirecciono para modificar usuario
    if(request[1]=== true){
        await getDatosupdate(request[0],$form)
    }else{
        $form.reset();
    }
})()

$buttonCancel.addEventListener('click', async (event)=>{
    event.preventDefault()
    const response = await getData('getUserData')
    if(response[1] === 1){
        location.href="controlPanel";
    }else{
        if(response[1] === 2)
            location.href="casaHogar";
        else
            location.href="centroMedico";
    }
    
})

$form.addEventListener('submit', async (event)=>{
    event.preventDefault()
    const data = new FormData()  
    data.append('id', $form.elements.id.value)
    data.append('nombre', $form.elements.nombreU.value)
    data.append('passw', $form.elements.passUserInter.value)
    data.append('correo', $form.elements.correoU.value)
    data.append('tipoU', $form.elements.tipoU.value) //añadir un elemento en el formdata
    const response = await getDataPost('addUser',data)
    const clearCache = await getData('limpiarCacheModifie')
    if(response[0]){
        alertify.success(`se ${response[0]} con éxito`)
        if(response[1]===1){
            location.href="controlPanel";
        }else{
            if(response[1] === 2)
                location.href="casaHogar";
            else
                location.href="centroMedico";
        }
    }else{
        alertify.error(`Codigo del producto repetido`)
    }
})