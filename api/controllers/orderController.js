const mongoose = require('mongoose');
const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');

exports.getAllOrder = (req, res, next) => {
    Order.find()
        .select('quantity _id product')
        .populate('product', 'name _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.makeOrder = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                console.log(`this is a product ${product}`);
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            });

            return order.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Order Created ',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.getOrderById = (req, res, next) => {
    const id = req.params.id;

    Order.findById(id)
        .select('quantity _id product')
        .populate('product')
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                order: result,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.deleteOrder = (req, res, next) => {
    const orderId = req.params.id;

    Order.remove({_id: orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {productId: "ID", quantity: "Number"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};