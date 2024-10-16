const express = require('express');
const router = express.Router()
const AdminShopController = require('../controllers/admin/shop')

router.get('/cart',(req,res) => AdminShopController.getCart(req,res))
router.post('/cart/add',(req,res)=>AdminShopController.addItemtoCart(req,res))
module.exports = router