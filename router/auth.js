const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controller/auth');

router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-mail address already exists!');
					}
				});
			})
			.normalizeEmail()
			.trim(),
		body('password', 'Password length has to be more than 5 characters')
			.trim()
			.isLength({ min: 5 }),
		body('repeatPassword', 'Passwords do not match.').custom(
			(value, { req }) => {
				if (value !== req.body.password) {
					return Promise.reject('Passwords has to be the same');
				}
				return true;
			}
		),
		body('name', `Name field can not be empty`).trim().not().isEmpty(),
	],
	authController.signup
);

router.post(
	'/login',
	[
		body('email', 'Please enter a valid email.')
			.isEmail()
			.normalizeEmail()
			.trim()
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (!userDoc) {
						return Promise.reject('User with this email does not exist');
					}
				});
			}),
		body('password', 'This field can not be empty').trim().not().isEmpty(),
	],
	authController.login
);

module.exports = router;
