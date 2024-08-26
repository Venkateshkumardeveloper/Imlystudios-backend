const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/CustomerCon');
const userController= require('../Controllers/UserCon')
const storeController= require('../Controllers/StoreCon');
const { createOrder,updateOrder,getOrderById,deleteOrderById,getAllOrders } = require('../Controllers/ordercontroller');

//Routes for Customers
router.post('/createCustomer', customerController.createCustomer);
router.get('/getAllCustomers', customerController.getAllCustomers);
router.get('/getCustomerById/:id', customerController.getCustomerById); 
router.put('/updateCustomer/:id', customerController.updateCustomer); 
router.delete('/deleteCustomer/:id', customerController.deleteCustomer); 

//Routes for Address
// router.post('/createAddress', customerController.createCustomer);
// router.get('/getAllAddresses', customerController.getAllCustomers);
// router.get('/getAddressById/:id', customerController.getCustomerById); 
// router.put('/updateAddress/:id', customerController.updateCustomer); 
// router.delete('/deleteAddress/:id', customerController.deleteCustomer); 

//Routes for Users
router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById); 
router.put('/updateUser/:id', userController.updateUser); 
router.delete('/deleteUser/:id', userController.deleteUser);

//Routes for Stores
router.post('/createStore', storeController.createStore);
router.get('/getAllStores', storeController.getAllStores);
router.get('/getStoreById/:id', storeController.getStoreById); 
router.put('/updateStore/:id', storeController.updateStore); 
router.delete('/deleteStore/:id', storeController.deleteStore);

router.post('/createOrder', createOrder);
router.put('/updateOrder/:OrderID', updateOrder);
router.get('/getOrderById/:OrderID', getOrderById);
router.delete('/deleteOrderById/:OrderID', deleteOrderById);
router.get('/getAllOrders', getAllOrders);

module.exports = router;
