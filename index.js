const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

const productAdminRoutes = require('./routes/admin/products');
app.use('/admin',productAdminRoutes);

const productRoutes = require('./routes/products');
app.use(productRoutes);

const sequelize = require('./util/db');
const models = require('./models/index');
sequelize.models = models;
sequelize.sync().then(()=>{
    console.log('Connection has been established successfully');
})
.catch((error)=>{
    console.error('Unable to connect to the database: ', error);
})
app.get('/',(req,res)=> {
    res.json({message:'web shop app'})
})
app.listen(3026);