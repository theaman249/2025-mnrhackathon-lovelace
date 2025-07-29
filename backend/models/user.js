const { DataTypes } = require('sequelize');
const sequelize = require('../seq_init'); // Assuming db.js exports the Sequelize instance


const user = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = user;