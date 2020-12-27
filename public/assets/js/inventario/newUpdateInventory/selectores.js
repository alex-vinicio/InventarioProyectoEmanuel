const $formProducto = document.forms.producto //definicion del form
const $fechaIngreso = $formProducto.producto_fechaIngreso
const $fechaCaducidad = $formProducto.producto_fechaCaducidad;
const $bottonCancelar = $formProducto.producto_cancelar;

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
