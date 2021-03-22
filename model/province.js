// Mongoose
const mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
	code: {
		type: String,
		unique: true,
	},
	name: {
		type: String,
		required: true,
		lowercase: true,
		minlength: 1,
	},
	introPara: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		minlength: 10,
	},
	destination: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'destination',
		},
	],
});

// Reference Methods

const Province = mongoose.model('province', provinceSchema);

module.exports = Province;
