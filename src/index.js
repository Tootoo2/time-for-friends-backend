const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const persons = require('./models/Person');
const data = require('./data');
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

// app.get('/', (req, res) => {
// 	res.send('Hello World');
// });

// app.get('/api/people', (req, res) => {
// 	persons
// 		.find()
// 		.then(item => res.json(item))
// 		.catch(err => console.error(err));
// });

// app.post('/api/people/addcontact', (req, res) => {
// 	persons
// 		.create(req.body)
// 		.then(item => res.json(item))
// 		.catch(err => console.error(err));
// });

// app.delete('/api/people/:id', (req, res) => {
// 	persons
// 		.deleteOne({ _id: req.params.id })
// 		.then(item => res.json(item))
// 		.catch(err => console.error(err));
// });

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
