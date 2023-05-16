import { productsModel } from "../db/models/products.model.js"

export default class ProductManager {
    async addProduct(product) {
        try {
            const newProduct = await productsModel.create(product)
            return newProduct
        }
        catch(err) {
            err.code = 400
            throw err
        }
    }
    
    async getProducts(limit, page, query, sort) {
             
        try {
            page = parseInt(page)
            const products = await productsModel.paginate(query,{limit, page, sort: {price: sort}, lean:true, leanWithId: false})
            if (page > products.totalPages || isNaN(page)) {
                const err = new Error
                err.message = "That page doesn't exist"
                err.code = 404
                throw err
            }
            const info = {
                status: true,
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page,
                hasPrevPage:  products.hasPrevPage,
                hasNextPage: products.hasNextPage , 
                prevLink: products.hasPrevPage ? `localhost:8080/products?page=${products.prevPage}` : null, 
                nextLink: products.hasNextPage ? `localhost:8080/products?page=${products.nextPage}` : null
            }
            return info
        }
        catch(err) {
            err.code = 400
            throw err
        }
    }

    async getProductById(productId) {
        try {
            const product = await productsModel.findById(productId)
            return product
        } catch(err) {
            err.message = `Product with id ${productId} not found`
            err.code = 404
            throw err
        }
        
    }

    async updateProduct(productId, productValues) {
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate(productId, productValues)
            return await productsModel.findById(productId)
        } catch(err) {
            err.code = 400
            throw err
        }
    }

    async deleteProductById(productId) {
        
        try {
            const deleteProduct = await productsModel.findByIdAndDelete(productId)
            return deleteProduct
        } catch(err) {
            err.code = 400
            throw err
        }
    }

    async deleteProducts(productId) {
        const products = await this.getProducts()
        const newProductList = products.filter((product) => product.id !== productId)

        await fs.promises.writeFile(this.path, JSON.stringify(newProductList, null, 4))
    }
}