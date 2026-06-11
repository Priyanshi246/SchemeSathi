const express = require('express');
const router = express.Router();
const { runOrchestrator, getAgentLogs } = require('../controllers/agentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/chat', protect, runOrchestrator);
router.get('/logs', protect, getAgentLogs);

module.exports = router;
