const $formHidenProductoTran = document.forms.hiddenProductosTransaccion
const $divListInventary = document.getElementById('listarTransacciones');
//listado automatico
(async function load(){
    await getTableTransaccion($divListInventary)
})()