const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let personSchema = new Schema({
	name: {
		firstName: String,
		lastName: String,
	},
	phoneNumber: String,
	mail: String,
	location: {
		country: String,
		city: String,
		timezone: String,
	},
});


module.exports = mongoose.model('Person', personSchema);
