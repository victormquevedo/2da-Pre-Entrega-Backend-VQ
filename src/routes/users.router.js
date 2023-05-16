import { Router } from "express"
import UserManager from "../dao/userManager.js"

const router = Router()
const userManager = new UserManager()

router.post('/signup',  async (req, res) => {
    
    const newUser = await userManager.createUser(req.body)
    if(newUser) {
        res.redirect('/views/login')
    } else{
        req.session.err = `El mail ${req.body.email} ya se encuentra registrado`
        res.redirect('/views/error')
    }
})

router.post('/login',  async (req, res) => {

    const {email, password} = req.body
    const user = await userManager.loginUser(req.body)
    if(user) {
        req.session.email = email
        req.session.password = password
        req.session.firstName = user.firstName
        req.session.lastName = user.lastName
        req.session.age = user.age
        req.session.role = user.role
        res.redirect('/views/products')
    } else{
        req.session.err = "Usuario o contraseña incorrectos"
        res.redirect('/views/error')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/views/login')
    })
})


export default router