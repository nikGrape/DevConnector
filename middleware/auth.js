const jwt = require('jsonwebtoken');
const config = require('config');

/*
 ** @desc Gets token from header, verifys it and puts user.id in req
 */

module.exports = function (req, res, next) {
	// Get the token from the header
	const token = req.header('x-auth-token');

	// Check if not token
	if (!token) {
		return res.status(400).json({ msg: 'No token, authorization denied!' });
	}

	// Verify the token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		/*
		decoded.user is what we put in payload in users.js
		const payload = {
				user: {
					id: user.id,
				},
			};
		*/
		req.user = decoded.user; // so user here contains only id field
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};

// For more advanced authorization use middleware passport
