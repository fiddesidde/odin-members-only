module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

module.exports.isMember = (req, res, next) => {
  if (req.user.tier === 'base') {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/users/upgrade');
  }
  next();
};
