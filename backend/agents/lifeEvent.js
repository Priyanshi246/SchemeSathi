const { generateText } = require('../services/geminiService');

/**
 * Life Event Agent
 * Predicts future citizen opportunities and stages.
 */
async function runLifeEventAgent(profile) {
  console.log("Agent 6: Running Life Event Agent...");

  const currentOccupation = profile.occupation || "Student";
  const currentEducation = profile.education || "Undergraduate";

  const systemInstruction = `You are the Life Event Agent of SchemeSathi AI.
  Your task is to analyze the citizen's current profile and predict future career/business milestones.
  Suggest at least 2 highly relevant future scheme categories or titles they should prepare for.
  Return a JSON structure containing:
  {
    "current_stage": "E.g. Student",
    "future_stage": "E.g. Graduate / Job Seeker",
    "recommendations": [
      {
        "title": "Scheme or Program Name",
        "category": "E.g. MSME / Startup / Skill Development",
        "description": "Short explanation of how this fits their future transition",
        "difficulty": "Easy"/"Medium"/"Hard",
        "reward": "Key benefit description",
        "timeline": "When they should apply (e.g. In 1 year, post graduation)"
      }
    ]
  }
  Do not include markdown tags, return ONLY valid JSON.`;

  const prompt = `
  Citizen Profile:
  - Current Occupation: ${currentOccupation}
  - Current Education: ${currentEducation}
  - Age: ${profile.age || 20}
  - State: ${profile.state || 'All'}

  Predict Future Transitions and Recommended Opportunities:`;

  const output = await generateText(prompt, systemInstruction);

  try {
    const cleanJson = output.replace(/```json/gi, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    return result;
  } catch (err) {
    console.error("Agent 6 Error parsing JSON, running procedural Life Event logic:", err.message);

    // Procedural fallback timeline based on occupation
    let stage = "Student";
    let nextStage = "Graduate / Job Seeker";
    let recs = [];

    if (currentOccupation.toLowerCase() === "student") {
      stage = "Student";
      nextStage = "Graduate & Job Seeker";
      recs = [
        {
          title: "PM Kaushal Vikas Yojana (PMKVY) 4.0",
          category: "Skill Development",
          description: "Get industry-aligned technical skill training and recognized certification to transition from graduate to job seeker.",
          difficulty: "Easy",
          reward: "Government Skill Certification & Placement Support",
          timeline: "Post Graduation"
        },
        {
          title: "Pradhan Mantri Mudra Yojana (PMMY)",
          category: "MSME",
          description: "If you decide to self-start or open a small business, Mudra loans provide collateral-free working capital up to 10 Lakhs.",
          difficulty: "Medium",
          reward: "Collateral-Free Loan up to ₹10 Lakhs",
          timeline: "Entrepreneur Phase"
        }
      ];
    } else if (currentOccupation.toLowerCase() === "farmer") {
      stage = "Traditional Farmer";
      nextStage = "Agri-Entrepreneur";
      recs = [
        {
          title: "Agri-Clinics and Agri-Business Centres (ACABC) Scheme",
          category: "Farmer",
          description: "Transition into an agritech service provider offering testing labs and commercial setups to local farmers with up to 36% subsidy.",
          difficulty: "Medium",
          reward: "Up to 36% Capital Subsidy on Project Costs",
          timeline: "Next Crop Cycle"
        },
        {
          title: "Venture Capital Assistance Scheme",
          category: "Farmer",
          description: "Secure interest-free venture loans to expand agro-processing capabilities and build sustainable farm-to-table networks.",
          difficulty: "Hard",
          reward: "Interest-Free Loan up to ₹50 Lakhs",
          timeline: "Agribusiness Launch"
        }
      ];
    } else if (currentOccupation.toLowerCase() === "entrepreneur" || currentOccupation.toLowerCase() === "founder") {
      stage = "Early-Stage Entrepreneur";
      nextStage = "Established Business Owner";
      recs = [
        {
          title: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
          category: "MSME",
          description: "Scale your manufacturing or service operations. Access bank credit up to 5 Crores backed by government trust guarantee.",
          difficulty: "Hard",
          reward: "Credit Guarantee up to ₹5 Crores",
          timeline: "Scale-up Phase"
        },
        {
          title: "Mahila Udyam Nidhi Scheme",
          category: "Women",
          description: "Specially designed for women entrepreneurs to upgrade, modernize, or start tiny units with interest-subsidized seed capital.",
          difficulty: "Medium",
          reward: "Soft Loan seed funding up to 25% project cost",
          timeline: "Business Upgrade Phase"
        }
      ];
    } else {
      // General Citizens
      stage = "Unemployed / Informal Worker";
      nextStage = "Self-Employed Artisan";
      recs = [
        {
          title: "PM Vishwakarma Scheme",
          category: "Skill Development",
          description: "Register as a registered artisan to receive training, ₹500/day stipends, ₹15,000 toolkits, and low-interest credits.",
          difficulty: "Easy",
          reward: "₹15,000 Toolkit + Skill training & 5% loan",
          timeline: "Registration Phase"
        },
        {
          title: "Atal Pension Yojana (APY)",
          category: "MSME",
          description: "Secure your financial future with a guaranteed pension of up to ₹5,000 per month post-retirement.",
          difficulty: "Easy",
          reward: "Guaranteed Pension up to ₹5,000/month",
          timeline: "Immediate Enrollment"
        }
      ];
    }

    return {
      current_stage: stage,
      future_stage: nextStage,
      recommendations: recs
    };
  }
}

module.exports = runLifeEventAgent;
