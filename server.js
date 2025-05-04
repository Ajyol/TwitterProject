require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

const db = require('./utils/db');
db._connect(process.env.MONGO_URI);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const topicRoutes = require('./routes/topicRoutes');
app.use('/api/topics', topicRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

const observer = require('./services/observer');
const Topic = require('./models/Topic');
(async () => {
    const topics = await Topic.find();
    observer.initializeFromDB(topics);
})();

app.listen(3000, () => console.log("Check out http://localhost:3000"));
