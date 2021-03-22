// Require config to dotenv
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config/.env') });

// Express
const express = require('express');
const app = express();

// Req.body
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// Cross origin ...
const cors = require('cors');
app.use(cors());

// Require mongoose connection and database
require('./database/mongoose');

// Route
app.get('/', (req, res) => {
	res.send('HELLO WORLD!!!');
});

// Set User Route
const userRoute = require('./router/user.route.js');
app.use('/user', userRoute);

// Set Province Route
const provinceRoute = require('./router/province.route.js');
app.use('/province', provinceRoute);

// Set Destination route
const destinantionRoute = require('./router/destination.route.js');
app.use('/destination', destinantionRoute);

app.listen(process.env.PORT || 3000, () => {
	console.log("Server's up on port", process.env.PORT || 3000);
});
