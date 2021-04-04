const express = require('express');
const router = express.Router();

const { isLoggedIn, isMember } = require('../middleware');

const messages = require('../controllers/messages');

router
  .route('/new')
  .get(isLoggedIn, isMember, messages.renderNewMessage)
  .post(isLoggedIn, isMember, messages.newMessage);

router.route('/:id').get(isLoggedIn, isMember, messages.viewMessage);

module.exports = router;
