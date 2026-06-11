const { GoogleGenAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || "";
let genAI = null;

if (apiKey) {
  try {
    // Note: The newer GoogleGenAI client or the standard GoogleGenerativeAI client.
    // Standard import from @google/generative-ai: const { GoogleGenerativeAI } = require('@google/generative-ai');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("AI Status: Gemini API client initialized successfully!");
  } catch (err) {
    console.error("AI Status: Failed to initialize Gemini API client, falling back to rule engine:", err.message);
  }
} else {
  console.log("AI Status: GEMINI_API_KEY not found. Running in Hackathon Offline Demo Mode with simulated Agent AI.");
}

/**
 * Call Gemini model to generate content. Falls back to smart mock if disabled/fails.
 */
async function generateText(prompt, systemInstruction = "") {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction || undefined
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.error("Gemini API execution error, falling back to simulation:", err.message);
    }
  }
  return simulateAgentLogic(prompt, systemInstruction);
}

/**
 * Procedural mock logic for the 6 agents when API Key is missing.
 * Generates realistic responses based on query keywords.
 */
function simulateAgentLogic(prompt, systemInstruction) {
  const lowercasePrompt = prompt.toLowerCase();
  
  // 1. Profiler Agent simulation
  if (systemInstruction.includes("profiling") || lowercasePrompt.includes("profile") || lowercasePrompt.includes("extract")) {
    // Default extraction
    let profile = {
      age: 20,
      gender: "Male",
      income: 200000,
      state: "Rajasthan",
      education: "Undergraduate",
      occupation: "Student"
    };

    if (lowercasePrompt.includes("female") || lowercasePrompt.includes("girl") || lowercasePrompt.includes("woman")) {
      profile.gender = "Female";
    }
    if (lowercasePrompt.includes("farmer") || lowercasePrompt.includes("agriculture") || lowercasePrompt.includes("kisan")) {
      profile.occupation = "Farmer";
      profile.education = "School";
    }
    if (lowercasePrompt.includes("startup") || lowercasePrompt.includes("entrepreneur") || lowercasePrompt.includes("business") || lowercasePrompt.includes("founder")) {
      profile.occupation = "Entrepreneur";
      profile.education = "Undergraduate";
    }
    if (lowercasePrompt.includes("lakh") || lowercasePrompt.includes("l")) {
      const incomeMatch = lowercasePrompt.match(/(\d+)\s*(lakh|l)/);
      if (incomeMatch) {
        profile.income = parseInt(incomeMatch[1]) * 100000;
      }
    }
    if (lowercasePrompt.includes("thousand") || lowercasePrompt.includes("k")) {
      const incomeMatch = lowercasePrompt.match(/(\d+)\s*(thousand|k)/);
      if (incomeMatch) {
        profile.income = parseInt(incomeMatch[1]) * 1000;
      }
    }
    // Match state
    const states = ["Rajasthan", "Gujarat", "Maharashtra", "Punjab", "Haryana", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh", "Bihar"];
    for (const state of states) {
      if (lowercasePrompt.includes(state.toLowerCase())) {
        profile.state = state;
      }
    }
    // Match occupation
    const occupations = ["Student", "Farmer", "Entrepreneur", "Founder", "Street Vendor", "Artisan", "Unemployed", "Self-Employed", "Business Owner"];
    for (const occ of occupations) {
      if (lowercasePrompt.includes(occ.toLowerCase())) {
        profile.occupation = occ;
      }
    }
    // Match education
    const educations = ["School", "Undergraduate", "Postgraduate", "Graduate", "PhD"];
    for (const edu of educations) {
      if (lowercasePrompt.includes(edu.toLowerCase())) {
        profile.education = edu;
      }
    }
    // Match age
    const ageMatch = lowercasePrompt.match(/(\d+)\s*(year|yr|age)/);
    if (ageMatch) {
      profile.age = parseInt(ageMatch[1]);
    }

    return JSON.stringify(profile);
  }

  // 2. Explainability Agent simulation
  if (systemInstruction.includes("explain") || lowercasePrompt.includes("explain why")) {
    return JSON.stringify({
      criteria: [
        { label: "Occupation Status", matched: true, detail: "Matches target demographic." },
        { label: "Income Threshold", matched: true, detail: "Annual family income is within eligibility limits." },
        { label: "Domicile State", matched: true, detail: "Matches scheme territorial jurisdiction." },
        { label: "Age Bracket", matched: true, detail: "Meets minimal and maximum age constraints." }
      ]
    });
  }

  // 3. Roadmap Agent simulation
  if (systemInstruction.includes("roadmap") || lowercasePrompt.includes("roadmap") || lowercasePrompt.includes("action plan")) {
    return JSON.stringify({
      steps: [
        { day: 1, task: "Procure Income Certificate from local tehsildar or government portal", details: "Ensure family income matches eligibility criteria.", status: "Pending" },
        { day: 2, task: "Access the National Scholarship Portal or scheme-specific link", details: "Click 'Register' and authenticate with Aadhaar OTP.", status: "Pending" },
        { day: 3, task: "Upload academic credentials and identity files", details: "Provide Aadhaar, College ID, and previous year transcript.", status: "Pending" },
        { day: 4, task: "Submit document wallet references and finalize review", details: "Submit application and record application ID for tracking.", status: "Pending" }
      ]
    });
  }

  // 4. Life Event Agent simulation
  if (systemInstruction.includes("life event") || lowercasePrompt.includes("future") || lowercasePrompt.includes("life stage")) {
    return JSON.stringify({
      future_stage: "Graduate / Job Seeker",
      recommendations: [
        {
          title: "PM Kaushal Vikas Yojana (PMKVY) 4.0",
          category: "Skill Development",
          description: "Get industry-aligned technical skill training and recognized certification with stipend assistance.",
          difficulty: "Easy",
          reward: "Government Skill Certification & Placement Support",
          timeline: "Post Graduation"
        },
        {
          title: "Pradhan Mantri Mudra Yojana (PMMY)",
          category: "MSME",
          description: "Receive startup and small business funding up to ₹10 Lakhs under Shishu/Kishor mudra loans.",
          difficulty: "Medium",
          reward: "Collateral-Free Business Loan up to ₹10 Lakhs",
          timeline: "Entrepreneur Phase"
        }
      ]
    });
  }

  // Generic fallback text
  return "SchemeSathi AI Agent is ready. This is an automatically generated helper response analyzing profile requirements.";
}

module.exports = {
  generateText
};
