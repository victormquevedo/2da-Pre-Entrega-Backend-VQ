import ProductManager from './productManagerMongo.js'
import { cartsModel } from '../db/models/carts.model.js'



class CartManager {

    async addCart () {
        try {
            const newCart = await cartsModel.create({"products": []})
            return newCart
        } catch(err) {
            err.code = 400
            throw err
        }

    }

    async getCarts() {
        
        try {
            const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return carts
        } catch {
            const error = new Error('Carts not found')
            error.code = 404 
            throw error
        }
    }

    async getCartById(cartId) {
        
        try {
            const cart = await cartsModel.findById(cartId).populate('products.product').lean()
            
            if(cart) {
                return cart
            }
            throw new Error
        } catch(err) {
            err.message = `Cart with id ${cartId} not found`
            err.code = 404
            throw err
        }
    }


    async addProductToCart(cartId, productId) {

        const productManager = new ProductManager()
        

        try{
            await productManager.getProductById(productId)
            const cart = await this.getCartById(cartId)
            const existsProductInCart = await cartsModel.findOne({_id: cartId, "products.product": productId})

            if(existsProductInCart) {
                await cartsModel.updateOne({_id:cartId, "products.product":productId},
                {$inc:{"products.$.quantity":1}})
            } else {
                await cartsModel.findOneAndUpdate({_id:cartId},
                {$push:{
                    "products":{product: productId, quantity:1}}})
            }
            return cart
        } catch(err) {
            throw err
        }

        
    }

    async addProductsToCart(cartId, products) {
        try{
            await cartsModel.updateOne({_id:cartId}, {$push:{"products":{$each :products}}})
            const cart = await this.getCartById(cartId)
            return cart
        } catch(err) {
            throw err
        }

    }

    async updateProductQuantityFromCart(cartId, productId, newQuantity) {

        const productManager = new ProductManager()
        try{
            await productManager.getProductById(productId)
            await this.getCartById(cartId) 
            await cartsModel.updateOne({_id:cartId, "products.product":productId}, {$set:{"products.$.quantity":newQuantity}})
        } catch(err) {
            throw err
        }  
    }

    async deleteProductFromCart(cartId, productId) {

        try {
            await this.getCartById(cartId) 
            await cartsModel.updateOne({_id:cartId}, {"$pull":{"products":{"product":productId}}})
        } catch (err) {
            throw err
        }
    }

    async clearCart(cartId) {
        
        try {
            await this.getCartById(cartId) 
            await cartsModel.updateOne({_id:cartId}, {"$pull":{"products":{}}})
        } catch (err) {
            throw err
        }
    }
}

export default CartManager