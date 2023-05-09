const express = require('express');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const path =require('path');
const mongoose = require('mongoose');
const handlebars = require("handlebars");
const User = require('./models/user');

const app = express();

const password = 'R1d2I0uyMPil3x5s';

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', exphbs.engine({
    hbs: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('64492a599f6125226b7dd9d7');
        req.user = user;
        next();
    } catch (e) {
        console.error(e);
    }
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const uri = `mongodb+srv://gerasymovych:${password}@cluster0.oqzfeho.mongodb.net/shop`;
        await mongoose.connect(uri, { useNewUrlParser: true });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User ({
                email: 'test@email.com',
                name: 'testUser',
                cart: {items:[]}
            })

            await user.save();
        }
        app.listen(PORT, () => {
            console.log('server is running on port ' + PORT);
        })
    } catch (e) {
        console.error(e);
    }
};

start();





