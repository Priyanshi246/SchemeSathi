/**
 * Document Readiness Agent
 * Compares required documents against user uploaded wallet files.
 */
async function runDocumentAgent(requiredDocs, userDocs) {
  console.log("Agent 4: Running Document Readiness Agent...");

  const available = [];
  const missing = [];

  // Helper function to check if a required doc is in the user's wallet
  const findMatchingDoc = (reqName) => {
    const cleanReq = reqName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return userDocs.find(ud => {
      const cleanName = ud.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanType = (ud.type || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // Direct matches
      if (cleanName.includes(cleanReq) || cleanReq.includes(cleanName)) return true;
      if (cleanType.includes(cleanReq) || cleanReq.includes(cleanType)) return true;

      // Common mappings / aliases
      const mappings = {
        'aadhaarcard': ['aadhaar', 'uidai', 'aadhar'],
        'incomecertificate': ['income', 'salary', 'financial'],
        'studentid': ['student', 'idcard', 'collegeid', 'rollno'],
        'pancard': ['pan', 'taxpayer'],
        'bankpassbook': ['passbook', 'bank', 'statement', 'account'],
        'domicilecertificate': ['domicile', 'residence', 'moolniwas']
      };

      for (const [key, aliases] of Object.entries(mappings)) {
        if (cleanReq.includes(key)) {
          return aliases.some(alias => cleanName.includes(alias) || cleanType.includes(alias));
        }
      }
      return false;
    });
  };

  for (const reqDoc of requiredDocs) {
    const matched = findMatchingDoc(reqDoc);
    if (matched) {
      available.push({
        required: reqDoc,
        fileName: matched.name,
        docId: matched.id,
        verified: matched.verified
      });
    } else {
      missing.push(reqDoc);
    }
  }

  // Calculate readiness score
  const totalRequired = requiredDocs.length;
  const matchCount = available.length;
  const readinessScore = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 100;

  console.log(`Agent 4: Document Readiness matches: ${matchCount}/${totalRequired} (${readinessScore}%)`);

  return {
    available,
    missing,
    readinessScore
  };
}

module.exports = runDocumentAgent;
