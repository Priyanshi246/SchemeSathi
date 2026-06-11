module.exports = [
  {
    id: 1,
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all landholding farmer families to support their financial needs.",
    category: "Farmer",
    benefits: "Direct income support of ₹6,000 per year paid in three equal installments of ₹2,000 directly into bank accounts.",
    eligibility_rules: {
      occupation: ["Farmer"],
      income_max: 300000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 100
    },
    required_documents: ["Aadhaar Card", "Land Ownership Documents", "Bank Passbook"],
    deadline: "2026-12-31",
    application_link: "https://pmkisan.gov.in/"
  },
  {
    id: 2,
    name: "Central Sector Scheme of Scholarship for College and University Students",
    description: "Provides financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.",
    category: "Student",
    benefits: "₹12,000 per annum for graduation (first three years) and ₹20,000 per annum for post-graduation.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate", "Postgraduate"],
      income_max: 450000,
      state: ["All"],
      gender: ["All"],
      age_min: 17,
      age_max: 25
    },
    required_documents: ["Aadhaar Card", "Student ID", "Income Certificate", "Mark Sheet"],
    deadline: "2026-10-31",
    application_link: "https://scholarships.gov.in/"
  },
  {
    id: 3,
    name: "PM SVANidhi (Pradhan Mantri Street Vendor’s AtmaNirbhar Nidhi)",
    description: "A special micro-credit facility scheme for providing affordable working capital loans to street vendors to resume their livelihoods after the pandemic.",
    category: "MSME",
    benefits: "Initial working capital loan of up to ₹10,000, interest subsidy of 7% on timely repayment, and cashback on digital transactions.",
    eligibility_rules: {
      occupation: ["Street Vendor", "Shopkeeper", "Self-Employed"],
      income_max: 200000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 65
    },
    required_documents: ["Aadhaar Card", "Voter ID", "Certificate of Vending / Vendor ID Card"],
    deadline: "2026-08-31",
    application_link: "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    id: 4,
    name: "Startup India Seed Fund Scheme (SISFS)",
    description: "Provides financial assistance to startups for proof of concept, prototype development, product trials, market-entry, and commercialization.",
    category: "Startup",
    benefits: "Grants up to ₹20 Lakhs for validation of proof of concept, prototype development, or product trials, and up to ₹50 Lakhs investment via debt/convertible debentures.",
    eligibility_rules: {
      occupation: ["Entrepreneur", "Founder"],
      education: ["All"],
      income_max: 10000000,
      state: ["All"],
      gender: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "DPIIT Recognition Certificate", "Business Proposal", "Pitch Deck"],
    deadline: "2026-11-30",
    application_link: "https://www.startupindia.gov.in/"
  },
  {
    id: 5,
    name: "Lakhpati Didi Scheme",
    description: "Empowers women in self-help groups (SHGs) by providing them with skill training and financial support to help them earn at least ₹1 Lakh annually.",
    category: "Women",
    benefits: "Financial assistance, skill development training in sectors like plumbing, LED bulb making, drone operation, and access to interest-free loans.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Self Help Group Member", "Self-Employed", "Unemployed"],
      income_max: 150000,
      state: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "SHG Certificate", "Bank Passbook", "Income Certificate"],
    deadline: "2026-12-15",
    application_link: "https://lakhpatididi.gov.in/"
  },
  {
    id: 6,
    name: "PM Kaushal Vikas Yojana (PMKVY) 4.0",
    description: "A skill certification scheme aiming to enable a large number of Indian youth to take up industry-relevant skill training that will help them secure a better livelihood.",
    category: "Skill Development",
    benefits: "Free skill training, assessment, and government certification, monetary rewards upon successful completion, and placement assistance.",
    eligibility_rules: {
      occupation: ["Student", "Unemployed", "Job Seeker"],
      age_min: 15,
      age_max: 45,
      income_max: 500000,
      state: ["All"],
      gender: ["All"],
      education: ["All"]
    },
    required_documents: ["Aadhaar Card", "Educational Mark Sheet", "Bank Passbook"],
    deadline: "2026-09-30",
    application_link: "https://www.pmkvyofficial.org/"
  },
  {
    id: 7,
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "Provides loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises. Divided into Shishu (up to ₹50k), Kishor (up to ₹5L), and Tarun (up to ₹10L).",
    category: "MSME",
    benefits: "Collateral-free loans up to ₹10 Lakhs with flexible repayment options and lower interest rates for business expansion.",
    eligibility_rules: {
      occupation: ["Business Owner", "Entrepreneur", "Self-Employed"],
      income_max: 2000000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 65
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Business Registration Proof", "Bank Statement"],
    deadline: "2027-03-31",
    application_link: "https://www.mudra.org.in/"
  },
  {
    id: 8,
    name: "Atal Innovation Mission (AIM)",
    description: "Government program to promote a culture of innovation and entrepreneurship across India through school level tinkering labs and incubator grants.",
    category: "Startup",
    benefits: "Funding of up to ₹10 Crore for setting up Atal Incubation Centres (AICs) and scale-up support for early-stage startups.",
    eligibility_rules: {
      occupation: ["Founder", "Entrepreneur", "Researcher"],
      education: ["Undergraduate", "Postgraduate", "PhD"],
      income_max: 50000000,
      state: ["All"],
      gender: ["All"],
      age_min: 18,
      age_max: 55
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Company Incorporation Certificate", "Detailed Project Report"],
    deadline: "2026-12-31",
    application_link: "https://aim.gov.in/"
  },
  {
    id: 9,
    name: "Pragati Scholarship Scheme for Girl Students",
    description: "An AICTE initiative to support advancement of girls pursuing technical education like engineering, pharmacy, and architecture.",
    category: "Student",
    benefits: "₹50,000 per annum for every year of study as a contribution towards tuition fees, computer purchase, books, and stationeries.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Student"],
      education: ["Undergraduate"],
      income_max: 800000,
      state: ["All"],
      age_min: 16,
      age_max: 22
    },
    required_documents: ["Aadhaar Card", "Student ID", "Income Certificate", "AICTE Admission Proof", "Bank Passbook"],
    deadline: "2026-10-15",
    application_link: "https://www.aicte-india.org/"
  },
  {
    id: 10,
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    description: "A rural youth employment placement scheme that funds training programs in various vocational fields with guaranteed placement support.",
    category: "Skill Development",
    benefits: "Fully funded vocational training, free food and accommodation during training, and placement in salaried jobs with minimum wage guarantees.",
    eligibility_rules: {
      occupation: ["Unemployed", "Job Seeker"],
      state: ["All"],
      gender: ["All"],
      income_max: 250000,
      education: ["All"],
      age_min: 15,
      age_max: 35
    },
    required_documents: ["Aadhaar Card", "Voter ID", "Income Certificate / BPL Card", "School Certificate"],
    deadline: "2026-09-30",
    application_link: "http://ddugky.gov.in/"
  },
  {
    id: 11,
    name: "Stand-Up India Scheme",
    description: "Promotes entrepreneurship among women and SC/ST communities by providing bank loans for greenfield enterprises.",
    category: "Women",
    benefits: "Bank loans between ₹10 Lakhs and ₹1 Crore for starting a greenfield enterprise in manufacturing, services, or trading sector.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Founder", "Entrepreneur"],
      income_max: 50000000,
      state: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 70
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Category Certificate (SC/ST/Women)", "Business Pitch", "Bank Passbook"],
    deadline: "2027-03-31",
    application_link: "https://www.standupmitra.in/"
  },
  {
    id: 12,
    name: "Mahila Samman Savings Certificate",
    description: "A small savings scheme for women and girls offering fixed deposit opportunities at highly competitive interest rates.",
    category: "Women",
    benefits: "Fixed deposit scheme for women offering 7.5% interest rate per annum compounded quarterly, with withdrawal flexibility.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["All"],
      income_max: 10000000,
      state: ["All"],
      education: ["All"],
      age_min: 1,
      age_max: 100
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Bank Passbook"],
    deadline: "2026-11-30",
    application_link: "https://www.indiapost.gov.in/"
  },
  {
    id: 13,
    name: "PM Vidyalaxmi Scheme",
    description: "A single window portal for students to search, view, and apply for educational loans and scholarships online.",
    category: "Student",
    benefits: "Provides access to education loans from 40+ banks without collateral for loans up to ₹7.5 Lakhs.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate", "Postgraduate"],
      income_max: 800000,
      state: ["All"],
      gender: ["All"],
      age_min: 16,
      age_max: 30
    },
    required_documents: ["Aadhaar Card", "Student ID", "College Admission Letter", "Fee Structure Document", "Income Certificate"],
    deadline: "2026-08-31",
    application_link: "https://www.vidyalakshmi.co.in/"
  },
  {
    id: 14,
    name: "Prime Minister’s Employment Generation Programme (PMEGP)",
    description: "A credit-linked subsidy scheme for setting up micro-enterprises in rural and urban areas, helping generate self-employment.",
    category: "MSME",
    benefits: "Subsidies ranging from 15% to 35% on project costs up to ₹50 Lakhs for manufacturing projects and ₹20 Lakhs for service projects.",
    eligibility_rules: {
      occupation: ["Entrepreneur", "Unemployed", "Self-Employed"],
      income_max: 1000000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "Project Report", "Education Certificate", "Caste Certificate", "Bank Passbook"],
    deadline: "2026-12-31",
    application_link: "https://www.kviconline.gov.in/"
  },
  {
    id: 15,
    name: "Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
    description: "Provides free health insurance coverage of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.",
    category: "MSME",
    benefits: "Cashless health cover of up to ₹5 Lakhs per family per year, covering pre-existing conditions and hospitalization costs.",
    eligibility_rules: {
      occupation: ["All"],
      income_max: 250000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 0,
      age_max: 120
    },
    required_documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    deadline: "2027-12-31",
    application_link: "https://pmjay.gov.in/"
  },
  {
    id: 16,
    name: "PM Vishwakarma Scheme",
    description: "A central scheme to support traditional artisans and craftspeople with skill training, toolkits, and collateral-free credit.",
    category: "Skill Development",
    benefits: "Skill training, stipend of ₹500/day during training, toolkit incentive of ₹15,000, and collateral-free credit support up to ₹3 Lakhs at 5% interest.",
    eligibility_rules: {
      occupation: ["Artisan", "Skilled Worker", "Self-Employed"],
      income_max: 300000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 65
    },
    required_documents: ["Aadhaar Card", "Bank Passbook", "Artisan Certificate / Trade Proof"],
    deadline: "2026-09-30",
    application_link: "https://pmvishwakarma.gov.in/"
  },
  {
    id: 17,
    name: "Agri-Clinics and Agri-Business Centres (ACABC) Scheme",
    description: "Promotes setting up agricultural ventures by trained agriculture graduates to support farming communities with expert advice and services.",
    category: "Farmer",
    benefits: "Capital subsidy of up to 36% (44% for women/SC/ST) on project costs up to ₹20 Lakhs for individuals and ₹100 Lakhs for groups.",
    eligibility_rules: {
      occupation: ["Farmer", "Entrepreneur"],
      education: ["Undergraduate", "Postgraduate"],
      income_max: 1200000,
      state: ["All"],
      gender: ["All"],
      age_min: 18,
      age_max: 50
    },
    required_documents: ["Aadhaar Card", "Agriculture Degree Certificate", "Project Report", "Bank Passbook"],
    deadline: "2026-10-31",
    application_link: "https://www.agriclinics.net/"
  },
  {
    id: 18,
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Provides credit guarantee to financial institutions to facilitate collateral-free debt flow to micro and small enterprises.",
    category: "MSME",
    benefits: "Guarantees credit up to ₹500 Lakhs (5 Crore) for micro and small enterprises without the need for collateral or third-party guarantees.",
    eligibility_rules: {
      occupation: ["Business Owner", "Founder"],
      income_max: 100000000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 65
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Business Registration Proof", "Detailed Project Report", "Audited Financials"],
    deadline: "2027-03-31",
    application_link: "https://www.cgtmse.in/"
  },
  {
    id: 19,
    name: "ASPIRE (Scheme for Promotion of Innovation, Rural Industries and Entrepreneurship)",
    description: "Sets up a network of technology business incubators and livelihood business incubators to promote entrepreneurship in agro-rural sectors.",
    category: "Startup",
    benefits: "Funding of up to ₹1 Crore for setting up Livelihood Business Incubators (LBI) and technology incubator setups.",
    eligibility_rules: {
      occupation: ["Founder", "Entrepreneur"],
      income_max: 20000000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "Company Registration", "Project proposal", "Bank Passbook"],
    deadline: "2026-12-31",
    application_link: "https://aspire.msme.gov.in/"
  },
  {
    id: 20,
    name: "Single Girl Child Scholarship (CBSE)",
    description: "A scholarship scheme intended to recognize the efforts of parents in promoting education among girls and provide encouragement to meritorious single girl students.",
    category: "Student",
    benefits: "₹500 per month for class XI and XII study, paid for a maximum period of two years.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Student"],
      education: ["School"],
      income_max: 600000,
      state: ["All"],
      age_min: 14,
      age_max: 19
    },
    required_documents: ["Aadhaar Card", "Student ID", "Affidavit for Single Girl Child", "Class X Mark Sheet", "Income Certificate"],
    deadline: "2026-09-30",
    application_link: "https://www.cbse.gov.in/"
  },
  {
    id: 21,
    name: "Post Matric Scholarship for SC/ST Students",
    description: "Provides financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stages.",
    category: "Student",
    benefits: "100% reimbursement of compulsory non-refundable fees charged by institutions and a monthly maintenance allowance up to ₹1,200.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate", "Postgraduate"],
      income_max: 250000,
      state: ["All"],
      gender: ["All"],
      age_min: 16,
      age_max: 30
    },
    required_documents: ["Aadhaar Card", "Student ID", "Category Certificate (SC/ST)", "Income Certificate", "Fee Receipt"],
    deadline: "2026-11-30",
    application_link: "https://scholarships.gov.in/"
  },
  {
    id: 22,
    name: "Mahila Coir Yojana",
    description: "A women-centric self-employment scheme in the coir industry providing training, stipends, and subsidized machinery to rural women artisans.",
    category: "Women",
    benefits: "75% subsidy on the cost of coir processing machinery and a training stipend of ₹3,000 per month.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Artisan", "Unemployed"],
      income_max: 200000,
      state: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 55
    },
    required_documents: ["Aadhaar Card", "Coir Board Registration Card", "Income Certificate", "Bank Passbook"],
    deadline: "2026-10-31",
    application_link: "https://coirboard.gov.in/"
  },
  {
    id: 23,
    name: "Agri-Business Incubator (ABI) Grant",
    description: "Supports development of agro-based startups through technical guidance, infrastructure facilities, and seed funding support.",
    category: "Farmer",
    benefits: "Grants up to ₹25 Lakhs for early-stage agritech startups for prototyping, business planning, and market validation.",
    eligibility_rules: {
      occupation: ["Founder", "Farmer", "Entrepreneur"],
      education: ["Undergraduate", "Postgraduate"],
      income_max: 15000000,
      state: ["All"],
      gender: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "DPIIT Recognition Certificate", "Detailed Agri-Business Plan"],
    deadline: "2026-11-30",
    application_link: "https://icar.org.in/"
  },
  {
    id: 24,
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    description: "Offers scholarships to meritorious students for pursuing Bachelor and Master level courses in Natural and Basic Sciences.",
    category: "Student",
    benefits: "₹80,000 per annum (₹60,000 cash scholarship + ₹20,000 mentorship grant for summer research projects).",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate"],
      income_max: 600000,
      state: ["All"],
      gender: ["All"],
      age_min: 17,
      age_max: 22
    },
    required_documents: ["Aadhaar Card", "Class XII Mark Sheet", "College Admission Proof", "Recommendation Letter"],
    deadline: "2026-11-15",
    application_link: "https://online-inspire.gov.in/"
  },
  {
    id: 25,
    name: "Saksham Scholarship Scheme for Specially Abled Students",
    description: "An AICTE scheme to support specially-abled students who are pursuing technical education at graduate or diploma level.",
    category: "Student",
    benefits: "₹50,000 per annum as support towards tuition fees, textbooks, computers, and medical equipment purchases.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate"],
      income_max: 800000,
      state: ["All"],
      gender: ["All"],
      age_min: 16,
      age_max: 30
    },
    required_documents: ["Aadhaar Card", "Student ID", "Disability Certificate (min 40%)", "Income Certificate", "Bank Passbook"],
    deadline: "2026-10-31",
    application_link: "https://www.aicte-india.org/"
  },
  {
    id: 26,
    name: "National Means-Cum-Merit Scholarship Scheme (NMMSS)",
    description: "Provides scholarships to meritorious students of economically weaker sections to arrest their drop-out at class VIII stage and encourage them to continue studies.",
    category: "Student",
    benefits: "₹12,000 per annum (₹1,000 per month) from class IX to XII in Government or Government-aided schools.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["School"],
      income_max: 350000,
      state: ["All"],
      gender: ["All"],
      age_min: 12,
      age_max: 16
    },
    required_documents: ["Aadhaar Card", "Student ID", "Class VIII Mark Sheet", "Income Certificate"],
    deadline: "2026-09-15",
    application_link: "https://scholarships.gov.in/"
  },
  {
    id: 27,
    name: "STEP (Support to Training and Employment Programme for Women)",
    description: "Aims to provide skills that give employability to women and to provide competencies and skills that enable women to become self-employed/entrepreneurs.",
    category: "Women",
    benefits: "Free training in diverse sectors like Agriculture, Horticulture, Food Processing, Handlooms, Tailoring, and IT with stipends.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Unemployed", "Self-Employed", "Artisan"],
      income_max: 150000,
      state: ["All"],
      education: ["All"],
      age_min: 16,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "Income Certificate", "Educational Certificates"],
    deadline: "2026-10-15",
    application_link: "https://wcd.nic.in/"
  },
  {
    id: 28,
    name: "PM YASASVI Scheme",
    description: "A scholarship scheme for OBC, EBC, and DNT students studying in Top Class schools and colleges across India.",
    category: "Student",
    benefits: "Up to ₹1,25,000 per annum for school students and up to ₹2,500 per month for college students to cover tuition fees and hostel charges.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["School", "Undergraduate"],
      income_max: 250000,
      state: ["All"],
      gender: ["All"],
      age_min: 14,
      age_max: 25
    },
    required_documents: ["Aadhaar Card", "Student ID", "Income Certificate", "Caste Certificate (OBC/EBC)"],
    deadline: "2026-10-31",
    application_link: "https://yet.nta.ac.in/"
  },
  {
    id: 29,
    name: "Rajasthan CM Higher Education Scholarship Scheme",
    description: "State-specific scheme in Rajasthan for meritorious students from low-income families pursuing college graduation.",
    category: "Student",
    benefits: "₹5,000 per annum (₹500/month for 10 months) for pursuing higher education in colleges.",
    eligibility_rules: {
      occupation: ["Student"],
      education: ["Undergraduate"],
      state: ["Rajasthan"],
      income_max: 250000,
      gender: ["All"],
      age_min: 17,
      age_max: 23
    },
    required_documents: ["Aadhaar Card", "Student ID", "Domicile Certificate of Rajasthan", "Class XII Mark Sheet", "Income Certificate"],
    deadline: "2026-11-30",
    application_link: "https://hte.rajasthan.gov.in/"
  },
  {
    id: 30,
    name: "Venture Capital Assistance Scheme",
    description: "Assistance in the form of interest-free loans provided by SFAC to agriculture graduates or farmers setting up agribusiness projects.",
    category: "Farmer",
    benefits: "Interest-free venture capital loan up to 26% of the project cost or ₹50 Lakhs (whichever is lower).",
    eligibility_rules: {
      occupation: ["Farmer", "Entrepreneur"],
      education: ["Undergraduate", "Postgraduate", "All"],
      income_max: 5000000,
      state: ["All"],
      gender: ["All"],
      age_min: 21,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "Bank Loan Sanction Letter", "Detailed Agribusiness Project Report", "Partnership/Incorporation Proof"],
    deadline: "2026-12-15",
    application_link: "https://sfacindia.com/"
  },
  {
    id: 31,
    name: "Mahila Udyam Nidhi Scheme",
    description: "A scheme managed by SIDBI to promote women entrepreneurs by offering soft loans to set up new tiny/micro units or modernize existing ones.",
    category: "Women",
    benefits: "Seed capital assistance up to 25% of project cost (max ₹2.5 Lakhs per project) at nominal 1% service charge.",
    eligibility_rules: {
      gender: ["Female"],
      occupation: ["Entrepreneur", "Founder"],
      income_max: 1500000,
      state: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 60
    },
    required_documents: ["Aadhaar Card", "PAN Card", "Business Project Profile", "SIDBI Application form"],
    deadline: "2027-03-31",
    application_link: "https://www.sidbi.in/"
  },
  {
    id: 32,
    name: "Atal Pension Yojana (APY)",
    description: "A pension scheme focusing on unorganized sector workers, providing a guaranteed minimum pension of ₹1,000 to ₹5,000 per month.",
    category: "MSME",
    benefits: "Guaranteed minimum pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 per month after age 60, depending on contributions.",
    eligibility_rules: {
      occupation: ["Self-Employed", "Street Vendor", "Artisan", "Skilled Worker", "Unemployed"],
      income_max: 300000,
      state: ["All"],
      gender: ["All"],
      education: ["All"],
      age_min: 18,
      age_max: 40
    },
    required_documents: ["Aadhaar Card", "Bank Savings Account details"],
    deadline: "2027-12-31",
    application_link: "https://www.npscra.nsdl.co.in/"
  }
];
