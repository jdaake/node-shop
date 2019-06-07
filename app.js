const path = require('path');
// express framework
const express = require('express');
// file system
const fs = require('fs');
// body parser
const bodyParser = require('body-parser');
// https
const https = require('https');
// multer
const multer = require('multer');
// database mongo w/ mongoose
const mongoose = require('mongoose');
// express session
const session = require('express-session');
// session store for mongoDB
const MongoDBStore = require('connect-mongodb-session')(session);
// Cross Site Request Forgery (CSRF) Token
const csrf = require('csurf');
// Login/Signup auth error handling
const flash = require('connect-flash');
// Error controller
const errorController = require('./controllers/error');
// Shop controller
const shopController = require('./controllers/shop');
// isAuth middleware
const isAuth = require('./middleware/is-Auth');
// User Model
const User = require('./models/user');
// mongo DB URI
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ndib1.mongodb.net/${process.env.MONGO_DATABASE}`;
// invoke express
const app = express();
// Helmet secure headers
const helmet = require('helmet');
// compression
const compression = require('compression');
// morgan loggin
const morgan = require('morgan');
// Store session key
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Views
app.set('view engine', 'ejs');
app.set('views', 'views');

// Route files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single('image')
);

// path to directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// set session collection object
app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// connect-flash
app.use(flash());

// sets authentication
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

// Find user 
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// post order
app.post('/create-order', isAuth, shopController.postOrder);

// csrf token
app.use(csrfProtection);
// setting csrf token
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// helmet 
app.use(helmet());
// compression
app.use(compression());
// morgan
app.use(morgan('combined', {
  stream: accessLog
}));

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// 404
app.use(errorController.get404);
// 500
app.get('/500', errorController.get500);
// Global error handling middleware
app.use((error, req, res, next) => {
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

// connect to mongoDB
mongoose.connect(MONGODB_URI)
  .then(result => {
    // https
    //   .createServer({
    //     key: privateKey,
    //     cert: certificate
    //   }, app)
    app.listen(process.env.PORT || 3000);
    console.log(`App is listening on port ${process.env.PORT}`);
  })
  .catch(err => console.log(err));