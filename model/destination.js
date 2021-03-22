// Mongoose
const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
	code: {
		type: String,
		unique: true,
	},
	name: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		minlength: 1,
	},
	address: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
	},
	province: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'province',
	},
	priceRange: {
		minPrice: { type: Number, min: 0 },
		maxPrice: { type: Number, min: 0 },
	},
	introPara: {
		type: String,
		required: true,
		min: 10,
		max: 300,
	},
	content: {
		type: String,
		required: true,
		min: 10,
	},
	category: {
		purpose: {
			type: [String],
			enum: ['resort', 'eco', 'cultural and historical', 'visit and explore', 'otherP'],
		},
		geographical: { type: [String], enum: ['sea', 'mountain', 'picnic', 'countryside', 'other'] },
		ages: { type: [String], enum: ['youth', 'middle-age', 'aged'] },
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	embeddedMap: {
		type: String,
	},
	avatar: {
		type: Buffer,
	},
});

const Destination = mongoose.model('destination', destinationSchema);

module.exports = Destination;
