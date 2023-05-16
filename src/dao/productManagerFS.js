import fs from 'fs'

const PATH = 'products.json'

class ProductManager {
    constructor() {
        this.path = PATH
    }

    async addProduct(product) {

        try {
            this.#validateProduct(product)
        } catch (error) {
            throw error
        }

        const products = await this.getProducts()

        const existingProduct = this.#productExists(products, product.code) 
        if (existingProduct) {
            const error = new Error('The product already exists')
            error.code = 400
            throw error
        }

        const id = this.#generateId(products)
        const newProduct = { id, ...product, 'status':true}

        products.push(newProduct)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
        } catch(error) {
            throw error
        }
    }

    async getProducts(limit) {
        
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile('products.json', JSON.stringify([]))
            }
            const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            if(!limit) return products
            return products.slice(0, limit) 

        } catch(err) {
            const error = new Error('Products not found')
            err.code = 404 
            throw err
        }
    }

    async getProductById(productId) {
        productId = parseInt(productId)
        
        const products = await this.getProducts()
        const product =  products.find((product) => product.id === productId)
        
        if (!product) {
            const error = new Error(`Product with id ${productId} not found`)
            error.code = 404 
            throw error
        }

        return product
    }

    async updateProduct(productId, productValues) {
        productId = parseInt(productId)
        const products = await this.getProducts()
        const productIndex = products.findIndex((product) => product.id === productId )

        if (productIndex == -1) {
            const error = new Error('Product not found')
            error.code = 404
            throw error
        }

        const id = products[productIndex].id
        const updatedProduct = {...products[productIndex], ...productValues, id}
        
        products.splice(productIndex, 1, updatedProduct)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
            return updatedProduct
        } catch {
            const error = new Error('Can not update product')
            error.code = 400
            throw error
        }
        
    }

    async deleteProductById(productId) {
        productId = parseInt(productId)
        const products = await this.getProducts()
        const productIndex = products.findIndex((product) => product.id === productId )

        if (productIndex == -1) {
            const error = new Error('Product not found')
            error.code = 404
            throw error
        }
        
        products.splice(productIndex, 1)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
            return true
        } catch {
            const error = new Error('Cannot delete product')
            error.code = 400
            throw error
        }
    }

    async deleteProducts(productId) {
        const products = await this.getProducts()
        const newProductList = products.filter((product) => product.id !== productId)

        await fs.promises.writeFile(this.path, JSON.stringify(newProductList, null, 4))
    }

    #validateProduct(product) {
        const fields = ['title', 'description', 'code', 'price', 'stock', 'category']
        fields.forEach((field) => {
            if (!product.hasOwnProperty(field)) {
                const error = new Error(`'${field}' field is required`)
                error.code = 400
                throw error
            }
        })
    }

    #productExists(products, productCode) {
        return products.find((product) => product.code === productCode)
    }

    #generateId(products) {
        return products.length
            ? products[products.length - 1].id + 1
            : 1
    }
}

export default ProductManager