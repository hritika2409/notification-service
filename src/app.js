const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
