// Create web server
// Load the express module
const express = require('express');
// Create the server
const app = express();
// Load the body-parser module
const bodyParser = require('body-parser');
// Load the jsonwebtoken module
const jwt = require('jsonwebtoken');
// Load the mongoose module
const mongoose = require('mongoose');
// Load the Comment model
const Comment = require('./models/comment');
// Load the User model
const User = require('./models/user');
// Load the config file
const config = require('./config');
// Load the cors module
const cors = require('cors');
// Load the path module
const path = require('path');

// Connect to the database
mongoose.connect(config.database);
// Load the connection
let db = mongoose.connection;
// Check the connection
db.once('open', () => {
    console.log('Connected to the database');
});
// Check for database errors
db.on('error', (err) => {
    console.log(err);
});

// Set the port
let port = process.env.PORT || 8080;
// Set the secret
app.set('secret', config.secret);

// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the cors middleware
app.use(cors());
// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Create the router
let router = express.Router();

// Register the user
router.post('/register', (req, res) => {
    // Create a new user
    let user = new User();
    // Set the user's name
    user.name = req.body.name;
    // Set the user's email
    user.email = req.body.email;
    // Set the user's password
    user.password = req.body.password;
    // Save the user
    user.save((err) => {
        // Check for errors
        if (err) {
            // Check for duplicate entry
            if (err.code === 11000) {
                return res.json({ success: false, message: 'A user with that email already exists' });
            } else {
                return res.send(err);
            }
        }
        // Create a token
        let token = jwt.sign(user, app.get('secret'), {
            expiresIn: 1440 // 24 hours
        });
        // Send the token
        res.json({
            success: true,
            message: '
