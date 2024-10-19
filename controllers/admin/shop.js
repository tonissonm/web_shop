const Product = require('../models/product.js')
const Cart = require('../models/cart.js')
const Order = require('../models/order.js');
const OrderItem = require('../models/order-item.js');
const CartItem = require('../models/cart-item.js'); 
const User = require('../models/user.js');
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
    async addOrder(req,res){
        const userId = req.user.id;
        const userCart = await req.user.getCart();
        const cartItems = await userCart.getProducts({
            attributes:['id'],through:{
                attributes:['quantity']
            }
        });
        if(!cartItems.length >0){
            return res.status(500).json({error:'Cart is empty.'})
        }
        try{
            const orderItems = await cartItems.map(cartItem =>{
                const quantity = cartItem.CartItem ? cartItem.CartItem.quantity:0;
                return {productId:cartItem.id,quantity:quantity}
            })
            const order = await Order.create({userId})
            for(const item of orderItems){
                await OrderItem.create({orderId:order.id,...item})
            }
            return res.status(201).json({message: 'Order created successfully!!', order})
        }
        catch(error){
            return res.status(500).json({
                error: error
            })
        }
        
    
    }
    async getUserOrders(req,res){
        const UserId = req.user.id
        try{
            const orders = await Order.findAll({
                where:{userId},
                include:[
                    {
                        model:OrderItem,
                        include:[
                            {
                                model:Product,
                                attributes:['id','title']
                            }
                        ]
                    }
                ],
                order: [['createdAt','DESC']]
            })
            return res.status(200).json({orders})
        }
        catch(error){
            res.status(500).json({error:error})

        }
    }
}
module.exports = adminShopController();