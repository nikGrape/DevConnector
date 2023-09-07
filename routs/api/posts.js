const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { get } = require('./users');

// @route	POST api/posts
// @desc	Create a post
// @access	Private

router.post(
	'/',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
			});

			await newPost.save();
			res.json(newPost);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route	GET api/posts
// @desc	Get all posts
// @access	Private

router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	GET api/posts/user/:user_id
// @desc	Get all posts of a user by his ID
// @access	Private

router.get('/user/:user_id', auth, async (req, res) => {
	try {
		const posts = await Post.find({ user: req.params.user_id }).sort({
			date: -1,
		}); //sort by date from most recent

		if (posts.length == 0) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ msg: 'Post not found, user ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	GET api/posts/:id
// @desc	Get all posts
// @access	Private

router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found, ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	DELETE api/posts/:id
// @desc	Delete a post by it's ID
// @access	Private

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.json({ msg: 'Post not found' });
		}

		// Check if the post belongs to the logged in user
		if (!post.user.equals(req.user.id)) {
			return res
				.status(401)
				.json({ msg: 'Access denied, user is not authorized' });
		}

		await post.remove();
		res.json({ msg: `The post: "${post.text}" was deleted!` });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found, ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	PUT api/posts/like/:id
// @desc	Like a post by post ID
// @access	Private

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.json({ msg: 'Post not found' });
		}

		//Check if the post has already been liked by the user

		if (post.likes.some((user) => user.user.equals(req.user.id))) {
			return res.status(400).json({ msg: 'the post has already been liked' });
		}

		post.likes.unshift({ user: req.user.id });
		await post.save();
		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found, ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	PUT api/posts/unlike/:id
// @desc	Like a post by post ID
// @access	Private

router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.json({ msg: 'Post not found' });
		}

		//Check if the post hasn't been liked by the user yet

		if (!post.likes.some((like) => like.user.equals(req.user.id))) {
			return res.status(400).json({ msg: "the post hasn't been liked yet" });
		}

		post.likes = post.likes.filter((like) => !like.user.equals(req.user.id));
		await post.save();
		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found, ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

// @route	POST api/posts/comment/:id
// @desc	Comment a post by post ID
// @access	Private

router.post(
	'/comment/:id',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newComment = {
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
			};

			post.comments.unshift(newComment);

			await post.save();

			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Post not found, ID is invalid' });
			}
			res.status(500).send('Server Error');
		}
	}
);

// @route	DELETE api/posts/:post_id/comment/:comment_id
// @in video api/posts/comment/:id/:comment_id
// @desc	Delete a comment af a post
// @access	Private

router.delete('/:post_id/comment/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.json({ msg: 'Post not found' });
		}

		//Check if the comment owner trys to delete it
		const comment = post.comments.find((item) =>
			item._id.equals(req.params.comment_id)
		);
		if (!comment) {
			return res.status(404).json({ msg: "Comment doesn't exist" });
		}
		if (!comment.user.equals(req.user.id)) {
			return res.status(401).json({ msg: 'Access denied' });
		}

		// Remove the comment
		post.comments = post.comments.filter((cmnt) => cmnt != comment);

		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found, ID is invalid' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
