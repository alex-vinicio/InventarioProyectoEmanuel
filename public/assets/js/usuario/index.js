const $formLogin = document.forms.login

$formLogin.addEventListener('submit', async (event)=>{
    event.preventDefault()
    await sendLogin($formLogin)
    
})

async function sendLogin(form){
    const data = new FormData(form)  
    const response = await getDataPost('findUser', data)
    if(response == true){
        alertify.success('usuario correcto')
        location.href="viewAdmin";
    }else{
        alertify.error('credenciales invalidas')
        location.href="/";
    }
}
