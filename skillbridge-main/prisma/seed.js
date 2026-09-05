const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SkillBridge Database Seeding...");

  // Clear existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.bridgeCourse.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.skillAssessment.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.studentProject.deleteMany();
  await prisma.studentCertification.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.institutionProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. CREATE USERS
  console.log("Creating core users...");
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@skillbridge.gov.in",
      passwordHash: defaultPassword,
      firstName: "Central",
      lastName: "Administrator",
      phone: "+911124651900",
      role: "ADMIN",
    },
  });

  const instUser1 = await prisma.user.create({
    data: {
      email: "director@nia.nic.in",
      passwordHash: defaultPassword,
      firstName: "Prof. Sanjeev",
      lastName: "Sharma",
      phone: "+911412635740",
      role: "INSTITUTION",
    },
  });

  const instUser2 = await prisma.user.create({
    data: {
      email: "dean@iitd.ac.in",
      passwordHash: defaultPassword,
      firstName: "Prof. Rangan",
      lastName: "Banerjee",
      phone: "+911126591000",
      role: "INSTITUTION",
    },
  });

  const facultyUser1 = await prisma.user.create({
    data: {
      email: "faculty.mentor@nia.nic.in",
      passwordHash: defaultPassword,
      firstName: "Dr. Arvind",
      lastName: "Tripathi",
      phone: "+911412635748",
      role: "FACULTY",
    },
  });

  const companyUser1 = await prisma.user.create({
    data: {
      email: "corporate.hr@dabur.com",
      passwordHash: defaultPassword,
      firstName: "Vikram",
      lastName: "Malhotra",
      phone: "+911203982000",
      role: "INDUSTRY",
    },
  });

  const companyUser2 = await prisma.user.create({
    data: {
      email: "campus.talent@himalayawellness.com",
      passwordHash: defaultPassword,
      firstName: "Ananya",
      lastName: "Deshmukh",
      phone: "+918067549999",
      role: "INDUSTRY",
    },
  });

  const studentUser1 = await prisma.user.create({
    data: {
      email: "aarav.sharma@student.nia.ac.in",
      passwordHash: defaultPassword,
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "+919876543210",
      role: "STUDENT",
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: "priya.nair@student.nia.ac.in",
      passwordHash: defaultPassword,
      firstName: "Priya",
      lastName: "Nair",
      phone: "+919876543211",
      role: "STUDENT",
    },
  });

  const studentUser3 = await prisma.user.create({
    data: {
      email: "rohan.verma@student.nia.ac.in",
      passwordHash: defaultPassword,
      firstName: "Rohan",
      lastName: "Verma",
      phone: "+919876543212",
      role: "STUDENT",
    },
  });

  // 2. CREATE INSTITUTION PROFILES
  console.log("Creating institutions...");
  const inst1 = await prisma.institutionProfile.create({
    data: {
      userId: instUser1.id,
      aisheCode: "U-0465",
      name: "National Institute of Ayurveda (Deemed University)",
      type: "AYUSH_INSTITUTE",
      category: "Ayush & Allied Sciences",
      accreditationGrade: "NAAC A++",
      website: "https://nia.nic.in",
      city: "Jaipur",
      state: "Rajasthan",
      isVerified: true,
    },
  });

  const inst2 = await prisma.institutionProfile.create({
    data: {
      userId: instUser2.id,
      aisheCode: "U-0100",
      name: "Indian Institute of Technology (IIT) Delhi",
      type: "CENTRAL_UNIVERSITY",
      category: "Engineering & Technology",
      accreditationGrade: "NIRF Rank 2",
      website: "https://iitd.ac.in",
      city: "New Delhi",
      state: "Delhi",
      isVerified: true,
    },
  });

  // 3. CREATE FACULTY PROFILES
  console.log("Creating faculty profiles...");
  const facultyProfile1 = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser1.id,
      institutionId: inst1.id,
      department: "Dravyaguna Vigyana (Pharmacology)",
      designation: "Associate Professor & TPO Coordinator",
      experienceYears: 12,
      specialization: "Herbal Drug Standardization & Clinical Phytotherapy",
      researchDomains: "Phytochemistry, Herbal Pharmacovigilance, GCP Trials",
      isTpoOfficer: true,
    },
  });

  // 4. CREATE COMPANY PROFILES
  console.log("Creating corporate profiles...");
  const comp1 = await prisma.companyProfile.create({
    data: {
      userId: companyUser1.id,
      companyName: "Dabur India Limited",
      cinNumber: "L24230DL1975PLC007908",
      gstin: "07AAACD1234F1Z1",
      domain: "AYUSH_PHARMA",
      size: "ENTERPRISE",
      website: "https://www.dabur.com",
      description: "India's premier science-based natural health and Ayurvedic enterprise operating in over 120 countries.",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      isVerified: true,
    },
  });

  const comp2 = await prisma.companyProfile.create({
    data: {
      userId: companyUser2.id,
      companyName: "Himalaya Wellness Company",
      cinNumber: "U24231KA1930PTC001234",
      gstin: "29AAACH4567G1Z8",
      domain: "HERBAL_RESEARCH",
      size: "ENTERPRISE",
      website: "https://himalayawellness.in",
      description: "Pioneering global herbal pharmaceutical, therapeutic wellness, and personal care solutions since 1930.",
      city: "Bengaluru",
      state: "Karnataka",
      isVerified: true,
    },
  });

  // 5. CREATE STUDENT PROFILES
  console.log("Creating student profiles...");
  const studentProfile1 = await prisma.studentProfile.create({
    data: {
      userId: studentUser1.id,
      institutionId: inst1.id,
      department: "Dravyaguna Vigyana",
      degree: "Bachelor of Ayurvedic Medicine & Surgery (BAMS)",
      graduationYear: 2026,
      rollNumber: "NIA-BAMS-23-042",
      cgpa: 8.85,
      activeBacklogs: 0,
      readinessScore: 88,
      resumeUrl: "https://cdn.portal.edu/resumes/aarav_sharma.pdf",
      portfolioUrl: "/portfolio/aarav-sharma",
      linkedinUrl: "https://linkedin.com/in/aarav-sharma-ayush",
      bio: "Final-year BAMS student passionate about evidence-based clinical Ayurveda, Panchakarma therapeutics, and pharmacological validation.",
      placementStatus: "SEEKING",
    },
  });

  const studentProfile2 = await prisma.studentProfile.create({
    data: {
      userId: studentUser2.id,
      institutionId: inst1.id,
      department: "Rasashastra & Bhaishajya Kalpana",
      degree: "M.Pharm (Ayurveda) - Drug Standardization",
      graduationYear: 2026,
      rollNumber: "NIA-MPH-24-015",
      cgpa: 9.30,
      activeBacklogs: 0,
      readinessScore: 94,
      resumeUrl: "https://cdn.portal.edu/resumes/priya_nair.pdf",
      portfolioUrl: "/portfolio/priya-nair",
      linkedinUrl: "https://linkedin.com/in/priya-nair-herbalchem",
      bio: "Postgraduate researcher specializing in High Performance Liquid Chromatography (HPLC), botanical standardization, and Schedule T GMP compliance.",
      placementStatus: "INTERNING",
    },
  });

  const studentProfile3 = await prisma.studentProfile.create({
    data: {
      userId: studentUser3.id,
      institutionId: inst1.id,
      department: "Panchakarma & Clinical Studies",
      degree: "BAMS",
      graduationYear: 2026,
      rollNumber: "NIA-BAMS-23-089",
      cgpa: 7.20,
      activeBacklogs: 1,
      readinessScore: 65,
      resumeUrl: "https://cdn.portal.edu/resumes/rohan_verma.pdf",
      placementStatus: "SEEKING",
    },
  });

  // 6. SKILL CATEGORIES & SKILLS
  console.log("Creating skill taxonomy...");
  const catPhyto = await prisma.skillCategory.create({
    data: {
      name: "Botanical & Phytochemical Analysis",
      description: "Analytical laboratory procedures for qualitative and quantitative herbal profiling",
    },
  });

  const catClin = await prisma.skillCategory.create({
    data: {
      name: "Clinical Protocols & Therapeutics",
      description: "Patient diagnosis, Panchakarma therapies, and clinical case documentation",
    },
  });

  const catReg = await prisma.skillCategory.create({
    data: {
      name: "Regulatory Affairs & GMP Compliance",
      description: "Schedule T, WHO-GMP, pharmacovigilance, and ethics committee filings",
    },
  });

  const catTech = await prisma.skillCategory.create({
    data: {
      name: "Digital Health & Data Analytics",
      description: "Electronic Health Records (A-HMIS), biostatistics in R/Python, and clinical trials management",
    },
  });

  const catSoft = await prisma.skillCategory.create({
    data: {
      name: "Professional Communication & Ethics",
      description: "Scientific paper writing, cross-disciplinary collaboration, and clinical presentation",
    },
  });

  // Specific Skills
  const sHPLC = await prisma.skill.create({
    data: {
      categoryId: catPhyto.id,
      code: "PHYTO-HPLC-01",
      name: "High-Performance Liquid Chromatography (HPLC)",
      description: "Analytical chromatographic separation and standardization of active phytoconstituents",
      demandWeight: 4.8,
    },
  });

  const sExtract = await prisma.skill.create({
    data: {
      categoryId: catPhyto.id,
      code: "PHYTO-EXTR-02",
      name: "Botanical Extraction & Phyto-Fingerprinting",
      description: "Standardized hydro-ethanolic extraction, TLC and HPTLC fingerprinting",
      demandWeight: 4.3,
    },
  });

  const sPanch = await prisma.skill.create({
    data: {
      categoryId: catClin.id,
      code: "CLIN-PANCH-01",
      name: "Panchakarma Protocol Administration",
      description: "Supervised clinical delivery of Purvakarma, Pradhanakarma, and Paschatkarma",
      demandWeight: 4.9,
    },
  });

  const sGCP = await prisma.skill.create({
    data: {
      categoryId: catReg.id,
      code: "REG-GCP-01",
      name: "Good Clinical Practice (GCP) & ADR Reporting",
      description: "Pharmacovigilance monitoring and regulatory adverse event reporting for herbal drugs",
      demandWeight: 4.7,
    },
  });

  const sEHR = await prisma.skill.create({
    data: {
      categoryId: catTech.id,
      code: "DATA-EHR-01",
      name: "Ayush Hospital Management Information Systems (A-HMIS)",
      description: "Electronic patient charting and digital diagnostic reporting",
      demandWeight: 4.1,
    },
  });

  const sBiostat = await prisma.skill.create({
    data: {
      categoryId: catTech.id,
      code: "DATA-BIOSTAT-02",
      name: "Biostatistics in Clinical Trials (Python / R)",
      description: "Hypothesis testing, survival curves, and randomized controlled trial efficacy metrics",
      demandWeight: 4.6,
    },
  });

  const sSciWrite = await prisma.skill.create({
    data: {
      categoryId: catSoft.id,
      code: "COMM-SCIW-01",
      name: "Medical & Scientific Manuscript Writing",
      description: "Preparation of indexed research papers, clinical trial protocols, and dossiers",
      demandWeight: 4.2,
    },
  });

  // Bridge Courses
  console.log("Creating bridge courses...");
  await prisma.bridgeCourse.createMany({
    data: [
      {
        skillId: sHPLC.id,
        title: "Modern Instrumental Methods of Herbal Drug Analysis",
        provider: "Swayam / NPTEL (IIT Kharagpur)",
        url: "https://swayam.gov.in/herbal-analysis",
        estimatedHours: 30,
        cost: "FREE",
        rating: 4.8,
      },
      {
        skillId: sGCP.id,
        title: "Clinical Research & Pharmacovigilance in Traditional Medicine",
        provider: "CCRAS National Training Portal",
        url: "https://ccras.res.in/gcp-training",
        estimatedHours: 20,
        cost: "FREE",
        rating: 4.9,
      },
      {
        skillId: sBiostat.id,
        title: "Introduction to Biostatistics for Clinical Health Trials",
        provider: "Coursera (Johns Hopkins)",
        url: "https://coursera.org/biostats-clinical",
        estimatedHours: 25,
        cost: "SUBSIDIZED",
        rating: 4.7,
      },
    ],
  });

  // Assign Student Skills
  console.log("Assigning verified student skills...");
  await prisma.studentSkill.createMany({
    data: [
      // Aarav
      {
        studentId: studentProfile1.id,
        skillId: sPanch.id,
        proficiencyLevel: "EXPERT",
        proficiencyScore: 92,
        verificationSource: "FACULTY_VERIFIED",
        verifiedAt: new Date(),
      },
      {
        studentId: studentProfile1.id,
        skillId: sGCP.id,
        proficiencyLevel: "INTERMEDIATE",
        proficiencyScore: 75,
        verificationSource: "ASSESSMENT_TESTED",
        verifiedAt: new Date(),
      },
      {
        studentId: studentProfile1.id,
        skillId: sEHR.id,
        proficiencyLevel: "ADVANCED",
        proficiencyScore: 88,
        verificationSource: "FACULTY_VERIFIED",
        verifiedAt: new Date(),
      },

      // Priya
      {
        studentId: studentProfile2.id,
        skillId: sHPLC.id,
        proficiencyLevel: "EXPERT",
        proficiencyScore: 98,
        verificationSource: "FACULTY_VERIFIED",
        verifiedAt: new Date(),
      },
      {
        studentId: studentProfile2.id,
        skillId: sExtract.id,
        proficiencyLevel: "ADVANCED",
        proficiencyScore: 90,
        verificationSource: "FACULTY_VERIFIED",
        verifiedAt: new Date(),
      },
      {
        studentId: studentProfile2.id,
        skillId: sSciWrite.id,
        proficiencyLevel: "ADVANCED",
        proficiencyScore: 85,
        verificationSource: "SELF_REPORTED",
      },

      // Rohan (has skill gaps)
      {
        studentId: studentProfile3.id,
        skillId: sPanch.id,
        proficiencyLevel: "BEGINNER",
        proficiencyScore: 55,
        verificationSource: "SELF_REPORTED",
      },
    ],
  });

  // 7. ASSESSMENTS & QUESTIONS
  console.log("Creating assessments and questions...");
  const assessment1 = await prisma.skillAssessment.create({
    data: {
      skillId: sHPLC.id,
      title: "HPLC Standardization & Chromatography Assessment",
      description: "Evaluate your hands-on theoretical knowledge of mobile phase preparation, retention times, and peak resolution.",
      category: "TECHNICAL",
      totalQuestions: 3,
      passingScore: 65,
      durationMinutes: 15,
      difficulty: "INTERMEDIATE",
    },
  });

  await prisma.assessmentQuestion.createMany({
    data: [
      {
        assessmentId: assessment1.id,
        questionText: "In reverse-phase HPLC (RP-HPLC) for botanical extracts, which type of stationary phase is most standardly utilized?",
        optionA: "Silica gel with polar functional groups",
        optionB: "Octadecylsilane (C18) non-polar bonded phase",
        optionC: "Alumina basic matrix",
        optionD: "Dextran gel filtration beads",
        correctAnswer: "B",
        explanation: "C18 (Octadecylsilane) is the gold standard non-polar stationary phase in RP-HPLC for isolating botanical phytocompounds.",
      },
      {
        assessmentId: assessment1.id,
        questionText: "What does the resolution factor (Rs) measure in a chromatographic separation?",
        optionA: "The degree of separation between two adjacent peaks",
        optionB: "The total volume of solvent pumped",
        optionC: "The detector temperature stability",
        optionD: "The sample injection volume error",
        correctAnswer: "A",
        explanation: "Rs > 1.5 indicates baseline separation between two adjacent chromatographic peaks.",
      },
      {
        assessmentId: assessment1.id,
        questionText: "Which detector is most universally applied for detecting polyphenolic herbal markers absorbing in UV light?",
        optionA: "Refractive Index Detector (RID)",
        optionB: "Photodiode Array Detector (PDA/DAD)",
        optionC: "Flame Ionization Detector (FID)",
        optionD: "Thermal Conductivity Detector (TCD)",
        correctAnswer: "B",
        explanation: "PDA/DAD allows multi-wavelength ultraviolet scanning simultaneously across the spectrum.",
      },
    ],
  });

  // Assessment Attempts
  await prisma.assessmentAttempt.create({
    data: {
      studentId: studentProfile2.id,
      assessmentId: assessment1.id,
      scorePercentage: 100.0,
      isPassed: true,
    },
  });

  // 8. OPPORTUNITIES (Internships, Jobs, Faculty FDP)
  console.log("Creating opportunities...");
  const opp1 = await prisma.opportunity.create({
    data: {
      companyId: comp1.id,
      title: "Clinical Research Associate & Pharmacovigilance Intern",
      type: "INTERNSHIP",
      workMode: "HYBRID",
      description: "Join Dabur Research & Development Centre to document and monitor clinical safety evidence for proprietary Ayurvedic therapeutic formulations.",
      responsibilities: "Conduct ADR signal monitoring, review clinical trial case report forms (CRFs), coordinate with ethics committees, and draft GCP compliance reports.",
      eligibility: "Final-year BAMS or MD Ayurveda candidates with minimum 7.0 CGPA.",
      minCgpa: 7.0,
      stipendOrSalary: "₹35,000 / month",
      vacancies: 4,
      durationMonths: 6,
      location: "Kaushambi, Ghaziabad (NCR)",
      deadline: new Date("2026-11-30"),
      status: "OPEN",
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: opp1.id, skillId: sGCP.id, criticality: "MANDATORY", weightage: 40 },
      { opportunityId: opp1.id, skillId: sPanch.id, criticality: "MANDATORY", weightage: 30 },
      { opportunityId: opp1.id, skillId: sEHR.id, criticality: "PREFERRED", weightage: 20 },
      { opportunityId: opp1.id, skillId: sSciWrite.id, criticality: "OPTIONAL", weightage: 10 },
    ],
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      companyId: comp2.id,
      title: "Phytochemical Quality Analyst & Standardization Intern",
      type: "INTERNSHIP",
      workMode: "ONSITE",
      description: "Gain hands-on industrial laboratory exposure at Himalaya R&D labs running analytical HPLC and HPTLC fingerprinting for raw herbal drugs.",
      responsibilities: "Analyze raw herbal batches, validate active chemical markers, maintain laboratory GLP records, and assist with Schedule T quality files.",
      eligibility: "M.Pharm (Ayurveda), B.Pharm, or BAMS graduates with chromatography coursework.",
      minCgpa: 7.5,
      stipendOrSalary: "₹30,000 / month",
      vacancies: 2,
      durationMonths: 6,
      location: "Makali, Bengaluru",
      deadline: new Date("2026-10-31"),
      status: "OPEN",
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: opp2.id, skillId: sHPLC.id, criticality: "MANDATORY", weightage: 50 },
      { opportunityId: opp2.id, skillId: sExtract.id, criticality: "MANDATORY", weightage: 30 },
      { opportunityId: opp2.id, skillId: sSciWrite.id, criticality: "PREFERRED", weightage: 20 },
    ],
  });

  const opp3 = await prisma.opportunity.create({
    data: {
      companyId: comp1.id,
      title: "Senior Ayurvedic Medical Advisor - Clinical Formulations",
      type: "JOB",
      workMode: "ONSITE",
      description: "Full-time campus placement role at Dabur's healthcare division for designing integrative therapeutics and conducting clinical documentation.",
      responsibilities: "Lead clinical advisory for consumer wellness ranges, review formulation efficacy portfolios, and interface with medical practitioners.",
      eligibility: "MD Ayurveda or top-percentile BAMS graduates with clinical research exposure.",
      minCgpa: 8.0,
      stipendOrSalary: "₹9.5 LPA",
      vacancies: 3,
      location: "New Delhi",
      deadline: new Date("2026-12-15"),
      status: "OPEN",
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: opp3.id, skillId: sPanch.id, criticality: "MANDATORY", weightage: 40 },
      { opportunityId: opp3.id, skillId: sGCP.id, criticality: "MANDATORY", weightage: 35 },
      { opportunityId: opp3.id, skillId: sSciWrite.id, criticality: "PREFERRED", weightage: 25 },
    ],
  });

  const oppFacultyFDP = await prisma.opportunity.create({
    data: {
      companyId: comp2.id,
      title: "Industry Immersion & Faculty Development Program on Advanced Phytochemical GLP",
      type: "FACULTY_FDP",
      workMode: "ONSITE",
      description: "Exclusive 3-week corporate immersion program for university professors and researchers to study industrial scale botanical processing.",
      responsibilities: "Participate in pilot plant validation, co-design curriculum modules for university students, and explore joint research grants.",
      eligibility: "Faculty members with min. 3 years academic teaching experience in Ayush or Pharmacy departments.",
      stipendOrSalary: "Fully Sponsored (Travel + Accommodation + Honorarium ₹45,000)",
      vacancies: 8,
      durationMonths: 1,
      location: "Bengaluru R&D Campus",
      deadline: new Date("2026-11-15"),
      status: "OPEN",
    },
  });

  // 9. APPLICATIONS
  console.log("Creating applications and tracking...");
  const app1 = await prisma.application.create({
    data: {
      opportunityId: opp1.id,
      studentId: studentProfile1.id,
      coverLetter: "I am excited to apply for the Clinical Research Internship at Dabur R&D. My clinical training at NIA and certified GCP knowledge align with your study protocols.",
      resumeUrl: "https://cdn.portal.edu/resumes/aarav_sharma.pdf",
      matchScore: 92.0,
      status: "SHORTLISTED",
    },
  });

  const app2 = await prisma.application.create({
    data: {
      opportunityId: opp2.id,
      studentId: studentProfile2.id,
      coverLetter: "With expertise in HPLC standardization and thesis work on herbal bio-markers, I look forward to contributing to Himalaya's analytical laboratory.",
      resumeUrl: "https://cdn.portal.edu/resumes/priya_nair.pdf",
      matchScore: 96.0,
      status: "INTERVIEW",
    },
  });

  // Scheduled interview for Priya
  await prisma.interview.create({
    data: {
      applicationId: app2.id,
      roundTitle: "Technical Chromatography Viva & Lab Assessment",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      durationMins: 45,
      meetingLink: "https://meet.google.com/hml-ayur-int",
      interviewer: "Dr. Ananya Deshmukh (R&D Lead)",
      status: "SCHEDULED",
    },
  });

  // 10. COLLABORATIONS & MOUS
  console.log("Creating MoUs and collaborations...");
  await prisma.collaboration.create({
    data: {
      institutionId: inst1.id,
      companyId: comp1.id,
      title: "Strategic MoU: Joint Clinical Drug Validation & Guaranteed Student Quota",
      type: "MOU",
      scope: "Establishment of collaborative pharmacovigilance center, faculty guest lectures, and 15 annual guaranteed student internships.",
      budget: 2500000.0,
      quota: 15,
      status: "ACTIVE",
    },
  });

  await prisma.collaboration.create({
    data: {
      institutionId: inst1.id,
      companyId: comp2.id,
      title: "Sponsored R&D Project: Standardization of Polyherbal Formulations",
      type: "JOINT_RESEARCH",
      scope: "High-throughput chromatographic fingerprinting of Ayurvedic botanical compounds with student junior research fellowships.",
      budget: 1800000.0,
      quota: 10,
      status: "ACTIVE",
    },
  });

  // 11. NOTIFICATIONS & AUDIT LOGS
  console.log("Creating initial notifications & audit logs...");
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser1.id,
        title: "Application Shortlisted!",
        message: "Dabur India has shortlisted your application for Clinical Research & Pharmacovigilance Associate Intern.",
        link: "/dashboard/student",
        type: "APPLICATION",
      },
      {
        userId: studentUser2.id,
        title: "Interview Scheduled",
        message: "Your Technical Chromatography round with Himalaya Wellness is scheduled for Friday at 11:00 AM.",
        link: "/dashboard/student",
        type: "INTERVIEW",
      },
      {
        userId: companyUser1.id,
        title: "New 92% Matched Applicant",
        message: "Aarav Sharma has applied for the Clinical Research Internship with 92% skill compatibility.",
        link: "/dashboard/industry",
        type: "MATCH",
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "SYSTEM_INITIALIZED",
      entity: "SYSTEM",
      entityId: "GENESIS",
      payload: JSON.stringify({ message: "SkillBridge database initialized with production seed data" }),
    },
  });

  console.log("✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
