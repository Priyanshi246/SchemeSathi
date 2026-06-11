const db = require('../config/db');

/**
 * @desc    Get all dashboard statistics and widget configurations
 * @route   GET /api/dashboard
 */
async function getDashboardStats(req, res) {
  try {
    const userId = req.user.id;

    // 1. Get profile
    const user = await db.users.findById(userId);

    // 2. Get eligible schemes count
    const matches = await db.eligibilityResults.findByUserId(userId);
    const eligibleCount = matches.length;

    // 3. Get roadmaps to compute Application Readiness Score
    const roadmaps = await db.roadmaps.findByUserId(userId);
    let avgReadiness = 0;
    if (roadmaps.length > 0) {
      const sum = roadmaps.reduce((acc, curr) => acc + curr.percentage, 0);
      avgReadiness = Math.round(sum / roadmaps.length);
    }

    // 4. Compute AI Opportunity Score (based on matches & life events)
    // Formula: basic score (40) + matches weight. Max 100.
    const opportunityScore = Math.min(100, 40 + (eligibleCount * 8));

    // 5. Get recent life event future recommendations
    const recommendations = await db.recommendations.findByUserId(userId);

    // 6. Get document wallet status
    const documents = await db.documents.findByUserId(userId);
    const uploadedDocs = documents.map(d => d.type);

    // 7. Get notifications
    const notifications = await db.notifications.findByUserId(userId);

    // 8. Get recent agent activity logs
    const logs = await db.agentLogs.findByUserId(userId);

    // 9. Get Citizen Digital Twin lifecycle data
    const lifeEvent = await db.lifeEvents.findByUserId(userId);
    
    // Default Digital Twin lifecycle stages structure
    const defaultTimeline = {
      current_stage: user.occupation || "Student",
      future_stage: lifeEvent?.history?.future_stage || "Graduate / Job Seeker",
      timeline: [
        { stage: "Student", active: user.occupation?.toLowerCase() === "student", unlockedSchemes: ["Central Sector Scholarship", "PM Vidyalaxmi Scheme"] },
        { stage: "Graduate", active: false, unlockedSchemes: ["PM Kaushal Vikas Yojana"] },
        { stage: "Job Seeker", active: user.occupation?.toLowerCase() === "job seeker", unlockedSchemes: ["DDU-GKY Scheme"] },
        { stage: "Entrepreneur", active: user.occupation?.toLowerCase() === "entrepreneur" || user.occupation?.toLowerCase() === "founder", unlockedSchemes: ["PM Mudra Loan", "Startup India Seed Fund"] },
        { stage: "Business Owner", active: user.occupation?.toLowerCase() === "business owner", unlockedSchemes: ["CGTMSE Scheme"] }
      ]
    };

    if (lifeEvent) {
      const current = lifeEvent.current_stage;
      // Mark timeline active flags based on current stage
      defaultTimeline.current_stage = current;
      defaultTimeline.timeline.forEach(t => {
        t.active = t.stage.toLowerCase() === current.toLowerCase();
      });
    }

    return res.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          income: user.income,
          state: user.state,
          education: user.education,
          occupation: user.occupation
        },
        metrics: {
          eligibleSchemesCount: eligibleCount,
          applicationReadinessScore: avgReadiness || 0,
          opportunityScore: opportunityScore || 40
        },
        recentRecommendations: recommendations.slice(0, 3),
        walletSummary: {
          uploadedCount: documents.length,
          uploadedTypes: uploadedDocs
        },
        notifications: notifications.slice(0, 5),
        agentActivityFeed: logs.slice(0, 10),
        digitalTwin: defaultTimeline
      }
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({ success: false, message: "Server error compiling dashboard statistics" });
  }
}

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/dashboard/notifications/:id/read
 */
async function markNotificationRead(req, res) {
  try {
    await db.notifications.markAsRead(req.params.id);
    return res.json({
      success: true,
      message: "Notification marked as read."
    });
  } catch (err) {
    console.error("Notification Read Error:", err);
    return res.status(500).json({ success: false, message: "Server error modifying notification status" });
  }
}

module.exports = {
  getDashboardStats,
  markNotificationRead
};
