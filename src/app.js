import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import './db/dbConfig.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import chatRouter from './routes/chat.router.js'
import viewsRouter from './routes/views.router.js'
import usersRouter from './routes/users.router.js'
import { Server } from 'socket.io'
import MessageManager from './dao/messagesManagerMongo.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'


const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use(
    session({
        secret: 'sessionKey',
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({
            mongoUrl: 'mongodb+srv://atello:D8YMIQ2LKtW6VSmp@cluster0.90kpthn.mongodb.net/ecommerce?retryWrites=true&w=majority'
        })
    })
)

 
app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
    res.redirect('/views/login')
})
app.use('api/products', productsRouter)
app.use('api/carts', cartsRouter)
app.use('api/chat', chatRouter)
app.use('/views', viewsRouter)
app.use('/api/users', usersRouter)



const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

const socketServer = new Server(httpServer)
const messageManager = new MessageManager()

socketServer.on('connection', async (socket) => {
    console.log(`${socket.id} connected`)

    socket.on('message', async info => {
        await messageManager.addMessage(info)
        const updatedMessages = await messageManager.getMessages()
        socketServer.emit('chat', updatedMessages)
    })

    socket.on('userConnected', username => {
        socket.broadcast.emit('alertUserConnected', username)
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
    })

})
