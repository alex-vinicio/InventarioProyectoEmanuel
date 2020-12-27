//Función para la llamada al controlador
async function getData(url) {
    const response = await fetch(url);
    if (response.status != 404) {
        const data = response.json();
        return data;
    }
    //Manejo de errores, creamos el mensaje que dara el error
    throw new Error('No se encontró ningún resultado');
}
async function getDataPost(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        body: data
    });
    if (response.status != 404) {
        const data = response.json();
        return data;
    }
    //Manejo de errores, creamos el mensaje que dara el error
    throw new Error('No se encontró ningún resultado');
}
