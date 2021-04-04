const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
const $optionsForm1 = document.forms.actions1
const $spoiler1 = document.getElementById('spoiler1')
const $spoiler2 = document.getElementById('spoiler2')
const $formHidden = document.forms.hiddenvehiInm
let list = [];
const $divListInventoryInmueble = document.getElementById('tablaProductoPatrimInmueble');
const $divListInventaryP = document.getElementById('tablaProductoPatrim');
//listado automatico
(async function load(){
    await getTablePatrimonio(list)
    await numeroReportes()
})()

$optionsForm.addEventListener('change', async ()=>{
    await getTablePatrimonio(list)//refresca tabla al cambiar radio buton
})
$optionsForm1.addEventListener('change', async ()=>{
    await getTablePatriInmueble(list)//refresca tabla al cambiar radio buton
})
$spoiler1.addEventListener('click', async ()=>{
    await getTablePatrimonio(list)
})
$spoiler2.addEventListener('click', async ()=>{
    await getTablePatriInmueble(list)
})

async function getTablePatrimonio(list){
    $divListInventaryP.innerHTML=""
    if($optionsForm.option.value == "vehiculos"){
        list.pop() 
        list.push(1)
        generalTableVehiculo($divListInventaryP)
    }else{
        list.pop() 
        list.push(2)
        generalTableMueble($divListInventaryP)
    }
}

async function getTablePatriInmueble(){
    $divListInventoryInmueble.innerHTML=""
    if($optionsForm1.option.value == "inmuebles"){
        list.pop() 
        list.push(3)
        generalTableInmueble($divListInventoryInmueble)
    }
}