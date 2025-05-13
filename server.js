const express = require('express');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require("dotenv").config();

const client = new MongoClient(process.env.DATABASE_URL);
let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('dc-mongo');
    }
    return db;
}

connectDB()
    .then(() => console.log('MongoDB connected successfully via MongoClient'))
    .catch((err) => {
        console.error('MongoDB connection failed via MongoClient:', err);
        process.exit(1); // Optional
    });

const createUser = async (req, res) => {
    try {
        const db = await connectDB(); 
        console.log(req.body);
        const result = await db.collection('users').insertOne(req.body); 
        console.log(result)
        console.log(result.ops)
        const newUser = { ...req.body, _id: result.insertedId };
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const corsOptions = require('./configs/corsOptions');
const credentials = require('./middlewares/credentials');
// const dbConnect = require("./configs/dbConn");
const { log } = require('console');

const app = express();

// Connect to MongoDB
// dbConnect();

// Middleware setup
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Static files for images
app.use('/images', express.static('upload/images'));

// Simple test route
app.get('/data', (req, res) => {
    console.log('Data route accessed');
    res.json({ message: 'I got my data, Hello World!' });
});

// User routes
app.post('/create', createUser)
app.use('/user', require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Handle MongoDB connection success
// mongoose.connection.on('open', () => {
//     console.log('Connected to MongoDB');
//     app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);
//     });
// });

// Handle MongoDB connection error
// mongoose.connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

