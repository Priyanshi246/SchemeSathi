const { orchestrateWorkflow } = require('../agents/orchestrator');
const db = require('../config/db');

/**
 * @desc    Execute multi-agent workflow on user prompt
 * @route   POST /api/agents/chat
 */
async function runOrchestrator(req, res) {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Please provide a message prompt" });
    }

    // Run the sequence of 6 agents
    const result = await orchestrateWorkflow(req.user.id, message, chatHistory || []);

    return res.json({
      success: true,
      message: "Autonomous Multi-Agent workflow completed successfully.",
      data: result
    });
  } catch (err) {
    console.error("Run Orchestrator Agent Error:", err);
    return res.status(500).json({ success: false, message: "Server error executing agents workflow" });
  }
}

/**
 * @desc    Get agent activity logs for the dashboard feed
 * @route   GET /api/agents/logs
 */
async function getAgentLogs(req, res) {
  try {
    const logs = await db.agentLogs.findByUserId(req.user.id);
    return res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    console.error("Fetch Agent Logs Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching agent logs" });
  }
}

module.exports = {
  runOrchestrator,
  getAgentLogs
};
