const { body, validationResult } = require('express-validator');

module.exports.validateSignup = [
  body('email').isEmail().normalizeEmail(),

  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long')
    .escape(),

  body('firstname')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),

  body('lastname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),

  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = errors.array();
      err.message = 'Validation Error';
      return next(err);
    }
    next();
  },
];
