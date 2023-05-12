const express = require('express');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
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
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const app = express();

const password = 'R1d2I0uyMPil3x5s';
const MONGODB_URI = `mongodb+srv://gerasymovych:${password}@cluster0.oqzfeho.mongodb.net/shop`;

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

const store = MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.engine('hbs', exphbs.engine({
    hbs: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session ({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(varMiddleware);
app.use(userMiddleware);
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);



const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
        app.listen(PORT, () => {
            console.log('server is running on port ' + PORT);
        })
    } catch (e) {
        console.error(e);
    }
};

start();





