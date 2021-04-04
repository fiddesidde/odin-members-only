const Message = require('../models/message');

module.exports.viewMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).populate('author');

    res.render('messages/view', { message });
  } catch (error) {
    next(error);
  }
};

module.exports.renderNewMessage = (req, res) => {
  res.render('messages/new');
};

module.exports.newMessage = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { title, content } = req.body;

    const msg = new Message({ title, content, author: id });
    await msg.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};
