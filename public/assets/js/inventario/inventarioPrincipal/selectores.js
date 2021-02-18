const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
/* const $realtionTitle = document.getElementById('relation')
const $realtionData = document.getElementById('realtionData'); */
const $divListInventaryP = document.getElementById('tablaProductoPatrim');
//listado automatico
(async function load(){
    await getTablePatrimonio()
})()

$optionsForm.addEventListener('change', async ()=>{
    await getTablePatrimonio()
})

async function getTablePatrimonio(){
    $divListInventaryP.innerHTML=""
    if($optionsForm.option.value == "vehiculos"){
        const data = new URLSearchParams(`idInm=1`) 
        const lista = await getDataPost('listarInmuebles',data)    
        await getVehiculo(lista,$divListInventaryP)
    }else{
        const data = new URLSearchParams(`idInm=2`) 
        const lista = await getDataPost('listarInmuebles',data)  
        await getInmueble(lista,$divListInventaryP)
    }
}