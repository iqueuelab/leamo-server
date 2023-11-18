const express = require('express');
const cors = require("cors");
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./modules/User');

// Initializing Node Server
const app = express();
app.use(cors());

// Connect database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ message: 'API Running' }));

// Defined API Routes
app.use('/user', async (req,res) => {
  const users = await User.find({ role: 'Admin' });
  return res.status(200).send(users);
})
app.use('/api/login', require('./api/login'));
app.use('/api/organisation', require('./api/organisation'));
app.use('/api/user', require('./api/user'));
// app.use('/api/userRole', require('./api/userRole'));
app.use('/api/course', require('./api/course'));

const port = process.env.PORT || 3001;

app.listen(port, () => `Server running on port ${port}`);
