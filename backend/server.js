const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const auth = require('./src/routes/auth');
const courses = require('./src/routes/course')
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('SaaS LMS API is running...');
});

// Routes will be mounted here
app.use('/api',auth );
app.use('/api/courses', courses);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
