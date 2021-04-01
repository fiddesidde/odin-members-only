const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
