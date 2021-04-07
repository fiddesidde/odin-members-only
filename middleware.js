const Message = require('./models/message');

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

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message.author.equals(req.user._id) && req.user.tier !== 'admin') {
    return res.redirect('/');
  }
  next();
};
