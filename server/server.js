const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));



app.use('/api/auth', require('./routes/authRoutes'));


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;


connectDB();


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
