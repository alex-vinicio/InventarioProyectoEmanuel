const $formLogin = document.forms.login

$formLogin.addEventListener('submit', async (event)=>{
    event.preventDefault()
    await sendLogin($formLogin)
    
})

async function sendLogin(form){
    const data = new FormData(form)  
    const response = await getDataPost('findUser', data)
    console.log(response)
    if(response[0] == true){
        setCookie("name",response[1],12);
        setCookie("hash",response[2],12);
        alertify.success('usuario correcto')                 
        location.href="viewAdmin";
    }else{
        alertify.error('credenciales invalidas')
        location.href="/";
    }
}
function setCookie(key, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));//acept value in hours
    let expires = "expires="+d.toUTCString();
    document.cookie = key+"="+value + ";" + expires + ";path=/";
  }