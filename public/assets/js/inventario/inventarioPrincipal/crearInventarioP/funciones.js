function returnListar(){
    location.href="patrimonio";
}
async function formVehiculo($container){

    let contenido = `<div style="border-bottom:1px solid #777;">
                    <form class="contact_form" action="" method="post" name="producto" id="producto">
                        <div class="row">
                            <div class="col-xl-9 col-lg-11 col-md-10 col-sm-12">
                                <div class="form-row">
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="placa">* Placa</label><br>
                                        <input type="text" id="placa" name="placa" placeholder="AAC-0123"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="motor">* Motor</label><br>
                                        <input type="text" id="motor" name="motor" placeholder="D4BHF005255"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="cilindraje">* Cilindraje</label><br>
                                        <input type="number" id="cilindraje" name="cilindraje" min=0 placeholder="2500"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="modelo">* Modelo</label><br>
                                        <input type="text" id="modelo" name="modelo" placeholder="H112PAS AC 2.5 4X2 TM DIESEL"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="marca">* Marca</label><br>
                                        <input type="text" id="marca" name="marca" placeholder="HYUNDAI"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="color">Color</label><br>
                                        <input type="text" id="color" name="color" placeholder="Plomo" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="chasis">* Chasis</label><br>
                                        <input type="text" id="chasis" name="chasis" placeholder="KMJWA37HAGU7210"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="claseV">* Clase vehicuo</label><br>
                                        <input type="text" id="claseV" name="claseV" placeholder="Camioneta"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="anioModelo">Año modelo</label><br>
                                        <input type="number" id="anioModelo" name="anioModelo" min=0 placeholder="2016" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="conbustible">* Combustible</label><br>
                                        <input type="text" id="conbustible" name="conbustible" placeholder="Diesel"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="ramvcpn">* Ramv/cpn</label><br>
                                        <input type="text" id="ramvcpn" name="ramvcpn" placeholder="T01589937"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="remarcado">Remarcado</label><br>
                                        <input type="text" id="remarcado" name="remarcado" placeholder="No" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="pasajeros">N° pasajeros</label><br>
                                        <input type="number" id="pasajeros" name="pasajeros" min=0 placeholder="12" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="kilometro">* Km</label><br>
                                        <input type="number" id="kilometro" name="kilometro" min=0 placeholder="88456"  required/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-9 col-lg-11 col-md-10 col-sm-12">
                                <div class="form-row">
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <br>
                                        <input type="submit" value="Guardar">
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <br>
                                        <button id="limpiarForm">Limpiar</button>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </form>
                    </div>
                    `
    const $idForm = document.getElementById('vehiculoForm')
    const element = createTemplate(contenido)
    $container.append(element)
}

//formulario inmuebles
async function formInmueble($container){
    let contenido = `<div style="border-bottom:1px solid #777;">
                    <form class="contact_form" action="" method="post" name="productoGeneral" id="producto">
                        <div class="row">
                            <div class="col-xl-9 col-lg-11 col-md-10 col-sm-12">
                                <div class="form-row">
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="codigo">* Codigo</label><br>
                                        <input type="text" name="codigo" placeholder="ABC123D"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="descripcion">* Descripcion</label><br>
                                        <textarea name="descripcion" placeholder="Describir....."  required></textarea>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="cantidad">* Cantidad</label><br>
                                        <input type="number" name="cantidad" placeholder="12" min=0 required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="marca">* Marca</label><br>
                                        <input type="text" name="marca" placeholder="SmarTv LG"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="modelo">* Modelo</label><br>
                                        <input type="text" name="modelo" placeholder="Metalico"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="tamanio">Tamaño</label><br>
                                        <input type="text" name="tamanio" placeholder="Pequeño" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="color">Color</label><br>
                                        <input type="text" name="color" placeholder="Azul" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="estado">* Estado</label><br>
                                        <input type="text" name="estado" placeholder="Activo"  required/>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="forma">Forma</label><br>
                                        <input type="text" name="forma" placeholder="circular" />
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="observaciones">* Observaciones</label><br>
                                        <textarea name="observaciones" placeholder="S/N....."  required></textarea>
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <label for="claveCatastral">Clave Catastral</label><br>
                                        <input type="text" name="claveCatastral" placeholder="1234-1212-00059" min=0 />
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-9 col-lg-11 col-md-10 col-sm-12">
                                <div class="form-row">
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <br>
                                        <input type="submit" value="Guardar">
                                    </div>
                                    <div class="form-group col-xl-2 col-lg-3 col-md-4 col-sm-4">
                                        <br>
                                        <button id="limpiarForm1">Limpiar</button>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </form>
                    </div>`
    const element = createTemplate(contenido)
    $container.append(element)
}