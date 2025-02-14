const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// ...existing code...

// Get all buses with optional filtering
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.route) {
            query.route = req.query.route;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        const buses = await Bus.find(query);
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ...existing code...

module.exports = router;
