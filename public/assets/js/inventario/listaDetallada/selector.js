const $formHidenProducto = document.forms.hiddenProductos
const $divListInventary = document.getElementById('listarTransacciones');
//listado automatico
(async function load(){
    await getTableTransaccion($divListInventary)
})()