// Import required modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Initialize express app
var app = express();

// Load env and set PORT
dotenv.config({ path: './secrets.env' });
const PORT = process.env.PORT;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Passport config
require('./config/passport')(passport);

// Middleware
app.use(cors({ credentials: true, origin: process.env.FRONTEND }));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.PASSPORT_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Frontend site
const rootPath = __dirname;
app.use(express.static(rootPath + '/frontend'));
app.get('*', (req, res) => res.sendFile(rootPath + '/frontend/index.html'));

// Start server
app.listen(PORT, console.log(`Server started on port ${PORT}`));
