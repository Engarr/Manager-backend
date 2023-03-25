const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).json({ errors: error.array() });
	}
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	try {
		const hasedPasswrod = await bcrypt.hash(password, 12);
		const user = new User({
			email: email,
			password: hasedPasswrod,
			name: name,
		});
		const result = await user.save();
		res
			.status(201)
			.json({ message: 'User has been created!', userId: result._id });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).json({ errors: error.array() });
	}
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('A user with this email could not be found.');
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;
		const isEqual = bcrypt.compare(password, user.password);

		if (!isEqual) {
			const error = new Error('Wrong password!');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '1h' }
		);

		res.status(200).json({ token: token, userId: loadedUser._id.toString() });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};
