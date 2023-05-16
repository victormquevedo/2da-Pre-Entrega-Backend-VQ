import mongoose from 'mongoose'

const URI = 'mongodb+srv://atello:D8YMIQ2LKtW6VSmp@cluster0.90kpthn.mongodb.net/ecommerce?retryWrites=true&w=majority'

await mongoose.connect(URI)
    .then(() => console.log('Connected'))
    .catch(error => console.log(error))
