const Product = require('../models/product')
const Cart = require('../models/cart')
class adminShopController  {
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
    async addItemtoCart(req,res) {
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        if (!productId || !quantity){
            return res.status(400).json({
                error: 'Both ProductID and Quantity are required.'
            })
        }
        const userCart = await req.user.getCart();
        try{
            const cartItems = await userCart.getProducts({where: {id:productId}});
            if (cartItems.length > 0){
                const existingItem = cartItems[0];
                existingItem.quantity += quantity;
                return res.status(201).json({
                    message: 'Item quantity has been updated'
                })
            }
            else{
                const newItem = await Product.findByPk(productId)
                const newIteminCart = await userCart.addProduct(newItem, {through:{quantity:quantity}})
                return(res.status(201).json({
                    message: 'An Item has been added to a cart. ',
                    newItem: newIteminCart
                }))
            }
        }
        catch(error){
            return res.status(500).json({
                error: error
            })
        }
    }
    async deleteItemFromCart(req,res){
        const productId = req.body.productId;
        if(!productId){
            res.status(400).json({
                error: 'ProductID is required!'
            })
        }
        try{
            const userCart = await req.user.getCart();
            const cartItems =await userCart.getProducts({where: {id: productId}})
            const cartItem = cartItems[0]
            await userCart.removeProduct(cartItems)
            return res.status(200).json({
                message: 'Item has been removed from the cart.'
            })
        }
        catch(error){
            return res.status(500).json({
                error: error
            })
        }
    }
}
module.exports 