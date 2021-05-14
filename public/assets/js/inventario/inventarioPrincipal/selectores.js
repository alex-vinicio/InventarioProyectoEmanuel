const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
const $optionsForm1 = document.forms.actions1
const $spoiler1 = document.getElementById('spoiler1')
const $spoiler2 = document.getElementById('spoiler2')
const $formHidden = document.forms.hiddenvehiInm
const $forDatesReport = document.forms.reporteFechas
let list = [];
const $divListInventoryInmueble = document.getElementById('tablaProductoPatrimInmueble');
const $divListInventaryP = document.getElementById('tablaProductoPatrim');
//listado automatico
(async function load(){
    await getTablePatrimonio(list)
    $forDatesReport.elements.starDate.max = new Date().toISOString().split("T")[0];//controlar fecha ingreso hasta hoy
    $forDatesReport.elements.finishDate.max = new Date().toISOString().split("T")[0];
    //await numeroReportes()
})()

$forDatesReport.addEventListener('submit', async (event)=>{
    event.preventDefault()
    var d1 = $forDatesReport.elements.starDate.value
    var d2 = $forDatesReport.elements.finishDate.value
    var date1 = new Date(d1)
    var date2 = new Date(d2)
    if(date1.getTime() >=  date2.getTime()){
        alertify.error("Fechas incorrectas")
    }else{
        await exportarExcel('total')
    }
    
})

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
    console.log(list)
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