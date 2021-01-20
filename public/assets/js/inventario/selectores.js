const $formHidenProducto = document.forms.hiddenProductos
const $divModalUpdate = document.getElementById('modal')
const $formHidenDialog= document.forms.hiddenModalDialog

const $divListInventary = document.getElementById('list_casa_hogar');
//listado automatico
(async function load(){
    await getTableCasaHogar($divListInventary)
})()