// Mongoose
const mongoose = require('mongoose');

// Hash password
const bcrypt = require('bcryptjs');

// Token
const jwt = require('jsonwebtoken');

// Error Message
const errorMessage = require('../constant/errorMessage.js');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		minlength: 6,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
	},
	age: {
		type: Number,
		min: 0,
		max: 150,
	},
	address: {
		type: String,
	},
	role: {
		type: String,
		required: true,
		enum: ['administrator', 'author'],
	},
	tokens: [{ token: { type: String, required: true } }],
});

// Reference Methods

// Generate Token
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

// Auto hide credentials field in returned data (auto execute)
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

// Model methods

// Find duplicate email or used username in register
userSchema.statics.findByCredentials = async (username, email) => {
	const user = await User.findOne({ username: username });
	if (user) {
		return errorMessage.DUPLICATE_USER;
	}

	const mail = await User.findOne({ email });
	if (mail) return errorMessage.DUPLICATE_EMAIL;

	return '';
};

// Find credencials for login
userSchema.statics.findByCredentialsForLogin = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error(errorMessage.WRONG_EMAIL);

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error(errorMessage.WRONG_PASSWORD);

	return user;
};

// Pre and post internal methods

// Hash password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

	next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
