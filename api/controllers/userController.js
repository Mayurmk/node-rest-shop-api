const mongoose = require('mongoose');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const APIError = require('../../helper/APIError');
const httpStatus = require('http-status');

exports.userSignUp = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then((user) => {
            if (user.length >=1) {

                return Promise.reject(new APIError('Mail Exists', httpStatus.CONFLICT, true));

            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return Promise.reject(new APIError(`Error in converting hash password`, httpStatus.INTERNAL_SERVER_ERROR, true));
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'USer Created'
                                });
                            })
                            .catch((err) => {
                                return Promise.reject(new APIError('Error for creating a new User', httpStatus.INTERNAL_SERVER_ERROR, true));
                            });
                    }
                });
            }
        })
        .catch(err => {
            return res.status(err.status).json({
                error: {
                    message: err.message
                }
            });
        })
};

exports.userLogin = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {

                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });

                    return res.status(200).json({
                        message: 'Auth Successfull',
                        Token: token
                    });
                }

                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        })
};

exports.userRemove = (req, res, next) => {
    User.remove({ _id: req.params.userId})
        .exec()
        .then(result => {
            console.log('here === ', result);
            res.status(200).json({
                message: 'User Deleted..!!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
};