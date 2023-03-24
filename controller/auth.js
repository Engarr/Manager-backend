const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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
