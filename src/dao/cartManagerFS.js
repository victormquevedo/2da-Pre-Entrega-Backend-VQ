import fs from 'fs'
import ProductManager from './productManagerFS.js'

const PATH = 'carts.json'
const PATH_PRODUCTS = 'products.json'

class CartManager {
    constructor() {
        this.path = PATH
    }

    async addCart () {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(PATH, JSON.stringify([]))
        }
        const carts = await this.getCarts()
        const id = this.#generateId(carts)
        const newCart = {id, 'products' :[]}

        carts.push(newCart)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4))
            return newCart
        } catch {
            throw new Error
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
        cartId = parseInt(cartId)
        const carts = await this.getCarts()
        const cart =  carts.find((cart) => cart.id === cartId)
        
        if (!cart) {
            const error = new Error('Cart not found')
            error.code = 404 
            throw error
        }

        return cart
    }


    async addProductToCart(cartId, productId) {
        cartId = parseInt(cartId)
        productId = parseInt(productId)

        const carts = await this.getCarts()

        const cartIndex = carts.findIndex((cart) => cart.id === cartId)

        if (cartIndex == -1) {
            const error = new Error('Cart not found')
            error.code = 404
            throw error
        }

        const productManager = new ProductManager(PATH_PRODUCTS)

        try {
            await productManager.getProductById(productId)
        } catch (error) {
            throw error
        }

        const productIndex = this.#productExistsInCart(carts[cartIndex], productId) 

        if(productIndex != -1) {
            carts[cartIndex].products[productIndex].quantity++
        } else {
            carts[cartIndex].products.push({'product':productId, 'quantity':1})
        }

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4))
            return carts[cartIndex]
        } catch {
            const error = new Error('Can not add product to cart')
            error.code = 400
            throw error
        }
    }

    #productExistsInCart(cart, productId) {
        return cart.products.findIndex((product) => product.product === productId)
    } 

    #generateId(carts) {
        return carts.length
            ? carts[carts.length - 1].id + 1
            : 1
    }
}

export default CartManager