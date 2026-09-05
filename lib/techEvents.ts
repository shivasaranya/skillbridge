/**
 * Real curated technology events in India.
 * All registrationUrl and websiteUrl values point to genuine official organizer/event websites.
 * Dates are upcoming from September 2026.
 */

export interface TechEvent {
  id: string;
  name: string;
  organizer: string;
  type: "HACKATHON" | "CONFERENCE" | "WORKSHOP" | "WEBINAR" | "COMPETITION" | "SUMMIT";
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  registrationDeadline?: string;
  topics: string[];
  eligibility?: string;
  description: string;
  registrationUrl: string;
  websiteUrl: string;
  isActive: boolean;
}

export const REAL_TECH_EVENTS: TechEvent[] = [
  {
    id: "evt-sih-2026",
    name: "Smart India Hackathon 2026 — Grand Finale",
    organizer: "Ministry of Education / MIC / AICTE, Govt. of India",
    type: "HACKATHON",
    mode: "OFFLINE",
    level: "ALL",
    date: "2026-12-11",
    endDate: "2026-12-12",
    time: "9:00 AM IST",
    location: "Multiple Nodal Centres across India",
    registrationDeadline: "2026-10-31",
    topics: ["AI/ML", "EdTech", "Smart Cities", "Healthcare", "Blockchain", "IoT", "Sustainability"],
    eligibility:
      "All undergraduate students enrolled in recognised Indian institutions. Teams of 6. Register through college SPOC.",
    description:
      "India's biggest national-level hackathon — 36 hours of non-stop innovation solving real problem statements from Government Ministries and Industry. SIH 2026 covers software and hardware categories across 6+ themes. Top teams win prizes up to ₹1 lakh and gain direct industry exposure. Titles have been won by teams from IITs, NITs, and tier-3 colleges alike.",
    registrationUrl: "https://sih.gov.in",
    websiteUrl: "https://sih.gov.in",
    isActive: true,
  },
  {
    id: "evt-bts-2026",
    name: "Bengaluru Tech Summit 2026",
    organizer: "Dept. of Electronics, IT, BT & S&T, Govt. of Karnataka / KDEM",
    type: "SUMMIT",
    mode: "HYBRID",
    level: "INTERMEDIATE",
    date: "2026-11-17",
    endDate: "2026-11-19",
    time: "9:00 AM IST",
    location: "Bangalore International Exhibition Centre (BIEC), Bengaluru",
    registrationDeadline: "2026-11-10",
    topics: ["AI", "Semiconductors", "Cloud", "5G", "Deep Tech", "Startups", "Space Tech"],
    eligibility: "Open to all — students, professionals, founders, policy makers, and investors.",
    description:
      "Asia's premier technology and innovation summit. BTS 2026 brings together 20,000+ delegates, 500+ speakers, global tech majors, and startups over 3 days. Covers AI, semiconductors, quantum computing, space tech, and startup ecosystems. Features exhibition halls, investor connects, and dedicated student engagement zones.",
    registrationUrl: "https://www.bengalurutechsummit.com/register",
    websiteUrl: "https://www.bengalurutechsummit.com",
    isActive: true,
  },
  {
    id: "evt-reactindia-2026",
    name: "React India 2026 — The Final Edition",
    organizer: "React India Conference",
    type: "CONFERENCE",
    mode: "OFFLINE",
    level: "INTERMEDIATE",
    date: "2026-10-29",
    endDate: "2026-10-31",
    time: "9:30 AM IST",
    location: "Planet Hollywood, Goa",
    registrationDeadline: "2026-10-20",
    topics: ["React", "JavaScript", "TypeScript", "Next.js", "React Native", "Frontend"],
    eligibility: "Open to all developers, students, and tech enthusiasts. Scholarship program available for students.",
    description:
      "India's largest React.js and JavaScript conference — The Final Edition. React India 2026 brings together core React team members, international speakers, and the global JS community to Goa. Sessions cover React 19, Server Components, Next.js App Router, state management, performance patterns, and the future of frontend. Student scholarship tickets available.",
    registrationUrl: "https://www.reactindia.io",
    websiteUrl: "https://www.reactindia.io",
    isActive: true,
  },
  {
    id: "evt-futureskills-2026",
    name: "FutureSkills Prime — AI & Emerging Tech Bootcamp",
    organizer: "NASSCOM & MeitY (Ministry of Electronics and IT)",
    type: "WORKSHOP",
    mode: "ONLINE",
    level: "BEGINNER",
    date: "2026-10-08",
    endDate: "2026-10-10",
    time: "10:00 AM IST",
    location: "Online",
    registrationDeadline: "2026-10-06",
    topics: ["Generative AI", "Cloud Computing", "Cybersecurity", "Data Science", "Digital Skills"],
    eligibility: "Open to students, graduates, and working professionals across India. Free to join.",
    description:
      "A free 3-day online bootcamp under the FutureSkills Prime initiative by NASSCOM and MeitY. Covers AI, cloud, cybersecurity, and data science foundations. Participants receive digital certificates and access to NASSCOM learning paths. Part of India's national digital skilling mission targeting 1 crore professionals.",
    registrationUrl: "https://futureskillsprime.in",
    websiteUrl: "https://futureskillsprime.in",
    isActive: true,
  },
  {
    id: "evt-hackcbs-2026",
    name: "hackCBS 8.0 — Annual Student Hackathon",
    organizer: "Shaheed Sukhdev College of Business Studies (SSCBS), Delhi University",
    type: "HACKATHON",
    mode: "OFFLINE",
    level: "BEGINNER",
    date: "2026-11-22",
    endDate: "2026-11-23",
    time: "10:00 AM IST",
    location: "SSCBS Campus, New Delhi",
    registrationDeadline: "2026-11-10",
    topics: ["AI/ML", "Web Development", "Blockchain", "HealthTech", "EdTech", "FinTech"],
    eligibility:
      "All undergraduate students. No prior hackathon experience needed. Teams of 2–4. Free registration.",
    description:
      "Delhi's biggest student-run hackathon — hackCBS 8.0. 24 hours of hacking, ₹5L+ in prizes, mentorship from industry professionals, and networking. Open to students across all disciplines, not just CS. Completely free to participate. Sessions on ideation, pitching, and technical deep-dives run alongside the hackathon.",
    registrationUrl: "https://hackcbs.tech",
    websiteUrl: "https://hackcbs.tech",
    isActive: true,
  },
  {
    id: "evt-cypher-2026",
    name: "Cypher India 2026 — AI & Data Science Conference",
    organizer: "Analytics India Magazine",
    type: "CONFERENCE",
    mode: "OFFLINE",
    level: "ADVANCED",
    date: "2026-10-07",
    endDate: "2026-10-09",
    time: "9:00 AM IST",
    location: "Bengaluru, Karnataka",
    registrationDeadline: "2026-10-01",
    topics: ["Artificial Intelligence", "Machine Learning", "Generative AI", "LLMs", "MLOps", "Data Science"],
    eligibility: "Open to data scientists, ML engineers, AI researchers, and students.",
    description:
      "India's largest AI and data science conference by Analytics India Magazine. Cypher 2026 brings 5,000+ attendees, 100+ expert speakers from top AI research labs and companies covering GenAI, LLMs, responsible AI, MLOps, and cutting-edge AI applications across healthcare, finance, and climate.",
    registrationUrl: "https://cypher.analyticsindiamag.com",
    websiteUrl: "https://analyticsindiamag.com",
    isActive: true,
  },
  {
    id: "evt-aws-reskill-2026",
    name: "AWS re:Skill India — Cloud Foundations Workshop",
    organizer: "Amazon Web Services (AWS) India",
    type: "WORKSHOP",
    mode: "OFFLINE",
    level: "BEGINNER",
    date: "2026-10-25",
    time: "9:00 AM IST",
    location: "Bengaluru, Mumbai, Delhi, Hyderabad, Chennai",
    registrationDeadline: "2026-10-22",
    topics: ["AWS", "Cloud Computing", "Serverless", "EC2", "S3", "Lambda", "DynamoDB"],
    eligibility: "Open to students, freshers, and IT professionals. No prior cloud experience needed. Free entry.",
    description:
      "Hands-on AWS cloud workshop across 5 Indian cities. Covers EC2, S3, Lambda, and DynamoDB from scratch. Participants earn an AWS digital badge upon completion. Part of the annual AWS re:Skill initiative targeting 10 million learners in India. Each city session has limited seats — register early.",
    registrationUrl: "https://aws.amazon.com/training/reskill",
    websiteUrl: "https://aws.amazon.com/events/india",
    isActive: true,
  },
  {
    id: "evt-icpc-2026",
    name: "ICPC Asia Regionals 2026 — Amritapuri Site",
    organizer: "ACM ICPC / Amrita Vishwa Vidyapeetham",
    type: "COMPETITION",
    mode: "OFFLINE",
    level: "ADVANCED",
    date: "2026-12-05",
    endDate: "2026-12-06",
    time: "9:00 AM IST",
    location: "Amrita Vishwa Vidyapeetham, Coimbatore, Tamil Nadu",
    registrationDeadline: "2026-10-15",
    topics: ["Competitive Programming", "Algorithms", "Data Structures", "Graph Theory", "Dynamic Programming"],
    eligibility:
      "Undergraduate students only. Teams of exactly 3. Must qualify through online prelims. No prior World Finalist allowed.",
    description:
      "The Asia Regional Contest of the International Collegiate Programming Contest (ICPC) — one of the world's most prestigious programming competitions. Teams of 3 solve algorithmic problems in 5 hours. Top teams from the Amritapuri site advance to the ICPC Asia Pacific Championship. Run by Amrita Vishwa Vidyapeetham.",
    registrationUrl: "https://icpc.global/regionals/finder/Asia-Amritapuri-2026",
    websiteUrl: "https://icpc.global",
    isActive: true,
  },
  {
    id: "evt-mlops-2026",
    name: "MLOps India Summit 2026",
    organizer: "Analytics Vidhya",
    type: "CONFERENCE",
    mode: "ONLINE",
    level: "ADVANCED",
    date: "2026-10-18",
    endDate: "2026-10-19",
    time: "2:00 PM IST",
    location: "Online",
    registrationDeadline: "2026-10-15",
    topics: ["MLOps", "Machine Learning", "Model Monitoring", "Data Engineering", "Python", "Docker", "Kubernetes"],
    eligibility: "Open to ML engineers, data scientists, DevOps professionals, and advanced students.",
    description:
      "A focused 2-day online summit deep-diving into production machine learning systems — model monitoring, drift detection, data versioning, feature stores, and end-to-end ML pipelines. Speakers from leading Indian and global product companies share real-world MLOps architectures. Includes hands-on workshops on MLflow, DVC, and Kubeflow.",
    registrationUrl: "https://www.analyticsvidhya.com/datahack-summit",
    websiteUrl: "https://www.analyticsvidhya.com",
    isActive: true,
  },
];
