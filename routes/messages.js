const express = require('express');
const router = express.Router();

const Message = require('../models/message');

router.route('/:id').get(async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).populate('author');

    res.render('messages/view', { message });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
