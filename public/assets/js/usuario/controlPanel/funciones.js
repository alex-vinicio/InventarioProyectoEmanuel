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