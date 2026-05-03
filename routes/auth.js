const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign Up POST
router.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    
    // Name Filter: Alphanumeric only
    if (!/^[a-zA-Z0-0 ]+$/.test(name)) {
        return res.status(400).send('Name must be alphanumeric.');
    }

    // Password Filter: 8-16 chars, 1 special char
    const passRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passRegex.test(password)) {
        return res.status(400).send('Password must be 8-16 chars with at least one special character.');
    }

    try {
        const newUser = new User({ name, password }); // In production, hash this!
        await newUser.save();
        res.redirect('/signin?success=true');
    } catch (err) {
        res.status(500).send('Error saving user.');
    }
});

module.exports = router;
