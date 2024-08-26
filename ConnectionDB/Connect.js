require('dotenv').config();

const { Sequelize } = require('sequelize');

 
const sequelize = new Sequelize(
   {
  dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  logging: false, 
//   dialectOptions: {
//     ssl: {
//         require: true,
//         rejectUnauthorized: false 
//     }
//  }
  
});
 
// Import models
const CustomerModel = require('../Models/Customer')(sequelize);
const AddressModel= require('../Models/Address')(sequelize);
const UserModel= require('../Models/User')(sequelize);
const StoreModel= require('../Models/Store')(sequelize);
const Orders= require('../Models/order')(sequelize);

// Associations
// CustomerModel.belongsTo(AddressModel, { foreignKey: 'AddressID' });
// Orders.belongsTo(CustomerModel, { foreignKey: 'CustomerID' });
// Orders.belongsTo(AddressModel, { foreignKey: 'AddressID' });
UserModel.belongsTo(AddressModel, { foreignKey: 'AddressID', allowNull: true });
CustomerModel.belongsTo(AddressModel, { foreignKey: 'AddressID' });
Orders.belongsTo(CustomerModel, { foreignKey: 'CustomerID' });
Orders.belongsTo(AddressModel, { foreignKey: 'AddressID' });


// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  // Sync models
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { sequelize, CustomerModel,AddressModel,UserModel,StoreModel,Orders};