require('dotenv').config();

const express = require('express');
const path = require('path');
//const expressLayouts = require('express-ejs-layouts');

const app = express();

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Serve static files (like CSS) from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the templating engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(expressLayouts);
// app.set('layout', 'layout');

const viewRoutes = require('./routes/viewRoutes');
app.use('/', viewRoutes);

// MongoDB connection (Singleton pattern)
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
  try {
    const topics = await Topic.find().populate('subscribers', '_id');
    topics.forEach(topic => {
      topic.subscribers.forEach(user => {
        observer.subscribe(topic._id.toString(), user._id.toString());
      });
    });
    console.log('✅ Observer subscriptions initialized from DB');
  } catch (err) {
    console.error('❌ Failed to initialize observer:', err);
  }
})();

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
