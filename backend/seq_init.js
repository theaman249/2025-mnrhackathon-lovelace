const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('genesis', process.env.PG_USER_NAME , process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: 5432
});

// Synchronize Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Synchronization error:', error);
});

module.exports = sequelize; 