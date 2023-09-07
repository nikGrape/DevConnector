const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route	GET api/users
// @desc	Creaate a new user
// @access	Public (do not need a token for access)

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email }); // same as {email: email}

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}
			// Get user gravatar
			const avatar = gravatar.url(email, {
				//for more info google: gravatar options
				s: '200', //size
				r: 'pg', //raiting g: 0+, gp: 13+, r: 18+, x: ...
				d: 'retro', // default if user do not have avatar mp gives an cartoon image
			});

			user = new User({
				name,
				email,
				password,
				avatar,
			});

			// Encript password
			const salt = await bcrypt.genSalt(10); //when bigger number when more secure but slow

			user.password = await bcrypt.hash(password, salt);

			// after save user object (above) will be updated to the one from mongo (with id and date)
			await user.save();

			console.log(user);

			// Return jsonwebtoken
			// payload is what we get from jwt.verify(token, secret)
			const payload = {
				user: {
					id: user.id, //user._id ( _ is not nessesry mongoose can do without it)
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 }, // TODO change to 3600(an hour)
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
		}
	}
);

module.exports = router;
