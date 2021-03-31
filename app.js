if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Message = require('./models/message');

const { isLoggedIn } = require('./middleware');

const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); // so you can render('index')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'membrnly',
    store: MongoStore.create({ mongoUrl: dbUrl, touchAfter: 24 * 3600 }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true, Uncomment when served over HTTPS
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, async (err, user) => {
      if (err) done(err);
      if (!user) done(null, false, { message: 'Incorrect username' });
      try {
        const result = await bcrypt.compare(password, user.hash);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        next(error);
      }

      //   return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => res.render('index'));

app.get('/login', (req, res) => {
  res.render('users/login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    console.log(req.session);

    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

app.get('/register', (req, res) => {
  res.render('users/register');
});

app.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 12);

    const user = new User({ username, hash });

    await user.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/messages', isLoggedIn, async (req, res, next) => {
  try {
    const messages = await Message.find({}).populate('author');
    res.render('messages/all_messages', { messages });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app listening on port ${port}!`));
