const $optionsForm = document.forms.actions
const $formHidenProducto = document.forms.hiddenPatrimonio
const $divformP= document.getElementById('formInmueble');
//listado automatico
(async function load(){
    const response = await getData('getCacheAF');
    if(response){
        if(response[1] === "1"){
            await getFormPatrimonio($divformP)
            const $form1= document.forms.producto
            await lLenarFormVehiculo($form1,response[2])
        }else{
            $optionsForm.option.value = "inmuebles"
            await getFormPatrimonio($divformP)
            const $form2 = document.forms.productoGeneral
            await llenarFormGeneral($form2,response[2])
        }   
    }else{
        await getFormPatrimonio()
    }
})()

$optionsForm.addEventListener('change', async ()=>{
        await getFormPatrimonio()
})

async function getFormPatrimonio(){
    $divformP.innerHTML=""
    if($optionsForm.option.value == "vehiculos"){
        await formVehiculo($divformP)
        const data = new URLSearchParams(`id=2`) 
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
        
        $formGeneral.addEventListener('submit', async (event)=>{
            event.preventDefault()
            addProductoPatrimonio($formGeneral)
            
        })
    }
}

async function addProductoPatrimonio(form){ // prueba del paso del form
    const data = new FormData(form)  
    const response = await getDataPost('newProduct', data) //url es distinto ue nombre de la ruta
    if(!response){
        alertify.error(`Codigo del producto repetido`)
    }else{
        alertify.success(`se ${response[0]} con éxito`)
        await getData('deleteCacheProducto')
        location.href="patrimonio";
    }
    
}

