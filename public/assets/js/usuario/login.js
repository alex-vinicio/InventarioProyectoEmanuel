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
    console.log(nameSelect)
    switch(nameSelect){
        case 1:
            redictCasaHogar()
            break;
        case 2:
            redictCentroMedico()
            break;
        case 7:
            redictNewUser()
            break;
        default:
            redictHomeMenu()    
    }
}
function redictNewUser(){
    location.href="usuariosGestion";
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
