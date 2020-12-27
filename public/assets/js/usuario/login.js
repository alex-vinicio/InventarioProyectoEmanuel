async function cerrarSesion(){
    await getData('deleteTypePoductoCache')
    await getData('deleteCacheProducto')
    const response = await getData('logOut')
    location.href="viewAdmin";
}

async function listarInventario(val){
    const data = new URLSearchParams(`id=${val}`)
    const response = await getDataPost('typePoductoCache', data)
    setSelectMenu(val)
}

function homaPage(){
    location.href="viewAdmin";  
}
//recoguer el id del menu
function setSelectMenu(nameSelect){
    
    switch(nameSelect){
        case 1:
            redictCasaHogar()
            break;
        case 2:
            redictCentroMedico()
            break;
        default:
            redictHomeMenu()    
    }
}
function redictCasaHogar(){
    location.href="casaHogar";
}
function redictCentroMedico(){
    location.href="centroMedico";
}
function redictHomeMenu(){
    alertify.error('No permitido!')
    location.href="viewAdmin";
}
