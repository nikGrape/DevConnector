const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route	GET api/auth
// @desc	Get user info by token
// @access	Private (uses auth with token, to verify the request)

router.get('/', auth, async (req, res) => {
	// auth is a middleware wich usese token to authorize request
	console.log(req.user);
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	POST api/auth
// @desc	Authenticate user & get token
// @access	Public

router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email }); // same as {email: email}

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User doesn't exists" }] }); // Invalid Credentials
			}

			// here password is what user typed in, user.password is encrypted one from database
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Invalid password' }] }); // Invalid Credentials
			}
			/*
			 **	it is a better practice to use the same message in case of user doesn't exist or password is wrong
			 **	because it is safer not to tell which one it is in case it is a hacker
			 */

			// Return jsonwebtoken
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
