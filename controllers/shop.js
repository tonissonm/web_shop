const Product = require('../models/product')
const Cart = require('../models/cart')

class shopController{
    async getAllProducts(req,res){
        const products = await Product.findAll();
        console.log(products);
        res.status(201).json({
            products:products
        })
    }
    async getCart(req,res){
        const userCart = await req.user.getCart();
        console.log(userCart);
        const cartProducts = await userCart.getProducts();
        res.status(201).json({
            products:cartProducts
        })
    }
}
module.exports = new shopController();