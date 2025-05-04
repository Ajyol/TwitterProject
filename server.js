require('dotenv').config();
require('./utils/db');

const express = require('express');
const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const topicRoutes = require('./routes/topicRoutes');
app.use('/api/topics', topicRoutes);

app.listen(3000, () => console.log("Check out http://localhost:3000"));
