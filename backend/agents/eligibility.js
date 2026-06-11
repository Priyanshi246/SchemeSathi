const db = require('../config/db');

/**
 * Eligibility Agent
 * Compares structured profile with scheme rules, outputting match percentages.
 */
async function runEligibilityAgent(profile) {
  console.log("Agent 2: Running Eligibility Agent...");
  
  // Fetch schemes
  const schemes = await db.schemes.list();
  const matchedSchemes = [];

  for (const scheme of schemes) {
    const rules = scheme.eligibility_rules;
    let score = 0;
    const breakdown = {
      occupation: false,
      state: false,
      income: false,
      gender: false,
      age: false
    };

    // 1. Occupation Check (Weight: 25%)
    if (!rules.occupation || rules.occupation.includes("All") || (profile.occupation && rules.occupation.some(o => o.toLowerCase() === profile.occupation.toLowerCase()))) {
      score += 25;
      breakdown.occupation = true;
    }

    // 2. State Check (Weight: 25%)
    if (!rules.state || rules.state.includes("All") || (profile.state && rules.state.some(s => s.toLowerCase() === profile.state.toLowerCase()))) {
      score += 25;
      breakdown.state = true;
    }

    // 3. Income Check (Weight: 20%)
    if (!rules.income_max || (profile.income !== null && profile.income <= rules.income_max)) {
      score += 20;
      breakdown.income = true;
    }

    // 4. Gender Check (Weight: 15%)
    if (!rules.gender || rules.gender.includes("All") || (profile.gender && rules.gender.some(g => g.toLowerCase() === profile.gender.toLowerCase()))) {
      score += 15;
      breakdown.gender = true;
    }

    // 5. Age Check (Weight: 15%)
    const age = profile.age || 22; // default fallback if age is missing
    const ageMin = rules.age_min || 0;
    const ageMax = rules.age_max || 120;
    if (age >= ageMin && age <= ageMax) {
      score += 15;
      breakdown.age = true;
    }

    // Include schemes with a matching percentage >= 50%
    if (score >= 50) {
      matchedSchemes.push({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        category: scheme.category,
        benefits: scheme.benefits,
        match_percentage: score,
        breakdown,
        required_documents: scheme.required_documents,
        deadline: scheme.deadline,
        application_link: scheme.application_link
      });
    }
  }

  // Sort by match percentage in descending order
  const sortedMatches = matchedSchemes.sort((a, b) => b.match_percentage - a.match_percentage);
  console.log(`Agent 2: Found ${sortedMatches.length} matching schemes.`);
  return sortedMatches;
}

module.exports = runEligibilityAgent;
