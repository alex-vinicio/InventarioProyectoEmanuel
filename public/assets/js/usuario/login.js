async function cerrarSesion(){
    await getData('deleteTypePoductoCache')
    await getData('deleteCacheProducto')
    const response = await getData('logOut')
    deleteAllCookies();
    location.href="viewAdmin";
}
const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
async function listarInventario(val){
    const data = new URLSearchParams(`id=${val}`)
    const response = await getDataPost('typePoductoCache', data)
    await setSelectMenu(val)
}

function homaPage(){
    location.href="viewAdmin";  
}
//recoguer el id del menu
async function setSelectMenu(nameSelect){
    switch(nameSelect){
        case 1:
            redictCasaHogar()
            break;
        case 2:
            redictCentroMedico()
            break;
        case 7:
            await redictNewUser()
            break;
        default:
            redictHomeMenu()    
    }
}
async function redictNewUser(){
    await getData('limpiarCacheModifie')
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
