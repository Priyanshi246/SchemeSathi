// Mock database for frontend-only fallback mode
export const initialMockUser = {
  name: "Aarav Sharma",
  email: "citizen@schemesathi.ai",
  role: "Citizen",
  state: "Rajasthan",
  occupation: "Student",
  age: 20,
  gender: "Male",
  income: 200000,
  education: "Undergraduate"
};

export const sampleSchemes = [
  {
    id: "scheme-1",
    scheme_name: "Rajasthan Yuva Vikas Scholarship",
    category: "Education",
    match_percentage: 98,
    benefits: "₹50,000 per annum for tuition & study resources",
    description: "Financial assistance program for undergraduate students residing in Rajasthan with family income below ₹2.5 Lakhs.",
    eligibility: {
      state: "Rajasthan",
      max_income: 250000,
      occupation: "Student",
      summary: "Qualified: Domicile matches Rajasthan, income ₹200,000 is below ₹250,000 limit, and occupation is Student."
    },
    documentStatus: {
      available: ["Aadhaar Card", "Income Certificate", "Student ID"],
      missing: ["Domicile Certificate"],
      readinessScore: 75
    },
    timeline: "Apply by Sep 30, 2026",
    reward: "₹50,000 / Yr"
  },
  {
    id: "scheme-2",
    scheme_name: "Post-Matric Scholarship Scheme (OBC/SC/ST)",
    category: "Scholarship",
    match_percentage: 95,
    benefits: "100% tuition fee reimbursement and maintenance allowance",
    description: "Centrally sponsored scheme implemented by state governments for post-matriculation studies.",
    eligibility: {
      state: "Any",
      max_income: 250000,
      occupation: "Student",
      summary: "Qualified: Income is within bounds and current education status matches Post-Matriculation criteria."
    },
    documentStatus: {
      available: ["Aadhaar Card", "Income Certificate", "Student ID"],
      missing: [],
      readinessScore: 100
    },
    timeline: "Apply by Oct 15, 2026",
    reward: "Fee Waiver"
  },
  {
    id: "scheme-3",
    scheme_name: "PM Yuva Entrepreneurship Scheme",
    category: "Business",
    match_percentage: 40,
    benefits: "Collateral-free startup loan up to ₹5 Lakhs with 35% subsidy",
    description: "Empowers young citizens to launch micro-enterprises with simplified documentation and capital subsidies.",
    eligibility: {
      state: "Any",
      max_income: 500000,
      occupation: "Entrepreneur",
      summary: "Partially Qualified: Income is eligible, but your primary profile is listed as 'Student' instead of 'Entrepreneur/Self-employed'."
    },
    documentStatus: {
      available: ["Aadhaar Card", "Income Certificate"],
      missing: ["Business Proposal", "GST Registration"],
      readinessScore: 50
    },
    timeline: "Rolling applications",
    reward: "₹5L Loan Cap"
  }
];

export const sampleDocuments = [
  { id: "doc-1", name: "Aadhaar Card", type: "Identity Proof", status: "Verified", date: "2026-05-10" },
  { id: "doc-2", name: "Income Certificate", type: "Income Proof", status: "Verified", date: "2026-06-01" },
  { id: "doc-3", name: "Student ID", type: "Education Proof", status: "Verified", date: "2026-06-10" }
];

export const mockNotifications = [
  {
    id: "n-1",
    title: "Eligibility Match Found",
    message: "Citizen Profiling Agent detected you qualify for Rajasthan Yuva Vikas Scholarship.",
    read: false,
    timestamp: new Date().toISOString()
  },
  {
    id: "n-2",
    title: "Wallet Audit Warning",
    message: "Document Readiness Agent flagged: 'Domicile Certificate' is missing for Rajasthan Scholarship.",
    read: false,
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

export const getMockDashboard = () => {
  const user = getLocalStorage('user') || initialMockUser;
  const docs = getLocalStorage('documents') || sampleDocuments;
  
  // Dynamic calculation based on user details
  const eligibleCount = user.state === "Rajasthan" && user.income <= 250000 && user.occupation === "Student" ? 2 : 1;
  const walletCompleted = Math.round((docs.length / 4) * 100);

  return {
    profile: user,
    metrics: {
      eligibleSchemesCount: eligibleCount,
      applicationReadinessScore: walletCompleted,
      opportunityScore: user.occupation === "Student" ? 85 : 45
    },
    recentRecommendations: [
      {
        title: "Rajasthan Yuva Vikas Scholarship",
        category: "Education",
        description: "Verify your Domicile certificate to complete application readiness.",
        timeline: "Expires in 3 months",
        reward: "₹50,000 / Yr"
      },
      {
        title: "Graduate Apprentice Training Scheme",
        category: "Career Support",
        description: "Forecasted milestone when you change occupation to Graduate next year.",
        timeline: "Proactive Forecast",
        reward: "₹12,000 / Mo Stipend"
      }
    ],
    walletSummary: {
      uploadedTypes: docs.map(d => d.name),
      totalCount: docs.length
    },
    agentActivityFeed: getLocalStorage('agentLogs') || [
      {
        agent_name: "Citizen Profiling Agent",
        log_text: "Successfully constructed digital twin profile for Aarav Sharma.",
        timestamp: new Date().toISOString()
      },
      {
        agent_name: "Eligibility Agent",
        log_text: "Rules match completed: 2 active state matching schemes found.",
        timestamp: new Date(Date.now() - 10000).toISOString()
      }
    ]
  };
};

function getLocalStorage(key) {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (_) {
    return data;
  }
}
