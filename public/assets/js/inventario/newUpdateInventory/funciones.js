
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

async function chargueCheckbox(templateCheck,checkNum){
    templateCheck.innerHTML = ""
    if(!checkNum){
        dataCheckBoxs = `<form action="" name="actionsTypeMedics">
                        <label>Medicamentos
                            <input type="radio" name="option" value="medicamento" checked>
                        </label>
                        <label> Otros insumos medicos
                            <input type="radio" name="option" id="noLote" value="insumosMedicos" >
                        </label>
                    </form>`
    }else{
        if(checkNum ==1){
            dataCheckBoxs = `<form action="" name="actionsTypeMedics">
                        <label>Medicamentos
                            <input type="radio" name="option" value="medicamento" checked>
                        </label>
                        <label> Otros insumos medicos
                            <input type="radio" name="option" id="noLote" value="insumosMedicos" >
                        </label>
                    </form>`
        }else{
            dataCheckBoxs = `<form action="" name="actionsTypeMedics">
                        <label>Medicamentos
                            <input type="radio" name="option" value="medicamento">
                        </label>
                        <label> Otros insumos medicos
                            <input type="radio" name="option" id="noLote" value="insumosMedicos" checked>
                        </label>
                    </form>`
        }
    }
    
    const elementCheckBoxs = createTemplate(dataCheckBoxs)
    templateCheck.append(elementCheckBoxs)
}

async function chargeNumLote(template, validation){
    template.innerHTML = ""
    if(validation){
        data=`<div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                    <laber class="required">* Numero de lote</label>
                    <input type="text" id="lote" name="lote" class="form-control" required="required">
                </div>`
        const element = createTemplate(data)
        template.append(element)
    }else{
        data = `<input type="hidden" name="lote" id="lote">`
        const element = createTemplate(data)
        template.append(element)
    }
}

async function cargarElementosSegunModulo(checkUpdate,typeForm,templateLote, templateChoiceUnids, templateImage, templateCheck){
    const validation =  await getData('getTypePoductoCache')
    templateImage.innerHTML = ""
    if(validation === "2"){
        dataImage = `<div style = " margin: 5px;">
                        <img style=" width: 10%; height: 10%;" src='assets/img/centro_medico.jpg' >
                    </div>`
        const elementImage = createTemplate(dataImage)
        templateImage.append(elementImage)

        
        if(typeForm == "new"){
            await chargueCheckbox(templateCheck,null);
        }else{
            if(checkUpdate == 1){
                await chargueCheckbox(templateCheck,1);
            }else{
                await chargueCheckbox(templateCheck,2);
            }   
        }

        templateChoiceUnids.innerHTML = ""
        dataChoiceUnid = `
                            <select type="text" id="producto_unidadMedida" name="producto[unidadMedida]" class="form-control" required="required">
                                <option value selected="selected">-Seleccione-</option>
                                <option value="Milimetros">Milímetros</option>
                                <option value="Gramaje">Gramaje</option>
                                <option value="Mililitros">Mililitros</option>
                                <option value="Tubos">Tubos</option>
                                <option value="Cajas">Cajas</option>
                                <option value="Unidades">Unidades</option>
                                <option value="Frascos">Frascos</option>
                                <option value="Otros">Otros</option>
                            </select>
                            `
        const elementChoiseUnid = createTemplate(dataChoiceUnid)
        templateChoiceUnids.append(elementChoiseUnid)

        if(checkUpdate == 1){
            await chargeNumLote($divLote,validation)
        }else{
            await chargeNumLote($divLote,null)
        }
        await ChargeActionFormCheck()
    }else{
        dataImage = `<div style = " margin: 5px;">
                        <img style=" width: 10%; height: 10%;" src='assets/img/casa_hogar.png' >
                    </div>`
        const elementImage = createTemplate(dataImage)
        templateImage.append(elementImage)
        await chargeNumLote(templateLote,null)
    }
    
}

async function ChargeActionFormCheck(){
    const $formActionsMedics = document.forms.actionsTypeMedics;
        $formActionsMedics.addEventListener('change', async (event)=>{
            event.preventDefault();
            if($formActionsMedics.option.value === "medicamento"){
                await chargeNumLote($divLote,2)
            }else{
                await chargeNumLote($divLote,null)
            }
        })
}



