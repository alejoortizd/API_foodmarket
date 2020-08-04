const express = require('express');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const override = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary');
const { config } = require('./config');
const helmet = require('helmet');

// Controllers
const navRouter = require('./routes/indexRoutes');
const productRouter = require('./routes/productsRoutes')
const productsApiRouter = require('./routes/api/products');
const userRouter = require('./routes/usersRoutes');

// Initialization
const app = express();
require('./config/passport');

// Settings
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloud_api_key,
    api_secret: config.cloud_api_secret
})
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
// app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(override('_method'));
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/upload'),
    filename: (req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
app.use(multer({ storage }).single('image'));

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.dev = config.dev;
    next();
})

// Routes
app.use('/', navRouter);
app.use('/api/products', productsApiRouter);
app.use('/', productRouter)
app.use('/', userRouter);

// Redirect
// app.get('/', (req, res) => {
//     res.redirect('/api/products')
// })

// Static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
