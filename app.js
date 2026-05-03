const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Graceful Database Connection
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.log('WARNING: No MONGO_URI found. Running in "Demo Mode" without a database.');
}

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'mathworld_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/signin', (req, res) => res.render('signin'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/faq', (req, res) => res.render('faq'));

// Catch-all to prevent crashes on missing DB operations
app.use((req, res, next) => {
    if (!mongoose.connection.readyState && req.path.startsWith('/admin')) {
        return res.status(503).send('Database not connected. Admin features are unavailable in Demo Mode.');
    }
    next();
});

app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT);
});
