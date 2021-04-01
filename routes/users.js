const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

router
  .route('/register')
  .get((req, res) => {
    res.render('users/register');
  })
  .post(async (req, res, next) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      console.log(firstname, lastname, email, password);

      const hash = await bcrypt.hash(password, 12);

      const user = new User({ email, hash, firstname, lastname, tier: 'base' });

      await user.save();

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  });

router
  .route('/login')
  .get((req, res) => {
    res.render('users/login');
  })
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: false,
    }),
    async (req, res) => {
      const redirectUrl = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    }
  );

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
