const $formHidenUser = document.forms.hiddenUsers
const $usuarioEntrega = document.getElementById('usuarioEntrega')
const $usuarioRecibe = document.getElementById('usuarioRecibe')
const $divTableU = document.getElementById('tablaUsuarios');
//listado automatico
(async function load(){
    await getData('deleteCacheUsersCustodio')
    await getTableUsers($divTableU)
})()