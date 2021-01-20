
async function addProducto(form){ // prueba del paso del form
    const data = new FormData(form)  
    const response = await getDataPost('newProduct', data) //url es distinto ue nombre de la ruta
    
    if(!response){
        alertify.error(`Codigo del producto repetido`)
    }else{
        alertify.success(`se ${response[0]} con éxito`)
        await getData('deleteCacheProducto')
        if(response[1] === 1) {
            location.href="casaHogar";
        }else{
            location.href="centroMedico";
        }
    }
    
}

