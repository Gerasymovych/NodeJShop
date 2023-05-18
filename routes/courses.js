const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const timers = require("timers");

const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find().lean()
        .populate('userId', 'email name');
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        userId: req.user ? req.user._id.toString() : null,
        courses
    });
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    const course = await Course.findById(req.params.id).lean();

    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses');
    }

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean();
    console.log(course);
    res.render('course', {
        layout: 'empty',
        title: `Course: ${course.title}`,
        course
    });
});

router.post('/edit', auth, async (req, res) => {
    // const {id} = req.body;
    // delete req.body.id;
    await Course.findByIdAndUpdate(req.body.id, req.body).lean();
    res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.body.id });
        res.redirect('/courses');
    } catch (e) {
        console.error(e);
    }
});



module.exports = router;