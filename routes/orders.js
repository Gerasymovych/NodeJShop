const {Router} = require('express');
const Order = require('../models/order')
const auth = require('../middleware/auth');
const router = Router();

router.get ('/', auth, async (req, res) => {

    const orders = await Order.find({
        'user.userId': req.user._id
    }).populate([{ path: 'user.userId', strictPopulate: false }]).lean();

    res.render('orders', {
        isOrder: true,
        title: 'Orders',
        orders: orders.map(order => {
            let priceOrd = order.courses.reduce((total, course) => {
                total += course.count * course.course.price;
                return total;
            }, 0);
            return {
                ...order,
                price: priceOrd
            }
        })
    });
});


router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate([{path: 'cart.items.courseId', strictPopulate: false}]);

        const courses = user.cart.items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc}
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        });

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.error(e);
    }
})

module.exports = router;