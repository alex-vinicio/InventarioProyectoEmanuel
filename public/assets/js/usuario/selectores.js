const $divNameUser = document.getElementById('navigateUser')
const $divProxCad = document.getElementById('productos_proximos_caducar');

//listado automatico
(async function load(){
    //controlLogin
    const data = new URLSearchParams(`peticion="ok"`)
    const response = await getDataPost('verificacionIpCliente', data)
    console.log(response)
    // if(response !== "ok"){
    //     location.href="login";
    // }
    await getTableProxCaducar($divProxCad)
    await userNavigation($divNameUser)
})()