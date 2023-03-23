const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./router/auth');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/auth', authRoutes);

mongoose
	.connect(
		`mongodb+srv://Lukasz:${process.env.MONGOOSE_PASS}@cluster0.k4a8s6m.mongodb.net/manager?retryWrites=true`
	)
	.then((result) => {
		app.listen(8080);
		console.log('server running');
	})
	.catch((err) => {
		console.log(err);
	});
