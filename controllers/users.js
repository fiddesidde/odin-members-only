if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const hash = await bcrypt.hash(password, 12);

    const user = new User({ email, hash, firstname, lastname, tier: 'base' });

    await user.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  req.flash('success', `Welcome back ${req.user.firstname}`);
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports.renderUpgrade = (req, res) => {
  res.render('users/upgrade');
};

module.exports.upgradeTier = async (req, res, next) => {
  const { id, email, firstname, lastname } = req.user;
  const passphrase = req.body.passphrase;
  if (
    passphrase !== process.env.MEMBER_PASSPHRASE &&
    passphrase !== process.env.ADMIN_PASSPHRASE
  ) {
    req.flash('error', 'Wrong passphrase');
    return res.redirect('/upgrade');
  }
  const user = { id, email, firstname, lastname };
  if (passphrase === process.env.MEMBER_PASSPHRASE) {
    user.tier = 'member';
    req.flash('success', 'You are now in Tier Member');
  } else {
    req.flash('success', 'You are now in Tier Admin');
    user.tier = 'admin';
  }

  await User.findByIdAndUpdate(id, user);

  res.redirect('/');
};
