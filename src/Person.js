const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let personSchema = new Schema({
	name: {
		firstName: String,
		lastName: String,
	},
	phoneNumber: String,
	email: String,
	location: {
		country: String,
		city: String,
		timeZone: String,
	},
});


module.exports = mongoose.model('Person', personSchema);
