const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const auth = require('./middleware/auth');
const bodyParser = require('body-parser');
const app = express();

//passport config

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('mongo db connected'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//application level middlewares
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
//Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/return',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
);
app.get(
  '/returnG',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
);

app.get('/profile', function(req, res) {
  res.render('profile', { user: req.user });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
