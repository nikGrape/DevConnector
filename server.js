const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 4900;
const app = express();
connectDB();

// add middleware to have access to req.body
// like bodyParser but built in
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (_, res) => {
	res.send('API is running');
});

app.use('/api/users', require('./routs/api/users'));
app.use('/api/posts', require('./routs/api/posts'));
app.use('/api/profile', require('./routs/api/profile'));
app.use('/api/auth', require('./routs/api/auth'));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
