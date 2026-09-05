const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SkillBridge database...");

  // Clear all tables
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.bridgeCourse.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.skillAssessment.deleteMany();
  await prisma.profileVisibility.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.studentProject.deleteMany();
  await prisma.studentCertification.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.application.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.institutionProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  // ── SKILL CATEGORIES ──
  const catData = [
    { name: "Programming Languages" },
    { name: "Web Development" },
    { name: "Backend & APIs" },
    { name: "Databases" },
    { name: "Cloud & DevOps" },
    { name: "AI & Machine Learning" },
    { name: "Data & Analytics" },
    { name: "Mobile Development" },
    { name: "Cybersecurity" },
    { name: "Design & UX" },
    { name: "Soft Skills" },
    { name: "Domain Knowledge" },
  ];

  const cats = await Promise.all(catData.map(c => prisma.skillCategory.create({ data: c })));
  const catMap = {};
  cats.forEach(c => catMap[c.name] = c.id);
  console.log("✅ Created skill categories");

  // ── SKILLS ──
  const skillsData = [
    // Programming
    { code: "PYTHON", name: "Python", categoryId: catMap["Programming Languages"], demandWeight: 1.5 },
    { code: "JAVA", name: "Java", categoryId: catMap["Programming Languages"], demandWeight: 1.4 },
    { code: "JS", name: "JavaScript", categoryId: catMap["Programming Languages"], demandWeight: 1.5 },
    { code: "TS", name: "TypeScript", categoryId: catMap["Programming Languages"], demandWeight: 1.3 },
    { code: "CPP", name: "C++", categoryId: catMap["Programming Languages"], demandWeight: 1.2 },
    { code: "CSHARP", name: "C#", categoryId: catMap["Programming Languages"], demandWeight: 1.1 },
    { code: "GO", name: "Go (Golang)", categoryId: catMap["Programming Languages"], demandWeight: 1.3 },
    { code: "RUST", name: "Rust", categoryId: catMap["Programming Languages"], demandWeight: 1.2 },
    // Web
    { code: "HTML", name: "HTML", categoryId: catMap["Web Development"], demandWeight: 1.2 },
    { code: "CSS", name: "CSS", categoryId: catMap["Web Development"], demandWeight: 1.2 },
    { code: "REACT", name: "React", categoryId: catMap["Web Development"], demandWeight: 1.6 },
    { code: "NEXTJS", name: "Next.js", categoryId: catMap["Web Development"], demandWeight: 1.4 },
    { code: "ANGULAR", name: "Angular", categoryId: catMap["Web Development"], demandWeight: 1.2 },
    { code: "VUE", name: "Vue.js", categoryId: catMap["Web Development"], demandWeight: 1.1 },
    { code: "TAILWIND", name: "Tailwind CSS", categoryId: catMap["Web Development"], demandWeight: 1.2 },
    // Backend
    { code: "NODEJS", name: "Node.js", categoryId: catMap["Backend & APIs"], demandWeight: 1.5 },
    { code: "EXPRESS", name: "Express.js", categoryId: catMap["Backend & APIs"], demandWeight: 1.3 },
    { code: "DJANGO", name: "Django", categoryId: catMap["Backend & APIs"], demandWeight: 1.2 },
    { code: "FASTAPI", name: "FastAPI", categoryId: catMap["Backend & APIs"], demandWeight: 1.2 },
    { code: "RESTAPI", name: "REST API", categoryId: catMap["Backend & APIs"], demandWeight: 1.4 },
    { code: "GRAPHQL", name: "GraphQL", categoryId: catMap["Backend & APIs"], demandWeight: 1.2 },
    { code: "SPRING", name: "Spring Boot", categoryId: catMap["Backend & APIs"], demandWeight: 1.3 },
    // DB
    { code: "MYSQL", name: "MySQL", categoryId: catMap["Databases"], demandWeight: 1.3 },
    { code: "POSTGRES", name: "PostgreSQL", categoryId: catMap["Databases"], demandWeight: 1.4 },
    { code: "MONGODB", name: "MongoDB", categoryId: catMap["Databases"], demandWeight: 1.3 },
    { code: "REDIS", name: "Redis", categoryId: catMap["Databases"], demandWeight: 1.1 },
    { code: "SQL", name: "SQL", categoryId: catMap["Databases"], demandWeight: 1.5 },
    // Cloud/DevOps
    { code: "AWS", name: "AWS", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.6 },
    { code: "GCP", name: "Google Cloud", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.3 },
    { code: "AZURE", name: "Microsoft Azure", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.3 },
    { code: "DOCKER", name: "Docker", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.4 },
    { code: "K8S", name: "Kubernetes", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.4 },
    { code: "GIT", name: "Git", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.3 },
    { code: "CICD", name: "CI/CD", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.3 },
    { code: "LINUX", name: "Linux", categoryId: catMap["Cloud & DevOps"], demandWeight: 1.2 },
    // AI/ML
    { code: "ML", name: "Machine Learning", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.5 },
    { code: "DL", name: "Deep Learning", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.4 },
    { code: "NLP", name: "NLP", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.3 },
    { code: "TF", name: "TensorFlow", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.3 },
    { code: "PYTORCH", name: "PyTorch", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.3 },
    { code: "GENAI", name: "Generative AI", categoryId: catMap["AI & Machine Learning"], demandWeight: 1.5 },
    // Data
    { code: "PANDAS", name: "Pandas", categoryId: catMap["Data & Analytics"], demandWeight: 1.3 },
    { code: "NUMPY", name: "NumPy", categoryId: catMap["Data & Analytics"], demandWeight: 1.2 },
    { code: "TABLEAU", name: "Tableau", categoryId: catMap["Data & Analytics"], demandWeight: 1.2 },
    { code: "POWERBI", name: "Power BI", categoryId: catMap["Data & Analytics"], demandWeight: 1.2 },
    { code: "STATS", name: "Statistics", categoryId: catMap["Data & Analytics"], demandWeight: 1.3 },
    // Mobile
    { code: "FLUTTER", name: "Flutter", categoryId: catMap["Mobile Development"], demandWeight: 1.3 },
    { code: "REACTNATIVE", name: "React Native", categoryId: catMap["Mobile Development"], demandWeight: 1.3 },
    { code: "ANDROID", name: "Android Development", categoryId: catMap["Mobile Development"], demandWeight: 1.2 },
    // Security
    { code: "NETSEC", name: "Network Security", categoryId: catMap["Cybersecurity"], demandWeight: 1.3 },
    { code: "PENTEST", name: "Penetration Testing", categoryId: catMap["Cybersecurity"], demandWeight: 1.3 },
    // Design
    { code: "FIGMA", name: "Figma", categoryId: catMap["Design & UX"], demandWeight: 1.3 },
    { code: "UXRESEARCH", name: "User Research", categoryId: catMap["Design & UX"], demandWeight: 1.2 },
    // Soft
    { code: "COMM", name: "Communication", categoryId: catMap["Soft Skills"], demandWeight: 1.0 },
    { code: "LEADERSHIP", name: "Leadership", categoryId: catMap["Soft Skills"], demandWeight: 1.0 },
    { code: "PROBLEMSOLVING", name: "Problem Solving", categoryId: catMap["Soft Skills"], demandWeight: 1.1 },
  ];

  const skills = await Promise.all(
    skillsData.map(s => prisma.skill.create({ data: s }))
  );
  const skillMap = {};
  skills.forEach(s => { skillMap[s.code] = s.id; });
  console.log(`✅ Created ${skills.length} skills`);

  // ── INSTITUTIONS ──
  const pw = await bcrypt.hash("Demo@1234", 10);

  const instUsers = await Promise.all([
    prisma.user.create({ data: { email: "iit.delhi@skillbridge.in", passwordHash: pw, firstName: "IIT", lastName: "Delhi", role: "INSTITUTION" } }),
    prisma.user.create({ data: { email: "nit.trichy@skillbridge.in", passwordHash: pw, firstName: "NIT", lastName: "Trichy", role: "INSTITUTION" } }),
    prisma.user.create({ data: { email: "vit.vellore@skillbridge.in", passwordHash: pw, firstName: "VIT", lastName: "Vellore", role: "INSTITUTION" } }),
    prisma.user.create({ data: { email: "srm.kattankulathur@skillbridge.in", passwordHash: pw, firstName: "SRM", lastName: "Institute", role: "INSTITUTION" } }),
  ]);

  const institutions = await Promise.all([
    prisma.institutionProfile.create({ data: { userId: instUsers[0].id, aisheCode: "IIT-DEL-001", name: "Indian Institute of Technology Delhi", type: "IIT", city: "New Delhi", state: "Delhi", accreditationGrade: "A++", website: "https://www.iitd.ac.in", isVerified: true } }),
    prisma.institutionProfile.create({ data: { userId: instUsers[1].id, aisheCode: "NIT-TRI-001", name: "National Institute of Technology Tiruchirappalli", type: "NIT", city: "Tiruchirappalli", state: "Tamil Nadu", accreditationGrade: "A+", website: "https://www.nitt.edu", isVerified: true } }),
    prisma.institutionProfile.create({ data: { userId: instUsers[2].id, aisheCode: "VIT-VEL-001", name: "VIT University Vellore", type: "Deemed University", city: "Vellore", state: "Tamil Nadu", accreditationGrade: "A++", website: "https://www.vit.ac.in", isVerified: true } }),
    prisma.institutionProfile.create({ data: { userId: instUsers[3].id, aisheCode: "SRM-KAT-001", name: "SRM Institute of Science and Technology", type: "Deemed University", city: "Kattankulathur", state: "Tamil Nadu", accreditationGrade: "A+", website: "https://www.srmist.edu.in", isVerified: true } }),
  ]);
  console.log("✅ Created institutions");

  // ── COMPANIES ──
  const companyUsers = await Promise.all([
    prisma.user.create({ data: { email: "hr@tcs.com", passwordHash: pw, firstName: "TCS", lastName: "Recruiter", role: "INDUSTRY" } }),
    prisma.user.create({ data: { email: "hr@infosys.com", passwordHash: pw, firstName: "Infosys", lastName: "Recruiter", role: "INDUSTRY" } }),
    prisma.user.create({ data: { email: "talent@microsoft.com", passwordHash: pw, firstName: "Microsoft", lastName: "Talent", role: "INDUSTRY" } }),
    prisma.user.create({ data: { email: "university@google.com", passwordHash: pw, firstName: "Google", lastName: "University", role: "INDUSTRY" } }),
    prisma.user.create({ data: { email: "campus@amazon.in", passwordHash: pw, firstName: "Amazon", lastName: "Campus", role: "INDUSTRY" } }),
    prisma.user.create({ data: { email: "intern@flipkart.com", passwordHash: pw, firstName: "Flipkart", lastName: "Intern", role: "INDUSTRY" } }),
  ]);

  const companies = await Promise.all([
    prisma.companyProfile.create({ data: { userId: companyUsers[0].id, companyName: "Tata Consultancy Services", domain: "IT_SERVICES", size: "ENTERPRISE", website: "https://tcs.com", city: "Mumbai", state: "Maharashtra", isVerified: true, description: "Global IT services, consulting and business solutions" } }),
    prisma.companyProfile.create({ data: { userId: companyUsers[1].id, companyName: "Infosys Limited", domain: "IT_SERVICES", size: "ENTERPRISE", website: "https://infosys.com", city: "Bengaluru", state: "Karnataka", isVerified: true, description: "Digital services and consulting company" } }),
    prisma.companyProfile.create({ data: { userId: companyUsers[2].id, companyName: "Microsoft India", domain: "CLOUD_COMPUTING", size: "ENTERPRISE", website: "https://microsoft.com", city: "Hyderabad", state: "Telangana", isVerified: true, description: "Technology company empowering every person and organization" } }),
    prisma.companyProfile.create({ data: { userId: companyUsers[3].id, companyName: "Google India", domain: "AI_ML", size: "ENTERPRISE", website: "https://careers.google.com", city: "Bengaluru", state: "Karnataka", isVerified: true, description: "Organizing the world's information and making it accessible" } }),
    prisma.companyProfile.create({ data: { userId: companyUsers[4].id, companyName: "Amazon India", domain: "E_COMMERCE", size: "ENTERPRISE", website: "https://amazon.jobs", city: "Bengaluru", state: "Karnataka", isVerified: true, description: "Customer-centric global technology leader" } }),
    prisma.companyProfile.create({ data: { userId: companyUsers[5].id, companyName: "Flipkart", domain: "E_COMMERCE", size: "ENTERPRISE", website: "https://flipkart.com", city: "Bengaluru", state: "Karnataka", isVerified: true, description: "India's leading e-commerce marketplace" } }),
  ]);
  console.log("✅ Created companies");

  // ── DEMO STUDENTS ──
  const studentUsers = await Promise.all([
    prisma.user.create({ data: { email: "aarav.sharma@demo.in", passwordHash: pw, firstName: "Aarav", lastName: "Sharma", phone: "9876543210", role: "STUDENT" } }),
    prisma.user.create({ data: { email: "priya.nair@demo.in", passwordHash: pw, firstName: "Priya", lastName: "Nair", phone: "9876543211", role: "STUDENT" } }),
    prisma.user.create({ data: { email: "rahul.mehta@demo.in", passwordHash: pw, firstName: "Rahul", lastName: "Mehta", phone: "9876543212", role: "STUDENT" } }),
  ]);

  const studentProfiles = await Promise.all([
    prisma.studentProfile.create({
      data: {
        userId: studentUsers[0].id,
        institutionId: institutions[0].id,
        department: "Computer Science & Engineering",
        degree: "B.Tech",
        graduationYear: 2026,
        currentYear: "3rd Year",
        currentSemester: 6,
        cgpa: 8.9,
        activeBacklogs: 0,
        rollNumber: "CSE-21-0042",
        headline: "Aspiring Full Stack Developer | B.Tech CSE 2026 | IIT Delhi",
        summary: "Passionate about building scalable web apps. Experience in React, Node.js and PostgreSQL. Looking for full-stack internship opportunities.",
        careerInterests: JSON.stringify(["Web Development", "Cloud Computing", "Open Source"]),
        preferredRoles: JSON.stringify(["Full Stack Developer", "Backend Developer"]),
        preferredIndustries: JSON.stringify(["Product", "SaaS", "Fintech"]),
        preferredLocations: JSON.stringify(["Bengaluru", "Hyderabad", "Remote"]),
        internshipPref: "HYBRID",
        employmentPref: "FULL_TIME",
        githubUrl: "https://github.com/aarav-sharma",
        linkedinUrl: "https://linkedin.com/in/aarav-sharma",
        leetcodeUrl: "https://leetcode.com/aarav-sharma",
        readinessScore: 78,
        profileCompletion: 82,
        placementStatus: "SEEKING",
        gender: "Male",
        admissionYear: 2022,
      },
    }),
    prisma.studentProfile.create({
      data: {
        userId: studentUsers[1].id,
        institutionId: institutions[1].id,
        department: "Computer Science & Engineering",
        degree: "B.Tech",
        graduationYear: 2027,
        currentYear: "2nd Year",
        currentSemester: 4,
        cgpa: 9.1,
        headline: "AI/ML Enthusiast | Data Science Intern @ Infosys",
        summary: "Building intelligent systems with Python, TensorFlow and real-world datasets. Focused on NLP and computer vision projects.",
        careerInterests: JSON.stringify(["Machine Learning", "Data Science", "Research"]),
        preferredRoles: JSON.stringify(["Data Scientist", "AI/ML Engineer", "Research Scientist"]),
        githubUrl: "https://github.com/priya-nair",
        linkedinUrl: "https://linkedin.com/in/priya-nair",
        kaggleUrl: "https://kaggle.com/priyanair",
        readinessScore: 85,
        profileCompletion: 91,
        placementStatus: "INTERNING",
        gender: "Female",
        admissionYear: 2023,
      },
    }),
    prisma.studentProfile.create({
      data: {
        userId: studentUsers[2].id,
        institutionId: institutions[2].id,
        department: "Information Technology",
        degree: "B.Tech",
        graduationYear: 2025,
        currentYear: "4th Year",
        currentSemester: 8,
        cgpa: 7.8,
        headline: "DevOps Engineer in the making | Cloud & Kubernetes enthusiast",
        careerInterests: JSON.stringify(["Cloud Computing", "DevOps", "Infrastructure"]),
        preferredRoles: JSON.stringify(["DevOps Engineer", "Cloud Engineer"]),
        githubUrl: "https://github.com/rahul-mehta",
        readinessScore: 68,
        profileCompletion: 65,
        placementStatus: "SEEKING",
        gender: "Male",
        admissionYear: 2021,
      },
    }),
  ]);
  console.log("✅ Created student profiles");

  // ── STUDENT SKILLS ──
  const skillAssignments = [
    // Aarav — Full Stack
    { studentId: studentProfiles[0].id, skillId: skillMap["JS"], level: "ADVANCED", score: 85, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["TS"], level: "INTERMEDIATE", score: 68, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["REACT"], level: "ADVANCED", score: 82, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["NEXTJS"], level: "INTERMEDIATE", score: 70, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["NODEJS"], level: "INTERMEDIATE", score: 65, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["POSTGRES"], level: "BEGINNER", score: 45, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["GIT"], level: "ADVANCED", score: 88, verification: "ASSESSMENT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["HTML"], level: "EXPERT", score: 96, verification: "ASSESSMENT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["CSS"], level: "ADVANCED", score: 83, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[0].id, skillId: skillMap["PYTHON"], level: "INTERMEDIATE", score: 62, verification: "SELF_DECLARED" },
    // Priya — AI/ML
    { studentId: studentProfiles[1].id, skillId: skillMap["PYTHON"], level: "EXPERT", score: 97, verification: "ASSESSMENT_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["ML"], level: "ADVANCED", score: 88, verification: "CERTIFICATION_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["DL"], level: "ADVANCED", score: 84, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["TF"], level: "INTERMEDIATE", score: 72, verification: "CERTIFICATION_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["PANDAS"], level: "EXPERT", score: 95, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["NUMPY"], level: "ADVANCED", score: 87, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["SQL"], level: "INTERMEDIATE", score: 68, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[1].id, skillId: skillMap["NLP"], level: "INTERMEDIATE", score: 70, verification: "PROJECT_VERIFIED" },
    // Rahul — DevOps
    { studentId: studentProfiles[2].id, skillId: skillMap["DOCKER"], level: "ADVANCED", score: 82, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[2].id, skillId: skillMap["K8S"], level: "INTERMEDIATE", score: 65, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[2].id, skillId: skillMap["LINUX"], level: "ADVANCED", score: 80, verification: "ASSESSMENT_VERIFIED" },
    { studentId: studentProfiles[2].id, skillId: skillMap["AWS"], level: "BEGINNER", score: 42, verification: "SELF_DECLARED" },
    { studentId: studentProfiles[2].id, skillId: skillMap["GIT"], level: "ADVANCED", score: 85, verification: "PROJECT_VERIFIED" },
    { studentId: studentProfiles[2].id, skillId: skillMap["PYTHON"], level: "INTERMEDIATE", score: 60, verification: "SELF_DECLARED" },
  ];

  await Promise.all(
    skillAssignments.map(sa =>
      prisma.studentSkill.create({
        data: {
          studentId: sa.studentId,
          skillId: sa.skillId,
          proficiencyLevel: sa.level,
          proficiencyScore: sa.score,
          verificationLevel: sa.verification,
          verificationSource: "PLATFORM",
          verifiedAt: sa.verification !== "SELF_DECLARED" ? new Date() : null,
        },
      })
    )
  );
  console.log("✅ Created student skills");

  // ── CERTIFICATIONS ──
  await Promise.all([
    prisma.studentCertification.create({ data: { studentId: studentProfiles[0].id, title: "AWS Certified Developer – Associate", issuingBody: "Amazon Web Services", issueDate: new Date("2024-03-15"), expiryDate: new Date("2027-03-15"), credentialId: "AWS-DEV-2024-78432", credentialUrl: "https://aws.amazon.com/verification", relatedSkills: JSON.stringify(["AWS", "Cloud"]) } }),
    prisma.studentCertification.create({ data: { studentId: studentProfiles[0].id, title: "Meta Frontend Developer Certificate", issuingBody: "Meta (Coursera)", issueDate: new Date("2023-11-20"), credentialUrl: "https://coursera.org/verify/meta-frontend", relatedSkills: JSON.stringify(["React", "JavaScript", "HTML", "CSS"]) } }),
    prisma.studentCertification.create({ data: { studentId: studentProfiles[1].id, title: "TensorFlow Developer Certificate", issuingBody: "Google (TensorFlow)", issueDate: new Date("2024-01-10"), expiryDate: new Date("2027-01-10"), credentialId: "TF-DEV-2024-12981", credentialUrl: "https://tensorflow.org/certificate", relatedSkills: JSON.stringify(["TensorFlow", "Deep Learning", "Python"]) } }),
    prisma.studentCertification.create({ data: { studentId: studentProfiles[1].id, title: "Machine Learning Specialization", issuingBody: "DeepLearning.AI (Coursera)", issueDate: new Date("2023-09-05"), credentialUrl: "https://coursera.org/verify/ml-specialization", relatedSkills: JSON.stringify(["Machine Learning", "Python", "Statistics"]) } }),
    prisma.studentCertification.create({ data: { studentId: studentProfiles[2].id, title: "Docker Certified Associate", issuingBody: "Docker Inc.", issueDate: new Date("2024-02-01"), expiryDate: new Date("2026-02-01"), relatedSkills: JSON.stringify(["Docker", "Container Orchestration"]) } }),
  ]);
  console.log("✅ Created certifications");

  // ── ACHIEVEMENTS ──
  await Promise.all([
    prisma.achievement.create({ data: { studentId: studentProfiles[0].id, title: "Winner - Smart India Hackathon 2024", type: "HACKATHON", organization: "Government of India", date: new Date("2024-12-01"), description: "Won national-level SIH hackathon with an AI-powered career guidance platform.", relatedSkills: JSON.stringify(["React", "Node.js", "ML"]) } }),
    prisma.achievement.create({ data: { studentId: studentProfiles[0].id, title: "LeetCode Knight Badge (1900+ rating)", type: "COMPETITION", organization: "LeetCode", date: new Date("2024-06-15"), description: "Achieved Knight rating on LeetCode with 400+ problems solved." } }),
    prisma.achievement.create({ data: { studentId: studentProfiles[1].id, title: "Top 5% - Kaggle NLP Competition", type: "COMPETITION", organization: "Kaggle", date: new Date("2024-03-20"), description: "Ranked in top 5% globally in sentiment analysis competition.", relatedSkills: JSON.stringify(["NLP", "Python", "Machine Learning"]) } }),
    prisma.achievement.create({ data: { studentId: studentProfiles[1].id, title: "Research Paper Published - IEEE", type: "PUBLICATION", organization: "IEEE", date: new Date("2024-07-10"), description: "Published paper on 'Attention Mechanisms in Medical Image Segmentation'", relatedSkills: JSON.stringify(["Deep Learning", "Python"]) } }),
    prisma.achievement.create({ data: { studentId: studentProfiles[2].id, title: "2nd Runner-up - HackCBS 6.0", type: "HACKATHON", organization: "HackCBS", date: new Date("2023-11-18"), description: "Built an automated CI/CD pipeline visualization tool." } }),
  ]);
  console.log("✅ Created achievements");

  // ── PROJECTS ──
  await Promise.all([
    prisma.studentProject.create({ data: { studentId: studentProfiles[0].id, title: "SkillBridge – Career Matching Platform", description: "A full-stack platform connecting students with industry through skill-based matching. Implements real-time notifications, CV analysis, and ML-powered job recommendations.", category: "WEB", technologies: "Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS", skillsDemonstrated: JSON.stringify(["React", "Node.js", "PostgreSQL", "TypeScript"]), githubUrl: "https://github.com/aarav-sharma/skillbridge", liveUrl: "https://skillbridge.vercel.app", teamSize: 3, role: "Full Stack Lead", durationMonths: 4 } }),
    prisma.studentProject.create({ data: { studentId: studentProfiles[0].id, title: "E-Commerce Microservices Platform", description: "Scalable microservices architecture for an e-commerce backend with independent services for auth, products, orders, and payments.", category: "WEB", technologies: "Node.js, Express, Docker, Redis, MongoDB", skillsDemonstrated: JSON.stringify(["Node.js", "Docker", "MongoDB", "REST API"]), githubUrl: "https://github.com/aarav-sharma/ecom-microservices", teamSize: 1, role: "Solo Developer", durationMonths: 2 } }),
    prisma.studentProject.create({ data: { studentId: studentProfiles[1].id, title: "AI Resume Analyzer", description: "NLP-powered resume analysis system that extracts skills, suggests improvements, and matches resumes with job descriptions using BERT embeddings.", category: "AI_ML", technologies: "Python, FastAPI, BERT, React, PostgreSQL", skillsDemonstrated: JSON.stringify(["Python", "NLP", "Machine Learning", "FastAPI"]), githubUrl: "https://github.com/priya-nair/ai-resume-analyzer", teamSize: 2, role: "ML Engineer", durationMonths: 3 } }),
    prisma.studentProject.create({ data: { studentId: studentProfiles[2].id, title: "Kubernetes Auto-Scaler Dashboard", description: "Real-time Kubernetes cluster monitoring and auto-scaling dashboard with cost optimization recommendations.", category: "CLOUD", technologies: "Kubernetes, Prometheus, Grafana, React, Go", skillsDemonstrated: JSON.stringify(["Kubernetes", "Docker", "Go", "Linux"]), githubUrl: "https://github.com/rahul-mehta/k8s-dashboard", teamSize: 2, role: "DevOps Engineer", durationMonths: 3 } }),
  ]);
  console.log("✅ Created projects");

  // ── OPPORTUNITIES ──
  const oppData = [
    {
      companyId: companies[0].id,
      title: "Software Development Intern (Full Stack)",
      type: "INTERNSHIP",
      workMode: "HYBRID",
      description: "Join TCS as a Full Stack Developer Intern. You'll work on enterprise-grade applications using React and Node.js. Mentored by senior engineers.",
      responsibilities: "Build responsive UI components, develop RESTful APIs, write unit tests, participate in Agile ceremonies",
      eligibility: "B.Tech/BE students from CSE/IT/ECE graduating in 2025-2026. CGPA >= 7.0",
      minCgpa: 7.0,
      stipendOrSalary: "₹25,000/month",
      vacancies: 50,
      durationMonths: 6,
      location: "Chennai, TN",
      deadline: new Date("2026-09-30"),
      driveDate: new Date("2026-10-15"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["JS"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["REACT"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["NODEJS"], criticality: "PREFERRED", weightage: 20 },
        { skillId: skillMap["SQL"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["GIT"], criticality: "MANDATORY", weightage: 15 },
      ],
    },
    {
      companyId: companies[1].id,
      title: "Data Science Intern",
      type: "INTERNSHIP",
      workMode: "REMOTE",
      description: "Infosys Data Science Intern program. Work on real ML models for banking and finance clients. Great mentorship, PPO opportunity.",
      eligibility: "CSE/IT/Math/Statistics students, CGPA >= 8.0, 2025-2027 graduating",
      minCgpa: 8.0,
      stipendOrSalary: "₹30,000/month",
      vacancies: 25,
      durationMonths: 3,
      location: "Bengaluru, KA (Remote)",
      deadline: new Date("2026-10-05"),
      driveDate: new Date("2026-10-20"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["PYTHON"], criticality: "MANDATORY", weightage: 30 },
        { skillId: skillMap["ML"], criticality: "MANDATORY", weightage: 30 },
        { skillId: skillMap["SQL"], criticality: "MANDATORY", weightage: 20 },
        { skillId: skillMap["PANDAS"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["STATS"], criticality: "PREFERRED", weightage: 15 },
      ],
    },
    {
      companyId: companies[2].id,
      title: "Azure Cloud Engineer Intern",
      type: "INTERNSHIP",
      workMode: "HYBRID",
      description: "Microsoft internship program focused on Azure cloud infrastructure, DevOps pipelines, and distributed systems. Return offer for top performers.",
      eligibility: "CSE/IT students, CGPA >= 7.5, graduating 2025-2026",
      minCgpa: 7.5,
      stipendOrSalary: "₹60,000/month",
      vacancies: 10,
      durationMonths: 6,
      location: "Hyderabad, TS",
      deadline: new Date("2026-09-20"),
      driveDate: new Date("2026-10-10"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["AZURE"], criticality: "MANDATORY", weightage: 30 },
        { skillId: skillMap["DOCKER"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["LINUX"], criticality: "PREFERRED", weightage: 20 },
        { skillId: skillMap["PYTHON"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["GIT"], criticality: "MANDATORY", weightage: 10 },
      ],
    },
    {
      companyId: companies[3].id,
      title: "Software Engineering Intern (STEP)",
      type: "INTERNSHIP",
      workMode: "ONSITE",
      description: "Google STEP program for undergraduate students. Work on core Google products with guidance from senior engineers. Competitive compensation.",
      eligibility: "All CS branches, GPA >= 8.5, 2026-2028 graduating",
      minCgpa: 8.5,
      stipendOrSalary: "₹1,00,000/month",
      vacancies: 8,
      durationMonths: 3,
      location: "Bengaluru, KA",
      deadline: new Date("2026-10-15"),
      driveDate: new Date("2026-11-01"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["JS"], criticality: "MANDATORY", weightage: 20 },
        { skillId: skillMap["PYTHON"], criticality: "PREFERRED", weightage: 20 },
        { skillId: skillMap["JAVA"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["RESTAPI"], criticality: "MANDATORY", weightage: 20 },
        { skillId: skillMap["SQL"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["GIT"], criticality: "MANDATORY", weightage: 10 },
      ],
    },
    {
      companyId: companies[4].id,
      title: "Backend Developer Intern (SDE-I)",
      type: "INTERNSHIP",
      workMode: "HYBRID",
      description: "Amazon India internship for backend development. Own a feature end-to-end, work with AWS services, and ship production code.",
      eligibility: "CSE/IT, CGPA >= 7.0, 2025-2026 graduating",
      minCgpa: 7.0,
      stipendOrSalary: "₹80,000/month",
      vacancies: 15,
      durationMonths: 6,
      location: "Bengaluru, KA",
      deadline: new Date("2026-09-25"),
      driveDate: new Date("2026-10-12"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["JAVA"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["RESTAPI"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["AWS"], criticality: "PREFERRED", weightage: 20 },
        { skillId: skillMap["SQL"], criticality: "MANDATORY", weightage: 20 },
        { skillId: skillMap["GIT"], criticality: "MANDATORY", weightage: 10 },
      ],
    },
    {
      companyId: companies[5].id,
      title: "ML Engineer Intern – Recommendations",
      type: "INTERNSHIP",
      workMode: "HYBRID",
      description: "Flipkart ML internship working on product recommendation systems serving 400M+ users. Great learning opportunity with PPO potential.",
      eligibility: "CSE/Maths/Stats, CGPA >= 8.0",
      minCgpa: 8.0,
      stipendOrSalary: "₹50,000/month",
      vacancies: 12,
      durationMonths: 6,
      location: "Bengaluru, KA",
      deadline: new Date("2026-10-20"),
      driveDate: new Date("2026-11-05"),
      status: "OPEN",
      skills: [
        { skillId: skillMap["PYTHON"], criticality: "MANDATORY", weightage: 25 },
        { skillId: skillMap["ML"], criticality: "MANDATORY", weightage: 30 },
        { skillId: skillMap["PYTORCH"], criticality: "PREFERRED", weightage: 20 },
        { skillId: skillMap["SQL"], criticality: "PREFERRED", weightage: 15 },
        { skillId: skillMap["GIT"], criticality: "MANDATORY", weightage: 10 },
      ],
    },
  ];

  const createdOpps = [];
  for (const { skills: oppSkills, ...oppCore } of oppData) {
    const opp = await prisma.opportunity.create({ data: oppCore });
    await Promise.all(oppSkills.map(os => prisma.opportunitySkill.create({ data: { opportunityId: opp.id, ...os } })));
    createdOpps.push(opp);
  }
  console.log("✅ Created opportunities");

  // ── APPLICATIONS ──
  await Promise.all([
    prisma.application.create({ data: { opportunityId: createdOpps[0].id, studentId: studentProfiles[0].id, matchScore: 87, status: "SHORTLISTED", coverLetter: "I am excited to apply for this Full Stack internship at TCS." } }),
    prisma.application.create({ data: { opportunityId: createdOpps[3].id, studentId: studentProfiles[0].id, matchScore: 72, status: "APPLIED", coverLetter: "Google STEP program aligns perfectly with my career goals." } }),
    prisma.application.create({ data: { opportunityId: createdOpps[1].id, studentId: studentProfiles[1].id, matchScore: 94, status: "INTERVIEW" } }),
    prisma.application.create({ data: { opportunityId: createdOpps[5].id, studentId: studentProfiles[1].id, matchScore: 91, status: "SELECTED" } }),
    prisma.application.create({ data: { opportunityId: createdOpps[2].id, studentId: studentProfiles[2].id, matchScore: 68, status: "REVIEWING" } }),
  ]);
  console.log("✅ Created applications");

  // ── TECH EVENTS ──
  await Promise.all([
    prisma.event.create({ data: { name: "Smart India Hackathon 2026", organizer: "Government of India / AICTE", type: "HACKATHON", mode: "OFFLINE", level: "ALL", date: new Date("2026-12-15"), endDate: new Date("2026-12-16"), time: "9:00 AM IST", description: "India's biggest hackathon — 36 hours to solve real national problems across 6 themes.", eligibility: "All UG/PG students enrolled in recognized Indian institutions", topics: JSON.stringify(["AI/ML", "IoT", "Blockchain", "EdTech", "Smart Cities"]), registrationDeadline: new Date("2026-10-31"), isActive: true } }),
    prisma.event.create({ data: { name: "Google Cloud Next '26 India", organizer: "Google Cloud", type: "CONFERENCE", mode: "HYBRID", level: "INTERMEDIATE", date: new Date("2026-11-10"), time: "10:00 AM IST", location: "Bengaluru, KA", description: "Learn the latest in cloud, AI, and infrastructure from Google engineers.", topics: JSON.stringify(["Google Cloud", "AI", "Kubernetes", "DevOps"]), registrationUrl: "https://cloud.google.com/events", isActive: true } }),
    prisma.event.create({ data: { name: "MLOps India Summit 2026", organizer: "Analytics Vidhya", type: "CONFERENCE", mode: "ONLINE", level: "ADVANCED", date: new Date("2026-10-18"), time: "2:00 PM IST", description: "Deep dive into production ML, model monitoring, and data engineering pipelines.", topics: JSON.stringify(["MLOps", "Python", "Docker", "Kubernetes", "ML"]), registrationUrl: "https://analyticsvidhya.com/mlops-summit", isActive: true } }),
    prisma.event.create({ data: { name: "React India 2026", organizer: "React India Conf", type: "CONFERENCE", mode: "HYBRID", level: "INTERMEDIATE", date: new Date("2026-11-28"), location: "Goa", description: "India's premier React.js conference with talks from core team members and industry leaders.", topics: JSON.stringify(["React", "JavaScript", "TypeScript", "Next.js"]), registrationUrl: "https://reactindia.io", isActive: true } }),
    prisma.event.create({ data: { name: "NASSCOM FutureSkills Webinar: Generative AI for Students", organizer: "NASSCOM", type: "WEBINAR", mode: "ONLINE", level: "BEGINNER", date: new Date("2026-10-08"), time: "4:00 PM IST", description: "Introduction to Generative AI — career opportunities, tools, and getting started as a student.", topics: JSON.stringify(["Generative AI", "ChatGPT", "Career"]), registrationDeadline: new Date("2026-10-07"), registrationUrl: "https://nasscom.in/futureskills", isActive: true } }),
    prisma.event.create({ data: { name: "HackCBS 7.0", organizer: "HackCBS Club, SGTB Khalsa College", type: "HACKATHON", mode: "OFFLINE", level: "BEGINNER", date: new Date("2026-11-22"), endDate: new Date("2026-11-23"), time: "10:00 AM IST", location: "Delhi, New Delhi", description: "Delhi's biggest student-run hackathon with ₹5L+ in prizes.", eligibility: "All undergraduate students, no prior hackathon experience needed", topics: JSON.stringify(["Web Dev", "AI", "Blockchain", "HealthTech"]), registrationDeadline: new Date("2026-11-10"), registrationUrl: "https://hackcbs.tech", isActive: true } }),
    prisma.event.create({ data: { name: "AWS re:Skill India — Cloud Workshop", organizer: "Amazon Web Services", type: "WORKSHOP", mode: "OFFLINE", level: "BEGINNER", date: new Date("2026-10-25"), time: "9:00 AM IST", location: "Multiple Cities", description: "Hands-on AWS workshop covering EC2, S3, Lambda, and DynamoDB. Earn AWS digital badge upon completion.", topics: JSON.stringify(["AWS", "Cloud", "Serverless"]), registrationUrl: "https://aws.amazon.com/training/reskill", isActive: true } }),
    prisma.event.create({ data: { name: "ICPC Regionals 2026 — Amritapuri Site", organizer: "ACM ICPC India", type: "COMPETITION", mode: "OFFLINE", level: "ADVANCED", date: new Date("2026-12-05"), location: "Coimbatore, TN", description: "International collegiate programming contest regional finals. Top teams advance to Asia-Pacific finals.", eligibility: "Undergraduate students only, 3 members per team", topics: JSON.stringify(["Competitive Programming", "Algorithms", "Data Structures"]), registrationDeadline: new Date("2026-10-15"), registrationUrl: "https://icpc.global", isActive: true } }),
    prisma.event.create({ data: { name: "Infosys Campus Placement Drive — Batch 2026", organizer: "Infosys Talent Acquisition", type: "CAMPUS_DRIVE", mode: "HYBRID", level: "ALL", date: new Date("2026-10-30"), time: "8:00 AM IST", description: "Infosys on-campus placement drive for eligible students from partner institutions.", eligibility: "CSE/IT/ECE, CGPA >= 6.5, no active backlogs, graduating 2026", registrationDeadline: new Date("2026-10-20"), isActive: true } }),
  ]);
  console.log("✅ Created events");

  // ── LEARNING RESOURCES ──
  const learningResources = [
    { skillId: skillMap["REACT"], title: "React – The Complete Guide 2024", provider: "Udemy (Maximilian Schwarzmüller)", url: "https://udemy.com/course/react-the-complete-guide", estimatedHours: 48, cost: "PAID", rating: 4.8, difficulty: "INTERMEDIATE", targetRole: "Full Stack Developer", roadmapOrder: 4, isRoadmapItem: true, whyRecommended: "Most comprehensive React course available with hooks, router, and state management." },
    { skillId: skillMap["NODEJS"], title: "Node.js Developer Course", provider: "Udemy (Andrew Mead)", url: "https://udemy.com/course/the-complete-nodejs-developer-course-2", estimatedHours: 35, cost: "PAID", rating: 4.7, difficulty: "INTERMEDIATE", targetRole: "Full Stack Developer", roadmapOrder: 5, isRoadmapItem: true, whyRecommended: "Node.js is required by 4 upcoming opportunities in your area." },
    { skillId: skillMap["AWS"], title: "AWS Cloud Practitioner Essentials", provider: "AWS Skill Builder (Official)", url: "https://explore.skillbuilder.aws/learn/course/134/aws-cloud-practitioner-essentials", estimatedHours: 12, cost: "FREE", rating: 4.7, difficulty: "BEGINNER", targetRole: "Cloud Engineer", roadmapOrder: 1, isRoadmapItem: true, whyRecommended: "Free official AWS course to get started with cloud concepts." },
    { skillId: skillMap["ML"], title: "Machine Learning Specialization", provider: "DeepLearning.AI + Stanford (Coursera)", url: "https://coursera.org/specializations/machine-learning-introduction", estimatedHours: 90, cost: "PAID", rating: 4.9, difficulty: "INTERMEDIATE", targetRole: "Data Scientist", roadmapOrder: 2, isRoadmapItem: true, whyRecommended: "The gold standard ML course by Andrew Ng. Free audit available." },
    { skillId: skillMap["PYTHON"], title: "Python for Everybody Specialization", provider: "University of Michigan (Coursera)", url: "https://coursera.org/specializations/python", estimatedHours: 60, cost: "PAID", rating: 4.8, difficulty: "BEGINNER", whyRecommended: "Best beginner Python course. Free audit option available." },
    { skillId: skillMap["SQL"], title: "SQL for Data Analysis", provider: "Udacity", url: "https://udacity.com/course/sql-for-data-analysis--ud198", estimatedHours: 16, cost: "FREE", rating: 4.5, difficulty: "BEGINNER", whyRecommended: "SQL is required by 80% of data roles. Free and concise." },
    { skillId: skillMap["DOCKER"], title: "Docker and Kubernetes: The Complete Guide", provider: "Udemy (Stephen Grider)", url: "https://udemy.com/course/docker-and-kubernetes-the-complete-guide", estimatedHours: 22, cost: "PAID", rating: 4.7, difficulty: "INTERMEDIATE", targetRole: "DevOps Engineer", roadmapOrder: 3, isRoadmapItem: true, whyRecommended: "Industry standard for containerization. Covers Docker + Kubernetes." },
    { skillId: skillMap["GENAI"], title: "Generative AI for Everyone", provider: "DeepLearning.AI (Coursera)", url: "https://coursera.org/learn/generative-ai-for-everyone", estimatedHours: 9, cost: "PAID", rating: 4.6, difficulty: "BEGINNER", whyRecommended: "Perfect introduction to GenAI concepts, tools, and career opportunities." },
    { skillId: skillMap["POSTGRES"], title: "PostgreSQL: The Complete Developer's Guide", provider: "Udemy (Stephen Grider)", url: "https://udemy.com/course/sql-and-postgresql", estimatedHours: 22, cost: "PAID", rating: 4.7, difficulty: "INTERMEDIATE", targetRole: "Backend Developer", roadmapOrder: 6, isRoadmapItem: true, whyRecommended: "PostgreSQL is used in 60% of backend engineer job listings." },
    { skillId: skillMap["GIT"], title: "Git Complete: The Definitive Guide", provider: "Udemy (Jad Khalili)", url: "https://udemy.com/course/git-complete", estimatedHours: 6, cost: "PAID", rating: 4.5, difficulty: "BEGINNER", whyRecommended: "Git is required for every software engineering role." },
    { skillId: skillMap["JAVA"], title: "Java Programming Masterclass", provider: "Udemy (Tim Buchalka)", url: "https://udemy.com/course/java-the-complete-java-developer-course", estimatedHours: 80, cost: "PAID", rating: 4.6, difficulty: "BEGINNER", whyRecommended: "Java is mandatory for TCS, Infosys, Wipro, and Cognizant placement tests." },
    { skillId: skillMap["K8S"], title: "Kubernetes for Developers", provider: "CNCF / Linux Foundation (edX)", url: "https://edx.org/course/introduction-to-kubernetes", estimatedHours: 14, cost: "FREE", rating: 4.5, difficulty: "INTERMEDIATE", targetRole: "DevOps Engineer", roadmapOrder: 4, isRoadmapItem: true, whyRecommended: "Official CNCF Kubernetes course. Free certificate available." },
  ];

  await Promise.all(learningResources.map(r => prisma.learningResource.create({ data: r })));
  console.log("✅ Created learning resources");

  // ── NOTIFICATIONS FOR STUDENT 0 ──
  await prisma.notification.createMany({
    data: [
      { userId: studentUsers[0].id, title: "Welcome to SkillBridge! 🎉", message: "Your account has been created successfully. Start by completing your profile.", type: "INFO", link: "/student/profile" },
      { userId: studentUsers[0].id, title: "New Application Update", message: "Your application to TCS – Software Development Intern has moved to Shortlisted!", type: "APPLICATION", link: "/student/applications", isRead: false },
      { userId: studentUsers[0].id, title: "87% Match Found", message: "TCS Software Development Intern is a great match for your skills.", type: "MATCH", link: "/student/opportunities" },
      { userId: studentUsers[0].id, title: "Skill Gap Alert: Docker", message: "Docker is required by 3 upcoming opportunities. Consider learning it.", type: "SKILL_GAP", link: "/student/skill-gap" },
      { userId: studentUsers[0].id, title: "Event Reminder: SIH 2026", message: "Smart India Hackathon 2026 registration closes on Oct 31!", type: "EVENT", link: "/student/events" },
    ],
  });

  // ── PROFILE VISIBILITY ──
  await Promise.all(studentProfiles.map(sp =>
    prisma.profileVisibility.create({
      data: {
        studentId: sp.id,
        profilePublic: true,
        skillsPublic: true,
        projectsPublic: true,
        certificationsPublic: true,
        academicInfoPublic: false,
        phonePrivate: true,
        emailPublic: false,
      },
    })
  ));

  console.log("\n✅✅✅ Seed completed successfully!\n");
  console.log("📧 Demo login credentials:");
  console.log("   Student 1: aarav.sharma@demo.in / Demo@1234");
  console.log("   Student 2: priya.nair@demo.in / Demo@1234");
  console.log("   Student 3: rahul.mehta@demo.in / Demo@1234");
  console.log("\n🌐 Open: http://localhost:3000");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
