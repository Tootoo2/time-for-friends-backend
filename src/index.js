const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);

app.use(express.json());
app.use(cors());

const dbAddress = require('./config/keys').mongoURI;

mongoose.connect(dbAddress, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);

const db = mongoose.connection;

db.on('error', () => console.log('Error connecting to db'));

db.once('open', () => {
	console.log('connected to db');
	startWebServer();
});

const startWebServer = () => {
	app.listen(3001, () => {
		console.log('App listening on port 3001');
	});
};
