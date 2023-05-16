import { Router } from 'express'
//import ProductManager from '../dao/productManagerFS.js'
import ProductManager from '../dao/productManagerMongo.js'

const productManager = new ProductManager()
const router = Router()


router.get('/', async (req, res) => {
    const {limit=10, page=1, sort=null,...query} = req.query
    
    try {
        const products = await productManager.getProducts(limit, page, query, sort)
        res.status(200).json({message: 'productos', products})        
        
    } catch(error) {
        res.status(error.code).json({error: error.message})

    }
})


router.get('/:pid', async (req, res) => {
    const {pid} = req.params
        
    try {
        const product = await productManager.getProductById(pid) 
        res.status(200).json({message: 'productos', product})
    } catch(error) {
        res.status(error.code).json({error: error.message})
    } 
})

router.post('/', async (req, res) => {
    const product = req.body
        
    try {
        await productManager.addProduct(product)
        res.status(201).json({'message': 'Product created', 'product': product})
    } catch(error) {
        res.status(400).json({error: error.message})
    } 
})

router.put('/:pid', async (req, res) => {
    const {pid} = req.params
    const newValues = req.body
    
        
    try {
        const updatedProduct = await productManager.updateProduct(pid, newValues)
        res.status(201).json({'message': 'Product updated', 'product': updatedProduct})
    } catch(error) {
        res.status(error.code).json({error: error.message})
    } 
})

router.delete('/:pid', async (req, res) => {
    const {pid} = req.params
        
    try {
        const deleted = await productManager.deleteProductById(pid)
        if(!deleted) {
            res.status(404).json(`Product ${pid} not found`)
            return
        }
        res.status(200).json(`Product ${pid} deleted successfully`)
    } catch(error) {
        res.status(error.code).json({error: error.message})
    } 
})

export default router