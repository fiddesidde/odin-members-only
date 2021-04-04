const express = require('express');
const passport = require('passport');
const router = express.Router();

const { isLoggedIn } = require('../middleware');

const users = require('../controllers/users');

router.route('/register').get(users.renderRegister).post(users.register);

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: false,
    }),
    users.login
  );

router.get('/logout', users.logout);

router
  .route('/upgrade')
  .get(isLoggedIn, users.renderUpgrade)
  .post(isLoggedIn, users.upgradeTier);

module.exports = router;