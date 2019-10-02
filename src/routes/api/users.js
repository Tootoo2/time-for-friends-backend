const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');
const keys = require('../../config/keys');
const data = require('../../data.json');

router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ email: 'Email already exists' });
		} else {
			const userData = [...data];
			const userContacts = [];
			for (let i = 0; i < 20; i++) {
				let randomContact = Math.floor(Math.random() * userData.length);

				userContacts.push(userData[randomContact]);
				userData.splice(randomContact, 1);
			}

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
        password: req.body.password,
				contacts: userContacts,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
            .catch(err => console.error(err));
				});
			});
		}
	});
});

router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then(user => {
		if (!user) {
			return res.status(404).json({ emailnotfound: 'Email not found' });
		}

		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				const payload = {
					id: user.id,
					name: user.name,
					contacts: user.contacts,
				};

				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926,
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token,
						});
					},
				);
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: 'Password incorrect' });
			}
		});
	});
});

router.post('/add', async (req, res) => {
	let user = await User.findById(req.body.id);
	user.contacts.push(req.body.newContact);
	await user.save();
	res.json({ ok: true });
});

router.get('/getContacts/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (user) {
				return res.json(user);
			} else {
				return res.status(404).json({ error: 'user not defined' });
			}
		})
		.catch(err => res.status(404).json(err));
});

router.delete(`/delete/:id}`, (req, res) => {
  User.findById(req.params.id).then(user => {
    if(user){
      const updatedContacts = user.contacts.filter(user=> user.contacts.name.firstName!==req.body.name.firstName)
      return res.json(updatedContacts)
    }
  })
});

module.exports = router;
