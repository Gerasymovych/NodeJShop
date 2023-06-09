const {Router} = require('express');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const {registerValidators} = require('../utils/validators')

const keys = require('../keys')
const bcrypt = require('bcryptjs');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

const router = Router();
const transporter = nodemailer.createTransport(sendgrid({
    auth:{api_key: keys.SENDGRID_API}
}))

router.get('/login', async (req, res) => {
    // const csrfToken = req.csrfToken();
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                console.log(req.session.user);
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {

                        res.redirect('/');
                    }
                });
            } else {
                req.flash('loginError', 'Wrong password');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User with such email doesn\`t exist');
            res.redirect('/auth/login#login');
        }

    } catch (e) {
        console.error(e);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body;


        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, name, password: hashPassword, cart: { items:[] } });
        await user.save();

        res.redirect('/auth/login#login');
        await transporter.sendMail(regEmail(email));
    } catch (e) {
        console.error(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Password reset',
        error: req.flash('error')
    });
});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong, try ones again');
                return res.redirect('/auth/reset');
            }

            const token = buffer.toString('hex');
            const candidate = await User.findOne({email: req.body.email});

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 3600 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'Such email doesn\`t exists');
                return res.redirect('/auth/reset');
            }
        })
    } catch (e) {
    }
})

module.exports = router;