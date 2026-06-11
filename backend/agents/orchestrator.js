const runProfilerAgent = require('./profiler');
const runEligibilityAgent = require('./eligibility');
const runExplainabilityAgent = require('./explainability');
const runDocumentAgent = require('./document');
const runRoadmapAgent = require('./roadmap');
const runLifeEventAgent = require('./lifeEvent');
const db = require('../config/db');

/**
 * Multi-Agent Orchestrator
 * Sequentially runs Agent 1 through Agent 6 and records progress in DB logs.
 */
async function orchestrateWorkflow(userId, userInput, chatHistory = []) {
  console.log(`Orchestrator: Initializing workflow for User ${userId}`);
  const activityLogs = [];

  const logActivity = async (agentName, text) => {
    const logMsg = `[${agentName}] ${text}`;
    activityLogs.push({ agent_name: agentName, log_text: text, timestamp: new Date().toISOString() });
    await db.agentLogs.create({
      user_id: userId,
      agent_name: agentName,
      log_text: text
    });
    console.log(`Workflow Log: ${logMsg}`);
  };

  // 1. Run Profiler Agent
  await logActivity("Citizen Profiling Agent", "Analyzing user prompt to extract demographic profile...");
  const profile = await runProfilerAgent(userInput, chatHistory);
  await logActivity("Citizen Profiling Agent", `Extracted details -> Age: ${profile.age || 'N/A'}, Gender: ${profile.gender || 'N/A'}, State: ${profile.state || 'N/A'}, Income: ${profile.income ? '₹' + profile.income : 'N/A'}, Occupation: ${profile.occupation || 'N/A'}, Education: ${profile.education || 'N/A'}`);

  // Update user profile in database
  const user = await db.users.findById(userId);
  if (user) {
    await db.users.update(userId, {
      age: profile.age !== undefined ? profile.age : user.age,
      gender: profile.gender !== undefined ? profile.gender : user.gender,
      income: profile.income !== undefined ? profile.income : user.income,
      state: profile.state !== undefined ? profile.state : user.state,
      education: profile.education !== undefined ? profile.education : user.education,
      occupation: profile.occupation !== undefined ? profile.occupation : user.occupation
    });
  }

  // Fetch updated user wallet documents
  const userDocs = await db.documents.findByUserId(userId);

  // 2. Run Eligibility Agent
  await logActivity("Eligibility Agent", "Matching citizen profile details against 32 government schemes...");
  const matchedSchemes = await runEligibilityAgent(profile);
  await logActivity("Eligibility Agent", `Matched ${matchedSchemes.length} schemes with matching confidence >= 50%.`);

  // Clear past matches for this user and save new ones
  await db.eligibilityResults.deleteByUserId(userId);
  
  const resultsWithDetails = [];

  // Limit explainability and roadmaps to top 5 schemes to prevent execution timeouts
  const topMatches = matchedSchemes.slice(0, 5);

  for (const match of topMatches) {
    const scheme = await db.schemes.findById(match.scheme_id);
    
    // 3. Run Explainability Agent
    await logActivity("Explainability Agent", `Analyzing eligibility parameters for: "${scheme.name}"...`);
    const explanation = await runExplainabilityAgent(profile, scheme, match.breakdown);
    await logActivity("Explainability Agent", `Rationale calculated for "${scheme.name}" -> ${explanation.summary.slice(0, 80)}...`);

    // Save eligibility results to DB
    const savedResult = await db.eligibilityResults.create({
      user_id: userId,
      scheme_id: match.scheme_id,
      match_percentage: match.match_percentage,
      reason: explanation
    });

    // 4. Run Document Readiness Agent
    await logActivity("Document Readiness Agent", `Comparing required documents for "${scheme.name}" with User Wallet...`);
    const docStatus = await runDocumentAgent(scheme.required_documents, userDocs);
    await logActivity("Document Readiness Agent", `Readiness score for "${scheme.name}": ${docStatus.readinessScore}% (${docStatus.available.length} available, ${docStatus.missing.length} missing)`);

    // 5. Run Roadmap Agent
    await logActivity("Roadmap Agent", `Creating customized application roadmap for "${scheme.name}"...`);
    const steps = await runRoadmapAgent(scheme.name, scheme.required_documents, docStatus.missing, scheme.application_link);
    await logActivity("Roadmap Agent", `Application timeline generated. Step 1 task: "${steps[0]?.task || 'N/A'}"`);

    // Save/update roadmap in database
    const existingRm = await db.roadmaps.findByUserIdAndSchemeId(userId, scheme.id);
    if (existingRm) {
      await db.roadmaps.update(existingRm.id, {
        steps,
        percentage: docStatus.readinessScore,
        status: docStatus.readinessScore === 100 ? 'Ready' : 'Pending Docs'
      });
    } else {
      await db.roadmaps.create({
        user_id: userId,
        scheme_id: scheme.id,
        steps,
        percentage: docStatus.readinessScore,
        status: docStatus.readinessScore === 100 ? 'Ready' : 'Pending Docs'
      });
    }

    resultsWithDetails.push({
      ...match,
      explanation,
      documentStatus: docStatus,
      roadmapSteps: steps
    });
  }

  // 6. Run Life Event Agent
  await logActivity("Life Event Agent", "Generating citizen lifetime timeline and proactive future opportunity predictions...");
  const lifeEventPredictions = await runLifeEventAgent(profile);
  await logActivity("Life Event Agent", `Current lifecycle: "${lifeEventPredictions.current_stage}" -> Future transition: "${lifeEventPredictions.future_stage}". Suggested ${lifeEventPredictions.recommendations.length} upcoming programs.`);

  // Save life event predictions
  await db.lifeEvents.createOrUpdate({
    user_id: userId,
    current_stage: lifeEventPredictions.current_stage,
    history: {
      future_stage: lifeEventPredictions.future_stage,
      transitions: lifeEventPredictions.recommendations
    }
  });

  // Save future recommendations to recommendations table
  await db.recommendations.deleteByUserId(userId);
  for (const rec of lifeEventPredictions.recommendations) {
    await db.recommendations.create({
      user_id: userId,
      title: rec.title,
      category: rec.category,
      description: rec.description,
      difficulty: rec.difficulty,
      reward: rec.reward,
      timeline: rec.timeline,
      status: "Recommended"
    });
  }

  await logActivity("System Orchestrator", "Multi-Agent processing completed successfully. Dashboard and application roadmaps refreshed.");

  return {
    profile,
    matchedSchemes: resultsWithDetails,
    lifeEvents: lifeEventPredictions,
    logs: activityLogs
  };
}

module.exports = {
  orchestrateWorkflow
};
