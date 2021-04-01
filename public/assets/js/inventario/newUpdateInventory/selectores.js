const $formProducto = document.forms.producto //definicion del form
const $fechaIngreso = $formProducto.producto_fechaIngreso
const $divLote = document.getElementById('loteCentroMedico')
const $fechaCaducidad = $formProducto.producto_fechaCaducidad;
const $bottonCancelar = $formProducto.producto_cancelar;

(async function load(){
    cargarLote($divLote)
    const $data = await getData('cacheGetProducto')
    
    if($data){
        if($data.lote){
            document.getElementById('lote').value = $data.lote
        }else{
            document.getElementById('lote').value = ""
        }
    }
})()

$formProducto.addEventListener('submit', async (event)=>{
    event.preventDefault()
    $formProducto.producto_id = 2
    await addProducto($formProducto)
})

$bottonCancelar.addEventListener('click', async (event)=>{
    event.preventDefault()
    const response = await getData('getTypePoductoCache')
    if(response === 1){
        location.href="casaHogar";
    }else{
        location.href="centroMedico";
    }
    
})
