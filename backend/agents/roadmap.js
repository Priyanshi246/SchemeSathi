const { generateText } = require('../services/geminiService');

/**
 * Roadmap Agent
 * Generates application roadmap checklist based on document readiness and scheme portal details.
 */
async function runRoadmapAgent(schemeName, requiredDocs, missingDocs, applicationLink) {
  console.log(`Agent 5: Running Roadmap Agent for: ${schemeName}...`);

  const systemInstruction = `You are the Roadmap Agent of SchemeSathi AI.
  Your task is to create a beautiful, step-by-step application plan (4 days) for a citizen applying for a government scheme.
  If there are missing documents, prioritize acquiring them in the first days.
  Return a JSON structure containing:
  {
    "steps": [
      { "day": number, "task": "Short action task description", "details": "Elaborated details on how to do it", "status": "Pending"/"In Progress"/"Completed" }
    ]
  }
  Do not include markdown tags, return ONLY valid JSON.`;

  const prompt = `
  Scheme Name: ${schemeName}
  Required Documents: ${requiredDocs.join(', ')}
  Missing Documents: ${missingDocs.length > 0 ? missingDocs.join(', ') : 'None - All available!'}
  Application Portal: ${applicationLink}

  Generate Day-by-Day Application Roadmap JSON:`;

  const output = await generateText(prompt, systemInstruction);

  try {
    const cleanJson = output.replace(/```json/gi, '').replace(/```/g, '').trim();
    const roadmap = JSON.parse(cleanJson);
    return roadmap.steps;
  } catch (err) {
    console.error("Agent 5 Error parsing JSON, running procedural roadmap:", err.message);

    // Procedural fallback roadmap
    const steps = [];
    let dayCount = 1;

    // Day 1 & 2: Procure missing documents
    if (missingDocs.length > 0) {
      steps.push({
        day: dayCount++,
        task: `Acquire Missing Document: ${missingDocs[0]}`,
        details: `Submit an application on the e-Seva/e-Mitra state service portal or visit the local government offices. Collect necessary receipts.`,
        status: "Pending"
      });

      if (missingDocs.length > 1) {
        steps.push({
          day: dayCount++,
          task: `Acquire Remaining Documents: ${missingDocs.slice(1).join(', ')}`,
          details: `Organize certificates, scanned ID photocopies, and verify that they are within their validation/expiry dates.`,
          status: "Pending"
        });
      }
    }

    // Next Day: Register
    steps.push({
      day: dayCount++,
      task: "Register on Official Scheme Portal",
      details: `Navigate to the official portal: ${applicationLink || 'Government Portal'}. Click 'New Registration' and sign up using Aadhaar and mobile OTP.`,
      status: "Pending"
    });

    // Next Day: Upload Docs
    steps.push({
      day: dayCount++,
      task: "Upload Verified Documents & Fill Form",
      details: "Copy data from your SchemeSathi Document Wallet, fill up the educational/demographic fields, and upload the files.",
      status: "Pending"
    });

    // Final Day: Submission
    steps.push({
      day: dayCount++,
      task: "Review and Final Submit",
      details: "Check for spelling mistakes in your application form, verify bank account details for direct benefit transfers, and click Submit. Save the application number.",
      status: "Pending"
    });

    // Enforce exactly 4 days / 4 items
    return steps.slice(0, 4);
  }
}

module.exports = runRoadmapAgent;
