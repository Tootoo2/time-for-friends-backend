const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let personSchema = new Schema({
	name: {
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
	},
	phoneNumber: {
		type: String,
		match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{5,20}$/,
		required: true,
	},
	email: {
		type: String,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
		required: true,
	},
	location: {
		country: { type: String, required: true },
		city: { type: String, required: true },
		timeZone: { type: String, required: true },
	},
});

module.exports = mongoose.model('Person', personSchema);
