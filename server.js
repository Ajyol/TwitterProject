require('dotenv').config();
require('./utils/db');

const express = require('express');
const app = express();
app.use(express.json());

app.listen(3000, () => console.log("Check out http://localhost:3000"));