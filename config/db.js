const mongoose = require('mongoose');
const config = require('config');

const dbURI = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
		});
		console.log('MongoDB is connected!');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;
