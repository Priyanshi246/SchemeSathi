const express = require('express');
const router = express.Router();
const { getDashboardStats, markNotificationRead } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getDashboardStats);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
