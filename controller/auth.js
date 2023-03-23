const User = require('../models/user');

exports.signup = async (req, res, next) => {
	console.log(req.body);
	res.json({ status: 200 });
};
