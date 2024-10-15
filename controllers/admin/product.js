const Product = require('../../models/product');
class adminController  {
    async addProduct(req,res) {
        console.log(req.body);
        const product = await Product.create({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            userId: req.user.id
        })
        res.status(201).json({
            message: 'Product is added',
            productId: product.id
        })
    }
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
    async editProduct(req,res){
        const {id} = req.params;
        console.log("ID: " +id);
        try {
            const { title, price, imageUrl, description, updatedAt } = req.body;
            const updatedProduct = await Product.update({
                title: title,
                price: price,
                imageUrl: imageUrl,
                description: description,
                updatedAt: updatedAt 
            }, {
                where: { id: id }
            });
            if (updatedProduct[0] === 0) {
                return res.status(404).json({ message: 'Product not found or no changes were made' });
            }

            return res.status(200).json({ message: 'Product edited successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async deleteProduct (req,res){
        const {id} = req.params;
        try{
            const product = await Product.findByPk(id);
            if(!product){
                return res.status(404).json({message:'Product not found'});
            }
            await product.destroy();
            return res.status(200).json({message: "Product has been deleted."});
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }  
}
module.exports = new adminController();