const { generateText } = require('../services/geminiService');

/**
 * Explainability Agent
 * Explains why the user qualifies for the matched scheme in detail.
 */
async function runExplainabilityAgent(profile, scheme, breakdown) {
  console.log(`Agent 3: Running Explainability Agent for scheme: ${scheme.name}...`);

  const systemInstruction = `You are the Explainability Agent of SchemeSathi AI.
  Your task is to write a short, friendly explanation showing exactly how a citizen meets a scheme's criteria.
  Return a JSON structure containing:
  {
    "summary": "A 2-3 sentence overview explaining why they qualify.",
    "criteria": [
      { "label": "Criteria Category", "matched": true/false, "detail": "Human-friendly explanation text" }
    ]
  }
  Do not include markdown blocks, return ONLY valid JSON.`;

  const prompt = `
  Citizen Profile:
  - Age: ${profile.age}
  - Gender: ${profile.gender}
  - Occupation: ${profile.occupation}
  - Education: ${profile.education}
  - State: ${profile.state}
  - Income: Rs. ${profile.income}

  Scheme Target Rules:
  - Scheme Name: ${scheme.name}
  - Description: ${scheme.description}
  - Match Breakdown: ${JSON.stringify(breakdown)}

  Generate Eligibility Explanation JSON:`;

  const output = await generateText(prompt, systemInstruction);

  try {
    const cleanJson = output.replace(/```json/gi, '').replace(/```/g, '').trim();
    const explanation = JSON.parse(cleanJson);
    return explanation;
  } catch (err) {
    console.error("Agent 3 Error parsing JSON, returning procedural explanation:", err.message);
    
    // Procedural fallback explanation
    const criteriaList = [];
    
    criteriaList.push({
      label: "Occupation Check",
      matched: breakdown.occupation,
      detail: breakdown.occupation 
        ? `Your occupation as a ${profile.occupation || 'citizen'} meets the requirements of the scheme.` 
        : `Requires specific occupational categories.`
    });

    criteriaList.push({
      label: "State Domicile",
      matched: breakdown.state,
      detail: breakdown.state 
        ? `Located in ${profile.state || 'India'}, which matches the territorial guidelines.`
        : `Targeted towards specific states.`
    });

    criteriaList.push({
      label: "Financial Income",
      matched: breakdown.income,
      detail: breakdown.income 
        ? `Annual family income (Rs. ${profile.income || 'N/A'}) is below the scheme's limits.`
        : `Income exceeds scheme threshold limit.`
    });

    criteriaList.push({
      label: "Age Requirement",
      matched: breakdown.age,
      detail: breakdown.age 
        ? `Your age (${profile.age || 'N/A'}) is within the eligible age bracket.`
        : `Your age is outside the required group.`
    });

    return {
      summary: `You qualify for ${scheme.name} as a ${profile.occupation} in ${profile.state} with family income within limits.`,
      criteria: criteriaList
    };
  }
}

module.exports = runExplainabilityAgent;
