const $formHidenProductoTran = document.forms.hiddenProductosTransaccion
const $divModalUpdate = document.getElementById('modal')
const $divListInventary = document.getElementById('listarTransacciones');
//listado automatico
(async function load(){
    await getTableTransaccion($divListInventary)
})()