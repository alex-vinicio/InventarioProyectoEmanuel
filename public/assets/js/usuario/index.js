const $formLogin = document.forms.login

$formLogin.addEventListener('submit', async (event)=>{
    event.preventDefault()
    await sendLogin($formLogin)
    location.href="viewAdmin";
})

async function sendLogin(form){
    const data = new FormData(form)  
    const response = await getDataPost('findUser', data)
    
    if(response == true){
        alertify.success('usuario correcto')
    }else{
        alertify.error('credenciales invalidas')
    }
}
