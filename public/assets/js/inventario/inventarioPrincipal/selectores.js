const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
const $optionsForm1 = document.forms.actions1
const $spoiler1 = document.getElementById('spoiler1')
const $spoiler2 = document.getElementById('spoiler2')
const $divListInventoryInmueble = document.getElementById('tablaProductoPatrimInmueble');
const $divListInventaryP = document.getElementById('tablaProductoPatrim');
//listado automatico
(async function load(){
    await getTablePatrimonio()
})()

$optionsForm.addEventListener('change', async ()=>{
    await getTablePatrimonio()
    await getTablePatriInmueble()
})
$spoiler1.addEventListener('click', async ()=>{
    await getTablePatrimonio()
})
$spoiler2.addEventListener('click', async ()=>{
    await getTablePatriInmueble()
})

async function getTablePatrimonio(){
    $divListInventaryP.innerHTML=""
    if($optionsForm.option.value == "vehiculos"){
        generalTableVehiculo($divListInventaryP)
    }else{
        generalTableMueble($divListInventaryP)
    }
}

async function getTablePatriInmueble(){
    $divListInventoryInmueble.innerHTML=""
    if($optionsForm1.option.value == "inmuebles"){
        generalTableInmueble($divListInventoryInmueble)
    }
}