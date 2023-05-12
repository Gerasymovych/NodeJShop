const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })

});

router.post('/login', async (req, res) => {
    const user = await User.findById('64492a599f6125226b7dd9d7');

    req.session.user = user;
    req.session.isAuthenticated = true;
    console.log(req.session.user);
    req.session.save(err => {
        if (err) {
            throw err
        } else {

            res.redirect('/');
        }
    })
})

module.exports = router;