const Product = require('../../models/productModel');
const mongoose = require('mongoose');

exports.getAllProduct = (req, res, next) => {

    Product.find()
        .select('name price _id productImage')
        .then((result) => {
            const response = {
                count: result.length,
                Products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
};

exports.addProduct = (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then((result) => {
            res.status(201).json({
                message: "Created Products Successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
};

exports.getProductById = (req, res, next) => {
    const id = req.params.id;

    Product.findById(id)
        .select('name price _id productImage')
        .then((result) => {
            if (result) {
                res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                });
            } else {
                res.status(404).json({message: 'There is no ID that u are looking for'});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

exports.editProduct = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id: id}, {$set: updateOps})
        .then((result) => {
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;

    Product.remove({_id: id})
        .then((result) => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {name: 'String', price: 'Number'}
                }
            });
        })
        .catch((err) => {
            res.status(404).json(err);
        });
};