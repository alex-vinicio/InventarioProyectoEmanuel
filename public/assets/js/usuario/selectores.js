const $divProxCad = document.getElementById('productos_proximos_caducar');

//listado automatico
(async function load(){
    await getTableProxCaducar($divProxCad)
})()