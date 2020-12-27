//Formularios
function resetForm($form) {
    const nrInputs = ($form.length - 1)
    for(var i = 0; i < nrInputs; i++){
        $form.elements[i].value = ""
    }
}
function enableForm($form) {
    for (i = 0; ele = $form.elements[i]; i++) {
        ele.disabled = false;
    }
}
function disableForm($form) {
    for (i = 0; ele = $form.elements[i]; i++) {
        ele.disabled = true;
    }
}
//Da formato a las fechas
function setDateString(date) {
    if(!date){ return null }
    var date = new Date(date);
    let mes = (parseInt(date.getMonth()) + 1);
    if (mes < 10) { mes = '0' + mes }
    let dia = (parseInt(date.getDate()) );
    if (dia < 10) { dia = '0' + dia }
    return (date.getFullYear() + '-' + mes + '-' + dia);
}
//Crea el elemento html
function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
}