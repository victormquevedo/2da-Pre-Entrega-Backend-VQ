import { Router } from 'express'
import CartManager from '../dao/cartManagerMongo.js '
//import CartManager from '../dao/cartManagerFS.js'

const cartManager = new CartManager()
const router = Router()

router.get('/:cid', async (req, res) => {
    const {cid} = req.params
        
    try {
        const cart = await cartManager.getCartById(cid) 
        res.status(201).json({cart})
    } catch(error) {
        res.status(error.code).json({error: error.message})
    } 

})

router.post('/', async (req, res) => {

    try{
        const newCart = await cartManager.addCart()
        res.status(201).json({'message': 'Cart created successfully', cart: newCart})
    } catch(err) {
        res.status(400).json({error: err.message})
    }

    
})

router.post('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    
    try {
        const cart = await cartManager.addProductToCart(cid, pid) 
        res.status(201).json({'message': 'Product added successfully', cart})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 

})

router.put('/:cid', async (req, res) => {
    const {cid} = req.params
    const products = req.body
    
    try {
        const cart = await cartManager.addProductsToCart(cid, products)
        res.status(201).json({'message': 'Products added successfully', cart})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 

})

router.put('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body
    
    try {
        if (quantity < 1) {
            const error = new Error
            error.message = 'Quantity must be greater than 0'
            throw error
        }
        
        cartManager.updateProductQuantityFromCart(cid, pid, quantity)
        res.status(201).json({'message': `Quantity of product ${pid} changed to ${quantity}`})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 

})

router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    
    try {
        await cartManager.deleteProductFromCart(cid, pid)
        res.status(201).json({'message': `Product ${pid} deleted successfully from cart ${cid}`})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 

})

router.delete('/:cid', async (req, res) => {
    const {cid} = req.params
    
    try {
        await cartManager.clearCart(cid)
        res.status(201).json({'message': `Products deleted successfully. Cart ${cid} is empty`})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 

})

export default router