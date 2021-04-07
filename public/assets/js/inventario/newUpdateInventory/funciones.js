
async function addProducto(form){ // prueba del paso del form
    const $lote = document.getElementById('lote').value
    const data = new FormData(form)  
    data.append('lote',$lote)
    const deleteCache1 = await getData('limpiarCacheModifieAF')
    const deleteCache = await getData('deleteTipoPatrimonioCache')
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

async function cargarLote(template){
    const validation =  await getData('getTypePoductoCache')
    if(validation === "2"){
        template.innerHTML = ""
        data=`<div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                <laber class="required">* Numero de lote</label>
                <input type="text" id="lote" name="lote" class="form-control" required="required">
            </div>`
        const element = createTemplate(data)
        template.append(element)
    }else{
        template.innerHTML = ""
        data = `<input type="hidden" name="lote" id="lote">`
        const element = createTemplate(data)
        template.append(element)
    }
}

