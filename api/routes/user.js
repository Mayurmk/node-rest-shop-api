const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');

// Add a new User...
router.post('/signup', userController.userSignUp);

// Login the user...
router.post('/login', userController.userLogin);

// Remove the User By Id...
router.delete('/:userId', checkAuth, userController.userRemove);

module.exports = router;