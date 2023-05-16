import { userModel } from "../db/models/users.model.js";

export default class UserManager {
   
    async createUser(user) {
        const {email} = user
        const userExists = await userModel.find({email})
        
        if(userExists.length !== 0) {
            return null
        } else {
            const newUser = userModel.create(user)
            return newUser
        }
    }

    async loginUser(userData) {
        const {email, password} = userData

        if(await this.#isAdmin(email,password)) return {firstName: 'Admin', lastName: '-', age: '-', email: email, password: password, role: 'Administrador'}

        const user = await userModel.find({email, password})

        if(user.length !== 0) {
            return {...user[0]._doc, 'role':'Usuario'}
        } else {
            return null
        }
    }

    async #isAdmin(email, password) {
        return email === 'adminCoder@coder.com' && password === 'adminCod3r123'

    }
}