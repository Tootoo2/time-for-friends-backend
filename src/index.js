const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const persons = require('./Person');
const data = require('./data');

app.use(cors());

mongoose.connect(`mongodb://localhost/timefriends`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', () => console.log('Error connecting to db'));

db.once('open', () => {
	console.log('connected to db');
	startWebServer();
});

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/people', (req, res) => {
	persons
		.find()
		.then(item => res.json(item))
		.catch(err => console.error(err));
});

const createData = () => {
	db.dropDatabase();
	persons.create(data);
};

const startWebServer = () => {
	createData();
	app.listen(3001, () => {
		console.log('App listening on port 3001');
	});
};
