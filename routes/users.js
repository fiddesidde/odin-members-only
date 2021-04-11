const express = require('express');
const passport = require('passport');
const router = express.Router();

const { isLoggedIn } = require('../middleware');

const { validateSignup } = require('../utils/validation');

const users = require('../controllers/users');

router
  .route('/register')
  .get(users.renderRegister)
  .post(validateSignup, users.register);

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    users.login
  );

router.get('/logout', users.logout);

router
  .route('/upgrade')
  .get(isLoggedIn, users.renderUpgrade)
  .post(isLoggedIn, users.upgradeTier);

module.exports = router;
