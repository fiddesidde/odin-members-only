const Message = require('../models/message');

module.exports.editMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).populate('author');

    res.render('messages/edit', { message });
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

    const msg = new Message({
      title,
      content,
      author: id,
      date_posted: new Date(),
    });
    await msg.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

module.exports.updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const newPost = { title, content };

    const updatedPost = await Message.findByIdAndUpdate(id, newPost);

    res.redirect(`/`);
  } catch (error) {
    next(error);
  }
};
