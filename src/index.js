const express = require('express');
const app = express();
const mongoose = require('mongoose');
const persons = require('./Person');

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

function startWebServer() {
  db.dropDatabase();
	app.listen(3000, () => {
    console.log('App listening on port 3000');
	});
}
