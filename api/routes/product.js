const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

let upload = multer({
    storage: storage,
    // fileFilter: function (request, file, cb) {
    //     if (file.mimeType === 'image/png' || file.mimeType === 'image/jpeg') {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //     }
    // },
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

// Get all the product...
router.get('/', productController.getAllProduct);

// Make a New Product...
router.post('/', checkAuth, upload.single('productImage'), productController.addProduct);

// Get a product By Id...
router.get('/:id', checkAuth, productController.getProductById);

// Edit specific product By Id...
router.patch('/:id', checkAuth, productController.editProduct);

// Delete a product By Id...
router.delete('/:id', checkAuth, productController.deleteProduct);


module.exports = router;