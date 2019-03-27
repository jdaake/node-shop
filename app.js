const path = require('path');
// express framework
const express = require('express');
// body parser
const bodyParser = require('body-parser');
// database mongo w/ mongoose
const mongoose = require('mongoose');
// express session
const session = require('express-session');
// session store for mongoDB
const MongoDBStore = require('connect-mongodb-session')(session);
// Cross Site Request Forgery (CSRF) Token
const csrf = require('csurf');
// Login/Signup auth handling
const flash = require('connect-flash');
// Error handling controller
const errorController = require('./controllers/error');
// User Model
const User = require('./models/user');
// mongo DB URI
const MONGODB_URI = 'mongodb+srv://jdaake:KIsMYluCDtG8RnPi@cluster0-ndib1.mongodb.net/shop';
// invoke express
const app = express();

// Store session key
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

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

// path to directory
app.use(express.static(path.join(__dirname, 'public')));

// set session collection object
app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// csrf token
app.use(csrfProtection);

// connect-flash
app.use(flash());

// Find user 
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// sets authentication and csrf token globally
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// 404
app.use(errorController.get404);

// connect to mongoDB
mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));