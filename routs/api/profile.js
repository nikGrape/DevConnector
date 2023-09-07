const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route	GET api/profile/me
// @desc	Get current user's profile
// @access	Private

router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar']);
		/*
		 ** here we add to the profile object
		 ** fields from user collection wich will be found by id
		 ** populate(from_what_collection, [fields of the collection])
		 ** populate населить
		 */

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

// @route	POST api/profile
// @desc	Create or update user profile
// @access	Private

router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			skills,
			status,
			company,
			website,
			location,
			bio,
			githubusername,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		// Buid profile object

		const profileFields = {
			user: req.user.id,
			status,
			skills: skills.split(',').map((skill) => skill.trim()),
		};
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (githubusername) profileFields.githubusername = githubusername;

		//Build social object
		profileFields.social = social = {};
		if (youtube) social.youtube = youtube;
		if (facebook) social.facebook = facebook;
		if (twitter) social.twitter = twitter;
		if (instagram) social.instagram = instagram;
		if (linkedin) social.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			// if there is a profile we will update it
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id }, //find by ID
					{ $set: profileFields }, //update to profileFields
					{ new: true } // by default return old document, true here means return new one
				);

				return res.json(profile);
			}
			// else we will create it
			profile = new Profile(profileFields);

			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route	GET api/profile
// @desc	Get all profiles
// @access	Public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	GET api/profile/user/:user_id
// @desc	Get prifile by user ID
// @access	Public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) return res.status(400).json({ msg: 'Profile not found' });
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found: ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	DELETE api/profile
// @desc	Delete current user profile
// @access	Private uses auth to get and check token

router.delete('/', auth, async (req, res) => {
	try {
		//Remove user posts
		await Post.deleteMany({ user: req.user.id });
		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: `User with id: ${req.user.id} is deleted` });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	PUT api/profile/experience
// @desc	Add profile experience (one at a time)
// @access	Private

router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route	DELETE api/profile/experience/:exp_id
// @desc	Delete experience from profile (one at a time)
// @access	Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	PUT api/profile/education
// @desc	Add profile education (one at a time)
// @access	Private

router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('fieldofstudy', 'field Of Study is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route	DELETE api/profile/education/:edu_id
// @desc	Delete education from profile (one at a time)
// @access	Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
