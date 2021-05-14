const $formProducto = document.forms.producto //definicion del form
const $fechaIngreso = $formProducto.producto_fechaIngreso
const $divLote = document.getElementById('loteCentroMedico')
const $fechaCaducidad = $formProducto.producto_fechaCaducidad;
const $bottonCancelar = $formProducto.producto_cancelar;
const $divChoiceCenterMedic = document.getElementById('choiceCenterMedicMeditions');
const $divIconModulo = document.getElementById('logoModulo');
const $divCheckBoxCenterMedic = document.getElementById('checkbockMedicina');

(async function load(){
    const $data = await getData('cacheGetProducto')
    
    if($data){
        if($data.lote){
            await cargarElementosSegunModulo(1,"update",$divLote, $divChoiceCenterMedic,$divIconModulo,$divCheckBoxCenterMedic)
            document.getElementById('lote').value = $data.lote
        }else{
            await cargarElementosSegunModulo(2,"update",$divLote, $divChoiceCenterMedic,$divIconModulo,$divCheckBoxCenterMedic)
        }
        document.getElementById('producto_unidadMedida').value = $data.unidadMedida
        document.getElementById('producto_cantidadProducto').value = $data.cantidadProducto;
        document.getElementById('producto_cantidadProducto').readOnly = true
    }else{
        await cargarElementosSegunModulo(null,"new",$divLote, $divChoiceCenterMedic,$divIconModulo,$divCheckBoxCenterMedic)
        document.getElementById('producto_cantidadProducto').value = 0;
        document.getElementById('producto_cantidadProducto').readOnly = true
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


