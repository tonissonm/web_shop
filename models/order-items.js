const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const orderItems = sequelize.define('orderitems', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true   
    },
    quantity: Sequelize.INTEGER
});

module.exports = orderItems;