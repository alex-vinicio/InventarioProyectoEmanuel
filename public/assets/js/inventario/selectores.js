const $divListInventary = document.getElementById('list_casa_hogar');
//listado automatico
(async function load(){
    await getTableCasaHogar($divListInventary)
})()