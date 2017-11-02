// required modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// load User model
require('./models/User');
// load Post model
require('./models/Post');
// passport config
require('./config/passport')(passport);
// load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const posts = require('./routes/posts');

// load keys
const keys = require('./config/keys');

// map global promise
mongoose.Promise = global.Promise;

// connect database via mongoose
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

// define app as express
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// public dir
app.use(express.static(path.join(__dirname, 'public')));

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// express session middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global user variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// use routes
app.use('/auth', auth);
app.use('/', index);
app.use('/posts', posts);
// define conditional port PROD || DEV
const port = process.env.PORT || 5000;



// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
