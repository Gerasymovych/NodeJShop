const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Incorrect email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject("This email already exists in our database");
                }
            } catch (e) {
                console.error(e)
            }
    }).normalizeEmail(),
    body('password')
        .isLength({min: 6, max: 18}).withMessage('Incorrect password length (6-18 characters)')
        .isAlphanumeric().withMessage('Only letters and numbers are allowed for password')
        .trim(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords mismatch")
        }
        return true;
    }).trim(),

]