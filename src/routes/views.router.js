import { Router } from 'express'
import ProductManager from '../dao/productManagerMongo.js'
import CartManager from '../dao/cartManagerMongo.js'

const router = Router()
const productManager = new ProductManager
const cartManager = new CartManager

router.get('/products', async (req, res) => {
    const {limit=10, page=1, sort=null,...query} = req.query
    
    try {
        const products = await productManager.getProducts(limit, page, query, sort)
   
        res.render('products',{style:'products.css', products:products.payload, user:req.session})
        
    } catch(error) {
        res.status(error.code).json({error: error.message})

    }
})

router.get('/carts/:cid', async (req, res) => {
    const {cid} = req.params
        
    try {
        const cart = await cartManager.getCartById(cid) 
        res.render('carts',{style:'cart.css', cart:cart})
    } catch(error) {
        res.status(error.code).json({error: error.message})
    } 

})

router.get('/login',  (req, res) => {
    if(req.session?.email) {
        res.redirect('/views/products')
    }
    if(req.session?.err){
        delete req.session.err
    }
    res.render('login')
})

router.get('/signup',  (req, res) => {
    if(req.session?.email) {
        res.redirect('/views/products')
    }
    if(req.session?.err){
        delete req.session.err
    }
    res.render('signup')
})

router.get('/profile',  (req, res) => {
    if(!req.session?.email) {
        res.redirect('/views/login')
        return
    }
    res.render('profile', {user:req.session})
})

router.get('/error',  (req, res) => {
    if(req.session?.email) {
        res.redirect('/views/products')
    }
    res.render('error', {err: req.session.err})
})


export default router