const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Message = require('../models/Message');

// Admin Login View
router.get('/login', (req, res) => res.render('admin/login'));

// Admin Dashboard View
router.get('/dashboard', async (req, res) => {
    const userCount = await User.countDocuments();
    const itemCount = await Item.countDocuments();
    const messages = await Message.find().sort({ createdAt: -1 }).limit(5);
    res.render('admin/dashboard', { userCount, itemCount, messages });
});

// Manage Users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('admin/users', { users });
});

// Manage Inventory
router.get('/inventory', async (req, res) => {
    const items = await Item.find();
    res.render('admin/inventory', { items });
});

router.post('/inventory/add', async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    await new Item({ name, category, price, stock, description }).save();
    res.redirect('/admin/inventory');
});

module.exports = router;
