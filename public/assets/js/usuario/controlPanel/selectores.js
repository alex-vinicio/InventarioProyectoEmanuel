const $divNameUser = document.getElementById('navigateUser');
const $formHidenUser = document.forms.hiddenUsers
const $divTableU = document.getElementById('tablaUsuarios');
//listado automatico
(async function load(){
    await userNavigation($divNameUser)
    await getTableUsers($divTableU)
    const request = await getData('limpiarCacheCustodioU')
})()

