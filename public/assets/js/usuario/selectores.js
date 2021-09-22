const $divNameUser = document.getElementById('navigateUser')
const $divProxCad = document.getElementById('productos_proximos_caducar');

//listado automatico
(async function load(){
    //controlLogin
    await getTableProxCaducar($divProxCad)
    await userNavigation($divNameUser)
})()