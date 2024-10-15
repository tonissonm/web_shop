const Product = require('../models/product');
class productController {
    async getAllProducts(req,res){
        const products = await Product.findAll();
        console.log(products);
        res.status(201).json({
            products:products
        })
    }
    async getProductById(req,res){
        
        const product = await Product.findOne({
            where: {
                id: req.params.id
            },
        }).then(product => {
            console.log(product);
            return res.status(200).json({product});
        })
        .catch(error=>{
            return res.status(500).send(error.message);
        })
    }
}
module.exports = new productController();