const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
const $divformP= document.getElementById('formInmueble');
//listado automatico
(async function load(){
    await getFormPatrimonio()
})()

$optionsForm.addEventListener('change', async ()=>{
    await getFormPatrimonio()
})

async function getFormPatrimonio(){
    $divformP.innerHTML=""
    if($optionsForm.option.value == "vehiculos"){
        await formVehiculo($divformP)
        const data = new URLSearchParams(`id=2`) // manejar 2 valores en URLSearchParams(`id=${idLAC}&idLI=${idLI}`)
        const response = await getDataPost('tipoPatrimonioCache', data)

        //se define despues del load para recnocer a los forms
        const $formvehiculo= document.forms.producto
        const $idBtnLimpiar = document.getElementById('limpiarForm');

        $idBtnLimpiar.addEventListener('click', async (event)=>{
            event.preventDefault()
            $formvehiculo.reset();
        })

        $formvehiculo.addEventListener('submit', async (event)=>{
            event.preventDefault()
            addProductoPatrimonio($formvehiculo)
            
        })
    }else{
        await formInmueble($divformP)
        const data = new URLSearchParams(`id=1`) 
        const response = await getDataPost('tipoPatrimonioCache', data)

        const $idBtnLimpiar1 = document.getElementById('limpiarForm1');
        const $formGeneral = document.forms.productoGeneral

        $idBtnLimpiar1.addEventListener('click', async (event)=>{
            event.preventDefault()
            $formGeneral.reset();
        })
        console.log($formGeneral.elements.codigo.value)
        $formGeneral.addEventListener('submit', async (event)=>{
            event.preventDefault()
            addProductoPatrimonio($formGeneral)
            
        })
    }
}

async function addProductoPatrimonio(form){ // prueba del paso del form
    const data = new FormData(form)  
    const response = await getDataPost('newProduct', data) //url es distinto ue nombre de la ruta
    console.log(response)
    if(!response){
        alertify.error(`Codigo del producto repetido`)
    }else{
        alertify.success(`se ${response[0]} con éxito`)
        await getData('deleteCacheProducto')
        location.href="patrimonio";
    }
    
}

