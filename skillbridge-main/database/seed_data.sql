-- ============================================================================
-- SMART INDIA HACKATHON (SIH) 2026 - PROBLEM STATEMENT SIH26044
-- SEED DATA SCRIPT: Realistic Ayush & Academia-Industry Collaboration Dataset
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (role_id, role_code, role_name, description) VALUES
(1, 'SUPER_ADMIN', 'Central Platform Administrator', 'Full system administration and oversight'),
(2, 'MINISTRY_OFFICER', 'Ministry of Ayush / Regulatory Officer', 'State & national oversight, compliance and accreditation'),
(3, 'INSTITUTION_ADMIN', 'Academic Institution Head / Dean', 'Executive head of university or college'),
(4, 'TPO', 'Training and Placement Officer', 'Coordinates campus drives, NOC issuance, and corporate partnerships'),
(5, 'FACULTY_MENTOR', 'Academic Faculty & Guide', 'Mentors student cohorts, approves internship eligibility and validates skills'),
(6, 'COMPANY_ADMIN', 'Corporate HR Director', 'Industry partner company administrator'),
(7, 'RECRUITER', 'Talent Acquisition Specialist', 'Posts internships/jobs, evaluates candidates and schedules interviews'),
(8, 'STUDENT', 'Student / Candidate', 'Aspiring student seeking skill verification, internships and placements')
ON CONFLICT (role_code) DO NOTHING;

-- 2. USERS (Deterministic UUIDs for referential consistency)
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, is_email_verified, is_active) VALUES
-- Ministry Admin
('11111111-1111-1111-1111-111111111111', 'ayush.admin@gov.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Rajesh', 'Kotecha', '+911124651950', TRUE, TRUE),

-- Academic Institution Heads & TPOs
('22222222-2222-2222-2222-222222222221', 'director@nia.nic.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Sanjeev', 'Sharma', '+911412635741', TRUE, TRUE),
('22222222-2222-2222-2222-222222222222', 'tpo@nia.nic.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Dr. Meenakshi', 'Sundaram', '+911412635745', TRUE, TRUE),
('22222222-2222-2222-2222-222222222223', 'faculty.mentor@nia.nic.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Prof. Arvind', 'Tripathi', '+911412635748', TRUE, TRUE),

-- Industry Leaders & Recruiters
('33333333-3333-3333-3333-333333333331', 'corporate.hr@dabur.com', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Vikram', 'Malhotra', '+911203982000', TRUE, TRUE),
('33333333-3333-3333-3333-333333333332', 'campus.talent@himalayawellness.com', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Ananya', 'Deshmukh', '+918067549999', TRUE, TRUE),
('33333333-3333-3333-3333-333333333333', 'research.careers@patanjali.res.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Dr. Anurag', 'Varshney', '+911334240008', TRUE, TRUE),

-- Students
('44444444-4444-4444-4444-444444444441', 'aarav.sharma@student.nia.ac.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Aarav', 'Sharma', '+919876543210', TRUE, TRUE),
('44444444-4444-4444-4444-444444444442', 'priya.nair@student.nia.ac.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Priya', 'Nair', '+919876543211', TRUE, TRUE),
('44444444-4444-4444-4444-444444444443', 'rohan.verma@student.nia.ac.in', '$2a$12$e8Y6.vY5m2mUo9z7y4wOveqJ3r8B7C9k2E5F1A3C4E5G6H7I8J9K0', 'Rohan', 'Verma', '+919876543212', TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 3. USER ROLES ASSIGNMENT
INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 2), -- Ministry
('22222222-2222-2222-2222-222222222221', 3), -- Inst Admin
('22222222-2222-2222-2222-222222222222', 4), -- TPO
('22222222-2222-2222-2222-222222222223', 5), -- Faculty Mentor
('33333333-3333-3333-3333-333333333331', 6), -- Company Admin Dabur
('33333333-3333-3333-3333-333333333332', 7), -- Recruiter Himalaya
('33333333-3333-3333-3333-333333333333', 7), -- Recruiter Patanjali
('44444444-4444-4444-4444-444444444441', 8), -- Student Aarav
('44444444-4444-4444-4444-444444444442', 8), -- Student Priya
('44444444-4444-4444-4444-444444444443', 8)  -- Student Rohan
ON CONFLICT DO NOTHING;

-- 4. ACADEMIC INSTITUTION
INSERT INTO institutions (institution_id, admin_user_id, aishe_code, name, institution_type, category, accreditation_grade, website, official_email, contact_phone, city, state, postal_code, is_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222221', 'U-0465', 'National Institute of Ayurveda (Deemed to be University)', 'AYUSH_NATIONAL_INSTITUTE', 'Ayush & Allied Health', 'NAAC A++', 'https://nia.nic.in', 'contact@nia.nic.in', '+911412635740', 'Jaipur', 'Rajasthan', '302002', TRUE)
ON CONFLICT (institution_id) DO NOTHING;

-- 5. DEPARTMENTS
INSERT INTO departments (department_id, institution_id, department_name, department_code, hod_name, hod_email) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Department of Dravyaguna Vigyana (Pharmacology & Materia Medica)', 'DG-NIA', 'Prof. B. L. Mehra', 'hod.dg@nia.nic.in'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Department of Panchakarma', 'PK-NIA', 'Prof. Gopesh Mangal', 'hod.pk@nia.nic.in'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Department of Rasashastra & Bhaishajya Kalpana (Pharmaceutics)', 'RS-NIA', 'Prof. K. Shankar Rao', 'hod.rs@nia.nic.in')
ON CONFLICT (department_id) DO NOTHING;

-- 6. PROGRAMS
INSERT INTO programs (program_id, department_id, program_name, degree_level, duration_semesters) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Bachelor of Ayurvedic Medicine and Surgery (BAMS)', 'UNDERGRADUATE', 9),
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'MD (Ayurveda) in Dravyaguna Vigyana', 'POSTGRADUATE', 6),
('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'M.Pharm (Ayurveda) - Herbal Formulation & Drug Standardisation', 'POSTGRADUATE', 4)
ON CONFLICT (program_id) DO NOTHING;

-- 7. FACULTY MENTORS / TPOs
INSERT INTO faculty_mentors (mentor_id, user_id, institution_id, department_id, designation, specialization, is_tpo_officer) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222223', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Associate Professor & Student Guide', 'Ethnobotany & Herbal Drug Quality', FALSE),
('dddddddd-dddd-dddd-dddd-ddddddddddd2', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Head - Training & Placement Cell', 'Industry Collaboration & Corporate Relations', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 8. INDUSTRY PARTNER COMPANIES
INSERT INTO companies (company_id, admin_user_id, company_name, cin_number, gstin, industry_domain, company_size, website, contact_email, contact_phone, description, headquarters_city, headquarters_state, is_verified) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '33333333-3333-3333-3333-333333333331', 'Dabur India Limited', 'L24230DL1975PLC007908', '07AAACD1234F1Z1', 'AYUSH_PHARMACEUTICALS', 'CONGLOMERATE_1000_PLUS', 'https://www.dabur.com', 'careers@dabur.com', '+911203982000', 'India’s leading science-based Ayurveda company with presence across 100+ nations.', 'Kaushambi, Ghaziabad', 'Uttar Pradesh', TRUE),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '33333333-3333-3333-3333-333333333332', 'Himalaya Wellness Company', 'U24231KA1930PTC001234', '29AAACH4567G1Z8', 'HERBAL_RESEARCH', 'CONGLOMERATE_1000_PLUS', 'https://himalayawellness.in', 'internships@himalayawellness.com', '+918067549999', 'Global herbal wellness enterprise pioneering clinical validation of botanical remedies.', 'Bengaluru', 'Karnataka', TRUE),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', '33333333-3333-3333-3333-333333333333', 'Patanjali Research Institute (PRI)', 'U73100UR2017NPL007890', '05AAATP9876H1Z2', 'CLINICAL_TRIALS', 'ENTERPRISE_201_1000', 'https://patanjali.res.in', 'research@patanjali.res.in', '+911334240008', 'Advanced biomedical and Ayurvedic scientific research institute conducting GCP clinical trials.', 'Haridwar', 'Uttarakhand', TRUE)
ON CONFLICT (company_id) DO NOTHING;

-- 9. RECRUITER PROFILES
INSERT INTO recruiter_profiles (recruiter_id, user_id, company_id, designation, linkedin_url, is_authorized_signatory) VALUES
('ffffffff-ffff-ffff-ffff-fffffffffff1', '33333333-3333-3333-3333-333333333331', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'Head of Talent Acquisition & Campus Outreach', 'https://linkedin.com/in/vikram-dabur-hr', TRUE),
('ffffffff-ffff-ffff-ffff-fffffffffff2', '33333333-3333-3333-3333-333333333332', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'R&D Campus Relations Lead', 'https://linkedin.com/in/ananya-himalaya-talent', TRUE),
('ffffffff-ffff-ffff-ffff-fffffffffff3', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'Senior Clinical Scientist & Hiring Lead', 'https://linkedin.com/in/anurag-pri-research', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 10. SKILL CATEGORIES
INSERT INTO skill_categories (category_id, parent_category_id, category_name, description) VALUES
(1, NULL, 'Botanical & Phytochemical Analysis', 'Laboratory methods for identifying and characterizing herbal compounds'),
(2, NULL, 'Ayush Clinical Protocols & Therapeutics', 'Patient diagnostic, treatment, and clinical procedures in traditional systems'),
(3, NULL, 'Good Manufacturing Practices & Drug Regulatory Affairs', 'Quality assurance, pharmacovigilance, and compliance with Ayush & WHO guidelines'),
(4, NULL, 'Healthcare Informatics & Digital Health', 'Electronic Health Records, statistical clinical trials, and health data analysis'),
(5, NULL, 'Professional & Communication Skills', 'Scientific writing, patient bedside communication, and interdisciplinary collaboration')
ON CONFLICT (category_id) DO NOTHING;

-- 11. SKILLS MASTER ONTOLOGY
INSERT INTO skills (skill_id, category_id, skill_code, skill_name, description, industry_demand_weight) VALUES
('11110000-0000-0000-0000-000000000001', 1, 'PHYTO-HPLC-01', 'High-Performance Liquid Chromatography (HPLC)', 'Fingerprinting and quantitative assay of active herbal biomarkers', 4.8),
('11110000-0000-0000-0000-000000000002', 1, 'PHYTO-EXTR-02', 'Botanical Extraction & Standardisation', 'Hydro-alcoholic and supercritical CO2 extraction methods', 4.2),
('11110000-0000-0000-0000-000000000003', 2, 'CLIN-PANCH-01', 'Panchakarma Protocol Administration', 'Planning and supervised administration of Vamana, Virechana, and Basti procedures', 4.9),
('11110000-0000-0000-0000-000000000004', 2, 'CLIN-DIAG-02', 'Ashtavidha Pariksha (Pulse & Clinical Diagnosis)', 'Traditional Ayurvedic 8-fold clinical examination techniques', 4.5),
('11110000-0000-0000-0000-000000000005', 3, 'REG-GCP-01', 'Good Clinical Practice (GCP) & Pharmacovigilance', 'Reporting Adverse Drug Reactions (ADR) and clinical trial ethics for Ayush formulations', 4.7),
('11110000-0000-0000-0000-000000000006', 3, 'REG-GMP-02', 'Schedule T & WHO-GMP Herbal Compliance', 'Sanitary, validation, and batch manufacturing compliance for herbal drugs', 4.3),
('11110000-0000-0000-0000-000000000007', 4, 'DATA-EHR-01', 'Ayush Hospital Management Information Systems (A-HMIS)', 'Digital prescription and electronic medical record management on Ayush platforms', 4.0),
('11110000-0000-0000-0000-000000000008', 4, 'DATA-BIOSTAT-02', 'Biostatistics in Clinical Trials (R / Python)', 'Hypothesis testing, Kaplan-Meier curves, and clinical trial efficacy statistics', 4.6),
('11110000-0000-0000-0000-000000000009', 5, 'COMM-SCIW-01', 'Medical & Scientific Manuscript Writing', 'Preparing case reports, observational study monographs, and regulatory dossiers', 4.1)
ON CONFLICT (skill_id) DO NOTHING;

-- 12. BRIDGE COURSES (For Closing Detected Skill Gaps)
INSERT INTO bridge_courses (course_id, skill_id, course_title, provider_name, course_url, estimated_hours, course_cost, rating) VALUES
('22220000-0000-0000-0000-000000000001', '11110000-0000-0000-0000-000000000001', 'Modern Instrumental Methods of Herbal Drug Analysis', 'Swayam / NPTEL (IIT Kharagpur)', 'https://swayam.gov.in/herbal-analysis', 30, 'FREE', 4.8),
('22220000-0000-0000-0000-000000000002', '11110000-0000-0000-0000-000000000005', 'Clinical Research & Pharmacovigilance in Traditional Medicine', 'CCRAS National Training Portal', 'https://ccras.res.in/gcp-training', 20, 'FREE', 4.9),
('22220000-0000-0000-0000-000000000003', '11110000-0000-0000-0000-000000000008', 'Introduction to Biostatistics for Clinical Health Trials', 'Coursera (Johns Hopkins)', 'https://coursera.org/biostats-clinical', 25, 'SUBSIDIZED', 4.7)
ON CONFLICT (course_id) DO NOTHING;

-- 13. STUDENTS
INSERT INTO students (student_id, user_id, institution_id, department_id, program_id, mentor_id, enrollment_number, roll_number, current_semester, batch_year, cgpa, active_backlogs, resume_url, portfolio_url, placement_status) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'NIA/BAMS/2023/042', 'BAMS-23-42', 7, 2026, 8.85, 0, 'https://cdn.portal.edu/resumes/aarav_sharma.pdf', 'https://aarav-ayush-portfolio.dev', 'SEEKING'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'NIA/MPHARM/2024/015', 'MPH-24-15', 3, 2026, 9.20, 0, 'https://cdn.portal.edu/resumes/priya_nair.pdf', 'https://priyanair-herbalchem.in', 'SEEKING'),
('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'NIA/BAMS/2023/089', 'BAMS-23-89', 7, 2026, 7.40, 1, 'https://cdn.portal.edu/resumes/rohan_verma.pdf', NULL, 'SEEKING')
ON CONFLICT (student_id) DO NOTHING;

-- 14. STUDENT SKILLS (Showing proficiency and verified status)
INSERT INTO student_skills (student_id, skill_id, proficiency_level, proficiency_score, verification_source, verified_by_mentor_id) VALUES
-- Student Aarav Sharma (Clinical Specialist)
('55555555-5555-5555-5555-555555555551', '11110000-0000-0000-0000-000000000003', 'EXPERT', 92, 'FACULTY_VERIFIED', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555551', '11110000-0000-0000-0000-000000000004', 'ADVANCED', 85, 'FACULTY_VERIFIED', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555551', '11110000-0000-0000-0000-000000000005', 'INTERMEDIATE', 70, 'SELF_REPORTED', NULL),
('55555555-5555-5555-5555-555555555551', '11110000-0000-0000-0000-000000000007', 'ADVANCED', 88, 'PROJECT_PROVEN', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),

-- Student Priya Nair (R&D / Phyto Analysis Specialist)
('55555555-5555-5555-5555-555555555552', '11110000-0000-0000-0000-000000000001', 'EXPERT', 96, 'FACULTY_VERIFIED', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555552', '11110000-0000-0000-0000-000000000002', 'ADVANCED', 90, 'FACULTY_VERIFIED', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555552', '11110000-0000-0000-0000-000000000006', 'ADVANCED', 84, 'PROJECT_PROVEN', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555552', '11110000-0000-0000-0000-000000000009', 'INTERMEDIATE', 76, 'SELF_REPORTED', NULL),

-- Student Rohan Verma (Has gaps in HPLC & GCP)
('55555555-5555-5555-5555-555555555553', '11110000-0000-0000-0000-000000000003', 'BEGINNER', 55, 'SELF_REPORTED', NULL),
('55555555-5555-5555-5555-555555555553', '11110000-0000-0000-0000-000000000004', 'INTERMEDIATE', 68, 'SELF_REPORTED', NULL)
ON CONFLICT (student_id, skill_id) DO NOTHING;

-- 15. JOB & INTERNSHIP POSTINGS
INSERT INTO job_postings (job_id, company_id, recruiter_id, title, opportunity_type, work_mode, description, responsibilities, eligibility_criteria, min_cgpa, max_active_backlogs, vacancies, duration_months, stipend_or_ctc, job_location, application_deadline, status) VALUES
('66666666-6666-6666-6666-666666666661', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'ffffffff-ffff-ffff-ffff-fffffffffff1', 'Clinical Research & Pharmacovigilance Associate Intern', 'INTERNSHIP', 'HYBRID', 'Join Dabur Research & Development Centre to document and monitor clinical evidence for proprietary Ayurvedic formulations.', 'Conduct ADR signal detection, maintain Ayush clinical records, draft GCP-compliant documentation.', 'Final year BAMS or MD Ayurveda with strong understanding of Ayurvedic diagnostics and drug safety.', 7.50, 0, 4, 6, 35000.00, 'Ghaziabad, NCR', '2026-11-30', 'OPEN'),
('66666666-6666-6666-6666-666666666662', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'ffffffff-ffff-ffff-ffff-fffffffffff2', 'Phytochemical Quality Analyst & Standardization Intern', 'INTERNSHIP', 'ONSITE', 'Hands-on training in botanical extract fingerprinting using HPLC and HPTLC at Himalaya R&D labs.', 'Analyze raw herb samples, validate marker compounds, prepare Schedule T documentation.', 'M.Pharm (Ayurveda) or BAMS with laboratory instrumentation experience.', 8.00, 0, 2, 6, 30000.00, 'Makali, Bengaluru', '2026-10-31', 'OPEN'),
('66666666-6666-6666-6666-666666666663', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'ffffffff-ffff-ffff-ffff-fffffffffff3', 'Junior Clinical Data Scientist - Ayurvedic Trials', 'PLACEMENT_FULL_TIME', 'ONSITE', 'Patanjali Research Foundation is hiring graduates to perform biostatistical analysis and clinical study coordination.', 'Analyze randomized clinical trial data, use R/Python for Kaplan-Meier curves, coordinate with institutional ethics committees.', 'Postgraduates in Health Informatics, MD Ayurveda, or allied fields.', 7.00, 0, 5, NULL, 650000.00, 'Haridwar, Uttarakhand', '2026-12-15', 'OPEN')
ON CONFLICT (job_id) DO NOTHING;

-- 16. JOB REQUIRED SKILLS (With Criticality & Weightage)
INSERT INTO job_required_skills (job_id, skill_id, criticality, min_proficiency_level, weightage) VALUES
-- Job 1 (Dabur Clinical Research Associate)
('66666666-6666-6666-6666-666666666661', '11110000-0000-0000-0000-000000000005', 'MANDATORY', 'INTERMEDIATE', 35), -- GCP & Pharmacovigilance
('66666666-6666-6666-6666-666666666661', '11110000-0000-0000-0000-000000000003', 'MANDATORY', 'INTERMEDIATE', 30), -- Panchakarma
('66666666-6666-6666-6666-666666666661', '11110000-0000-0000-0000-000000000007', 'PREFERRED', 'INTERMEDIATE', 20), -- Ayush EHR
('66666666-6666-6666-6666-666666666661', '11110000-0000-0000-0000-000000000009', 'OPTIONAL', 'BEGINNER', 15),     -- Scientific Writing

-- Job 2 (Himalaya Phytochemical Analyst)
('66666666-6666-6666-6666-666666666662', '11110000-0000-0000-0000-000000000001', 'MANDATORY', 'ADVANCED', 45),     -- HPLC
('66666666-6666-6666-6666-666666666662', '11110000-0000-0000-0000-000000000002', 'MANDATORY', 'INTERMEDIATE', 30), -- Botanical Extraction
('66666666-6666-6666-6666-666666666662', '11110000-0000-0000-0000-000000000006', 'PREFERRED', 'INTERMEDIATE', 25), -- Schedule T & GMP

-- Job 3 (Patanjali Clinical Data Scientist)
('66666666-6666-6666-6666-666666666663', '11110000-0000-0000-0000-000000000008', 'MANDATORY', 'ADVANCED', 40),     -- Biostatistics R/Python
('66666666-6666-6666-6666-666666666663', '11110000-0000-0000-0000-000000000005', 'MANDATORY', 'INTERMEDIATE', 30), -- GCP
('66666666-6666-6666-6666-666666666663', '11110000-0000-0000-0000-000000000009', 'PREFERRED', 'INTERMEDIATE', 30)  -- Scientific Writing
ON CONFLICT (job_id, skill_id) DO NOTHING;

-- 17. JOB APPLICATIONS
INSERT INTO job_applications (application_id, job_id, student_id, cover_letter, automated_skill_match_percentage, current_status) VALUES
('77777777-7777-7777-7777-777777777771', '66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 'I am enthusiastic about applying my clinical Ayurveda background and verified Panchakarma skills to Dabur R&D projects.', 85.00, 'SHORTLISTED'),
('77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555552', 'Having published work on HPLC standardization of Ashwagandha extracts, I would love to contribute to Himalaya’s QC operations.', 95.00, 'OFFERED')
ON CONFLICT (job_id, student_id) DO NOTHING;

-- 18. APPLICATION STAGES
INSERT INTO application_stages (application_id, stage_name, status, feedback_notes, changed_by_user_id) VALUES
('77777777-7777-7777-7777-777777777772', 'RESUME_SCREENING', 'PASSED', 'Candidate has top tier HPLC expertise and 9.2 CGPA', '33333333-3333-3333-3333-333333333332'),
('77777777-7777-7777-7777-777777777772', 'TECHNICAL_INTERVIEW', 'PASSED', 'Demonstrated exceptional understanding of chromatographic peak separation', '33333333-3333-3333-3333-333333333332'),
('77777777-7777-7777-7777-777777777772', 'OFFER_RELEASE', 'PASSED', 'Official offer letter generated with INR 30,000/mo stipend', '33333333-3333-3333-3333-333333333332');

-- 19. FORMAL OFFER
INSERT INTO offers (offer_id, application_id, job_id, student_id, offered_stipend_or_ctc, joining_date, offer_expiry_date, student_response) VALUES
('88888888-8888-8888-8888-888888888881', '77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555552', 30000.00, '2026-11-15', '2026-11-05', 'ACCEPTED')
ON CONFLICT (application_id) DO NOTHING;

-- 20. NO OBJECTION CERTIFICATE (NOC) WORKFLOW
INSERT INTO noc_requests (noc_id, application_id, student_id, institution_id, mentor_id, mentor_approval_status, mentor_remarks, mentor_approved_at, tpo_approval_status, tpo_remarks, tpo_approved_at, final_status, noc_document_hash, noc_pdf_url) VALUES
('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777772', '55555555-5555-5555-5555-555555555552', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'APPROVED', 'Priya has finished all lab coursework with distinction. Recommended for industry immersion.', CURRENT_TIMESTAMP, 'APPROVED', 'NOC cleared. Aligned with MoU quotas.', CURRENT_TIMESTAMP, 'APPROVED', 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'https://cdn.portal.edu/nocs/NOC-NIA-2026-0042.pdf')
ON CONFLICT (application_id) DO NOTHING;

-- 21. FORMAL MEMORANDUM OF UNDERSTANDING (MoU)
INSERT INTO mous (mou_id, institution_id, company_id, mou_reference_code, title, scope_description, commencement_date, expiry_date, annual_internship_quota, status) VALUES
('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'MOU-NIA-DABUR-2025-01', 'Bilateral Academia-Industry Research & Placement Agreement', 'Joint formulation R&D, clinical trial training, curriculum board advisory, and guaranteed annual hiring quota.', '2025-01-01', '2028-12-31', 15, 'ACTIVE'),
('aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'MOU-NIA-HIMALAYA-2025-02', 'Strategic Botanical Phytochemical Immersion & Internship MoU', 'Collaborative analytical chromatography lab development and dedicated postgraduate internships.', '2025-06-01', '2028-05-31', 10, 'ACTIVE')
ON CONFLICT (mou_reference_code) DO NOTHING;

-- 22. COLLABORATION PROJECTS
INSERT INTO collaboration_projects (project_id, mou_id, institution_id, company_id, project_title, domain, lead_faculty_id, industry_mentor_name, sanctioned_budget, start_date, end_date, status, deliverables_summary) VALUES
('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'Standardization of Polyherbal Anti-Diabetic Formulations', 'AYUSH_PHARMACEUTICALS', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dr. J. L. N. Sastry', 1500000.00, '2025-03-01', '2026-08-31', 'IN_PROGRESS', 'Publish monographs, establish HPLC finger-printing database, and provide 3 student fellowships.')
ON CONFLICT (project_id) DO NOTHING;

-- 23. GUEST LECTURES
INSERT INTO guest_lectures (lecture_id, institution_id, company_id, topic, speaker_name, speaker_designation, target_department_id, event_date, attendees_count, feedback_score) VALUES
('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'Modern Regulatory Pathways for Botanical Drugs in USA & EU', 'Dr. Pralhad Patki', 'Head of Clinical Development, Himalaya Wellness', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '2026-08-20', 145, 4.85)
ON CONFLICT (lecture_id) DO NOTHING;
