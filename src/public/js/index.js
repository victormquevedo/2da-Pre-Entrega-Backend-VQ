const socketClient = io()
const user = document.getElementById('username')
const form = document.getElementById('form')
const message = document.getElementById('message')
const chat = document.getElementById('chat')

let username

Swal.fire({
    title: 'Bienvenido al chat',
    text: 'Ingrese su nombre de usuario (email)',
    input: 'text',
    inputValidator: value => {
        if(!value) {
            return 'No se puede dejar el campo vacío'
        }
    }
})
.then(usuario => {
    username = usuario.value
    user.innerHTML = `Conectado como ${username}`

    socketClient.emit('userConnected', username)
})


form.onsubmit = (e) => {
    e.preventDefault()

    const info = {
        user: username,
        message: message.value
    }
    socketClient.emit('message', info)
    message.value = ''
    
}

socketClient.on('chat', messages => {
    
    const chatMessages = messages.map(info => {
        return `<p class="message">${info.user}: ${info.message}</p>`
    }).join(' ')

    chat.innerHTML = chatMessages
})


socketClient.on('alertUserConnected', username => {
    Toastify({
        text: `${username} se ha conectado`,
        duration: 3000,
        position: "right", 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
})