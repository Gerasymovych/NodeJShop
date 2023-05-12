const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();


router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true,
    })
})

router.post('/', auth, async (req, res) => {
    // console.log(req.body);
    const {title, price, image} = req.body;
    const course = new Course({
        title: title,
        price: price,
        image: image,
        userId: req.user._id
    });

    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.error(e);
    }


})

module.exports = router;