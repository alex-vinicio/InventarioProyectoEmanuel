async function generalSelector(divPwd, divtipoU){
    const $usuario = await getData('getUserData')
    if($usuario[1] === 1){
        templatePwd(divPwd,$usuario[1])
        templateTipoU(divtipoU,$usuario[1])
    }else{
        templatePwd(divPwd,$usuario[1])
        templateTipoU(divtipoU,$usuario[1])
    }
}

function templatePwd(containerPwd,codU){
    containerPwd.innerHTML = ""

    let pwdInput = ""
    if(codU === 1){
        pwdInput += `<label>* Ingrese la contraseña</laber>
                    <input type="password" id="passUserInter" name="passUserInter" class="form-control" required>`
    }else{
        pwdInput +=`<input type="hidden" id="passUserInter" name="passUserInter">`
    }
    const element = createTemplate(pwdInput)
    containerPwd.append(element)
}

function templateTipoU(containerTipoU,codU){
    containerTipoU.innerHTML = ""
    let select = `<label sttyle="margin:5px;">* Seleccione el tipo de usuario</laber>
                    <select id="tipoU" name="tipoU" class="form-control" required>`
    if(codU === 1){
        select += `<option value="1">Administrador</option>
                    <option value="2">Casa Hogar</option>
                    <option value="3">Centro Medico</option>
                    <option value="8">Empresa</option>
                    <option value="9">Persona natural</option>`
    }else{
        select += `<option value="8">Empresa</option>
                    <option value="9">Persona natural</option>`
    }
    select += `</select>`
    const element = createTemplate(select)
    containerTipoU.append(element)
}
async function getDatosupdate(data,form){
    form.reset()
    form.elements.nombreU.value = "";
    form.elements.id.value = data.id
    form.elements.nombreU.value = data.nombre
    form.elements.correoU.value = data.usuario
    form.elements.passUserInter.value = data.password
    form.elements.tipoU.value = data.idRol.id
}