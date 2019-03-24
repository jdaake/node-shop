const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// database mongo w/ mongoose
const mongoose = require('mongoose');
// express session
const session = require('express-session');
// session store for mongoDB
const MongoDBStore = require('connect-mongodb-session')(session);
// Error handling controller
const errorController = require('./controllers/error');
// User Model
const User = require('./models/user');
// mongo DB URI
const MONGODB_URI = 'mongodb+srv://jdaake:KIsMYluCDtG8RnPi@cluster0-ndib1.mongodb.net/shop';
// express
const app = express();

// Store session key
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

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

// use routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// 404
app.use(errorController.get404);

// connect to mongoDB
mongoose.connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      // create user if none exist
      if (!user) {
        const user = new User({
          name: 'Jordan',
          email: 'daakejl@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  }).catch(err => console.log(err));