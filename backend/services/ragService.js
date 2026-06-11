const { generateText } = require('./geminiService');

// Preseeded policy and manual document chunks (RAG Knowledge Base)
const KNOWLEDGE_BASE = [
  {
    id: "kb_1",
    title: "National Scholarship Portal Guidelines 2026",
    section: "Income Verification Requirements",
    content: "All central sector scholarships require a valid family income certificate issued by a competent authority not below the rank of Tehsildar. The maximum income threshold is ₹4.5 Lakhs per annum. Income certificates issued after the application deadline will not be accepted for verification.",
    source: "NSP Policy Manual Section 4.2"
  },
  {
    id: "kb_2",
    title: "PM-KISAN Operational Guidelines",
    section: "Exclusion Criteria for Farmers",
    content: "The following categories of beneficiaries of higher economic status shall not be eligible for benefits: (a) All Institutional Land holders, (b) Farmer families in which one or more of its members is a doctor, lawyer, chartered accountant, or pays income tax in the last assessment year.",
    source: "PM-KISAN Scheme Document Page 12"
  },
  {
    id: "kb_3",
    title: "Startup India Seed Fund Scheme Manual",
    section: "DPIIT Recognition Criteria",
    content: "To apply for seed funding, a startup must be incorporated as a private limited company or registered partnership firm and must have DPIIT recognition. The startup should not have received more than ₹10 Lakhs of monetary support under any other Central or State government scheme.",
    source: "SISFS Operational Guidelines Para 5"
  },
  {
    id: "kb_4",
    title: "Rajasthan Chief Minister Higher Education Guidelines",
    section: "State Domicile Verification",
    content: "Beneficiaries must possess a digital domicile certificate (Mool Niwas Praman Patra) of Rajasthan. Students studying in Rajasthan universities whose parents are government employees of other states but stationed in Rajasthan are eligible subject to institutional head certification.",
    source: "Rajasthan DTE Circular 2025"
  },
  {
    id: "kb_5",
    title: "Pradhan Mantri Mudra Yojana Rules",
    section: "Security and Collateral",
    content: "As per RBI directives, no collateral security is to be charged for Mudra loans up to ₹10 Lakhs. The banks have been mandated to create a charge on the assets created out of the bank loan instead of demanding physical collateral or third-party guarantees.",
    source: "Mudra Loan Operational FAQ Q.9"
  },
  {
    id: "kb_6",
    title: "Lakhpati Didi Skill Framework",
    section: "Self Help Group Linkages",
    content: "Women applying for Lakhpati Didi benefits must be active members of a government-registered Self Help Group (SHG) for a minimum of 6 months. Micro-credits up to ₹1.5 Lakhs are disbursed in tranches conditional on attending the local skill development workshops.",
    source: "Ministry of Rural Development Directive 18"
  }
];

/**
 * Lightweight helper to tokenize and convert text to a word-frequency vector
 */
function getVector(text) {
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  
  const vector = {};
  for (const word of words) {
    if (word.length > 2) {
      vector[word] = (vector[word] || 0) + 1;
    }
  }
  return vector;
}

/**
 * Compute cosine similarity between two word-frequency vectors
 */
function cosineSimilarity(v1, v2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  const allWords = new Set([...Object.keys(v1), ...Object.keys(v2)]);

  for (const word of allWords) {
    const val1 = v1[word] || 0;
    const val2 = v2[word] || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

/**
 * Search the knowledge base using semantic/cosine similarity
 */
async function searchKnowledgeBase(query, limit = 2) {
  console.log(`RAG: Querying knowledge base for "${query}"`);
  
  // Real semantic search simulation
  const queryVector = getVector(query);
  const scoredChunks = KNOWLEDGE_BASE.map(chunk => {
    const chunkVector = getVector(chunk.title + " " + chunk.section + " " + chunk.content);
    const score = cosineSimilarity(queryVector, chunkVector);
    return { ...chunk, score };
  });

  // Sort by score in descending order and slice
  const results = scoredChunks
    .sort((a, b) => b.score - a.score)
    .filter(c => c.score > 0.05) // minimum similarity threshold
    .slice(0, limit);

  // If no good results, return the most generic ones
  if (results.length === 0) {
    return KNOWLEDGE_BASE.slice(0, limit).map(c => ({ ...c, score: 0.1 }));
  }

  return results;
}

/**
 * Query the RAG engine to get an answer backed by policy documents.
 */
async function answerWithRAG(query) {
  const contexts = await searchKnowledgeBase(query, 2);
  
  // Construct context string
  const contextString = contexts.map((c, i) => 
    `Source [${i+1}]: ${c.title} - ${c.section} (Source: ${c.source})\nContent: ${c.content}`
  ).join('\n\n');

  const systemInstruction = `You are the Explainability Agent of SchemeSathi AI. You must answer the user's question accurately using ONLY the provided Source Contexts. If the contexts do not contain the answer, politely state that you could not find verified guidelines for this in official circulars. Always cite your source name/section. Avoid hallucination.`;

  const prompt = `
Contexts:
${contextString}

Question:
${query}

Answer (Ensure you cite the sources [1], [2] as references in your response):`;

  const answerText = await generateText(prompt, systemInstruction);

  return {
    answer: answerText,
    sources: contexts.map(c => ({
      title: c.title,
      section: c.section,
      source: c.source
    }))
  };
}

module.exports = {
  searchKnowledgeBase,
  answerWithRAG
};
