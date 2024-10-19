const express = require('express');
const router = express.Router()
const AdminShopController = require('../controllers/admin/shop')

router.get('/cart',(req,res) => AdminShopController.getCart(req,res))
router.post('/cart/add',(req,res)=>AdminShopController.addItemtoCart(req,res))
router.post('/order/create', (req, res) => AdminShopController.createOrder(req, res)); // Create order
router.get('/order/userorders', (req, res) => AdminShopController.getUserOrders(req, res)); // Get user orders

module.exports = router