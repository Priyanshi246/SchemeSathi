const { generateText } = require('../services/geminiService');

/**
 * Citizen Profiling Agent
 * Extracts age, gender, income, state, education, and occupation from user text.
 */
async function runProfilerAgent(userInput, chatHistory = []) {
  console.log("Agent 1: Running Citizen Profiling Agent...");
  
  const systemInstruction = `You are the Citizen Profiling Agent of SchemeSathi AI. Your sole job is to read the citizen's query and extract their demographic details into a clean JSON structure.
  The JSON structure MUST have these exact keys and types:
  {
    "age": number or null,
    "gender": string ("Male", "Female", or "Other") or null,
    "income": number (annual family income in INR) or null,
    "state": string (Indian State Name) or null,
    "education": string ("School", "Undergraduate", "Postgraduate", "PhD", "None") or null,
    "occupation": string ("Student", "Farmer", "Entrepreneur", "Founder", "Street Vendor", "Artisan", "Unemployed", "Self-Employed", "Business Owner", "Job Seeker") or null
  }
  Do not include any other conversational text or markdown blocks, return ONLY valid parsable JSON.`;

  const contextPrompt = `
  Chat History:
  ${chatHistory.map(h => `${h.sender}: ${h.text}`).join('\n')}
  
  Current User Statement:
  "${userInput}"
  
  Extract profile JSON:`;

  const output = await generateText(contextPrompt, systemInstruction);
  
  try {
    // Clean potential markdown wrapping
    const cleanJson = output.replace(/```json/gi, '').replace(/```/g, '').trim();
    const profile = JSON.parse(cleanJson);
    console.log("Agent 1: Structured Profile Output:", profile);
    return profile;
  } catch (err) {
    console.error("Agent 1 Error parsing JSON, returning fallback parser:", err.message);
    // Double fallback procedural parser (similar to GeminiService mock)
    return {
      age: 20,
      gender: userInput.toLowerCase().includes("girl") || userInput.toLowerCase().includes("female") ? "Female" : "Male",
      income: userInput.toLowerCase().includes("2 lakh") ? 200000 : 300000,
      state: userInput.toLowerCase().includes("rajasthan") ? "Rajasthan" : "All",
      education: userInput.toLowerCase().includes("student") ? "Undergraduate" : "School",
      occupation: userInput.toLowerCase().includes("student") ? "Student" : "Farmer"
    };
  }
}

module.exports = runProfilerAgent;
