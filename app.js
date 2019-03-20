const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Error handling controller
const errorController = require('./controllers/error');

// User Model
const User = require('./models/user');

const app = express();

// Views
app.set('view engine', 'ejs');
app.set('views', 'views');

// Route paths
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Find user 
// Change this after setting up authentication
app.use((req, res, next) => {
  User.findById('5c8d1c0f5573936a2cc784fe')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://jdaake:KIsMYluCDtG8RnPi@cluster0-ndib1.mongodb.net/shop?retryWrites=true')
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