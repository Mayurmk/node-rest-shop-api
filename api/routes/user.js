const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');
const Joi = require('joi');
const validate = require('express-validation');

const paramValidation = {
    signup: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.number().required()
        },
    },
};

// Add a new User...
router.route('/signup')
    .post(validate(paramValidation.signup), userController.userSignUp);

// Login the user...
router.post('/login', userController.userLogin);

// Remove the User By Id...
router.delete('/:userId', checkAuth, userController.userRemove);

module.exports = router;