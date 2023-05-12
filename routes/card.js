const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');


const router = Router();

function mapCartItems (cart) {
    // console.log(cart.items[0]);
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
});

function calculatePrice(courses) {
    return courses.reduce((total, course) => {return total += course.price * course.count}, 0)
}

router.get('/', auth, async (req, res) => {
    console.log(req.session.user);
    const user = await req.user.populate([{path: 'cart.items.courseId', strictPopulate: false }]);
    const courses = mapCartItems(user.cart);

    res.render('card', {
        title: 'Cart',
        isCard: true,
        courses: courses,
        price: calculatePrice(courses)
    })
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate([{path: 'cart.items.courseId', strictPopulate: false }]);

    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: calculatePrice(courses)
    }
        res.status(200).json(cart);

})

module.exports = router;