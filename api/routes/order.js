const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orderController');

// Get all the order...
router.get('/', checkAuth, orderController.getAllOrder);

// Create New Order...
router.post('/', checkAuth, orderController.makeOrder);

// Get a single order...
router.get('/:id', checkAuth, orderController.getOrderById);

// Remove a single order...
router.delete('/:id', checkAuth, orderController.deleteOrder);

module.exports = router;