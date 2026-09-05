-- ============================================================================
-- SMART INDIA HACKATHON (SIH) 2026 - PROBLEM STATEMENT SIH26044
-- Portal for Academia-Industry Collaboration for Skill Mapping, Internships & Placement
-- SPONSORED BY: Ministry of Ayush / Higher Education
-- SCHEMA DESIGN: 3NF Relational Database Schema
-- COMPATIBILITY: PostgreSQL 14+ / Supabase / Neon / MySQL 8.0+ (ANSI compliant)
-- ============================================================================

-- Enable UUID extension if using PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ACCESS CONTROL & USER IDENTITY (RBAC)
-- ============================================================================

-- Master Roles Definition
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL, -- 'SUPER_ADMIN', 'MINISTRY_OFFICER', 'INSTITUTION_ADMIN', 'TPO', 'FACULTY_MENTOR', 'COMPANY_ADMIN', 'RECRUITER', 'STUDENT'
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core User Accounts
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Role Mapping (Many-to-Many for flexible role assignment)
CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

-- Comprehensive Security & Audit Trail
CREATE TABLE audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g. 'NOC_APPROVED', 'MOU_SIGNED', 'APPLICATION_SUBMITTED'
    entity_name VARCHAR(100) NOT NULL, -- e.g. 'noc_requests', 'job_applications'
    entity_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload JSONB, -- Previous vs updated state snapshot
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ACADEMIC INSTITUTIONS & FACULTY ECOSYSTEM
-- ============================================================================

-- Academic Institutions (Universities, Colleges, Institutes of National Importance)
CREATE TABLE institutions (
    institution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    aishe_code VARCHAR(50) UNIQUE NOT NULL, -- All India Survey on Higher Education Code
    name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(100) NOT NULL, -- 'CENTRAL_UNIVERSITY', 'STATE_UNIVERSITY', 'DEEMED', 'AUTONOMOUS_COLLEGE', 'AYUSH_NATIONAL_INSTITUTE'
    category VARCHAR(100), -- 'Ayush & Allied Health', 'Engineering & Tech', 'Multidisciplinary'
    accreditation_grade VARCHAR(20), -- 'NAAC A++', 'NAAC A+', 'NIRF Top 50', 'NABH'
    website VARCHAR(255),
    official_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    address_line TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Departments within Institutions
CREATE TABLE departments (
    department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    department_name VARCHAR(150) NOT NULL, -- e.g. 'Dravyaguna Vigyana', 'Panchakarma', 'Biotechnology & Bioinformatics'
    department_code VARCHAR(50),
    hod_name VARCHAR(150),
    hod_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inst_dept UNIQUE (institution_id, department_name)
);

-- Academic Degrees and Degree Programs
CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
    program_name VARCHAR(150) NOT NULL, -- e.g. 'Bachelor of Ayurvedic Medicine and Surgery (BAMS)', 'MD Ayurveda', 'B.Tech Healthcare Informatics'
    degree_level VARCHAR(50) NOT NULL, -- 'UNDERGRADUATE', 'POSTGRADUATE', 'DOCTORAL', 'DIPLOMA'
    duration_semesters INT NOT NULL DEFAULT 8,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Mentors and Training & Placement Coordinators (TPOs)
CREATE TABLE faculty_mentors (
    mentor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL, -- e.g. 'Assistant Professor & TPO Coordinator'
    specialization TEXT,
    is_tpo_officer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mentor_user UNIQUE (user_id)
);

-- ============================================================================
-- 3. INDUSTRY PARTNERS & RECRUITERS
-- ============================================================================

-- Industry Partner Companies / Hospitals / R&D Centers
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    cin_number VARCHAR(50) UNIQUE, -- Corporate Identification Number / Registration
    gstin VARCHAR(50),
    industry_domain VARCHAR(100) NOT NULL, -- 'AYUSH_PHARMACEUTICALS', 'HERBAL_RESEARCH', 'WELLNESS_HOSPITALS', 'BIOTECH', 'CLINICAL_TRIALS', 'HEALTH_TECH'
    company_size VARCHAR(50), -- 'STARTUP_1_50', 'MID_51_200', 'ENTERPRISE_201_1000', 'CONGLOMERATE_1000_PLUS'
    website VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    description TEXT,
    logo_url TEXT,
    headquarters_address TEXT,
    headquarters_city VARCHAR(100),
    headquarters_state VARCHAR(100),
    headquarters_country VARCHAR(100) DEFAULT 'India',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter Profiles associated with Companies
CREATE TABLE recruiter_profiles (
    recruiter_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL, -- 'HR Lead - Campus Relations', 'Talent Acquisition Partner'
    linkedin_url TEXT,
    is_authorized_signatory BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_recruiter_user UNIQUE (user_id)
);

-- ============================================================================
-- 4. STUDENT TALENT REPOSITORY
-- ============================================================================

-- Student Master Records
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE RESTRICT,
    department_id UUID NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    program_id UUID NOT NULL REFERENCES programs(program_id) ON DELETE RESTRICT,
    mentor_id UUID REFERENCES faculty_mentors(mentor_id) ON DELETE SET NULL,
    enrollment_number VARCHAR(100) NOT NULL,
    roll_number VARCHAR(100),
    current_semester INT NOT NULL DEFAULT 1,
    batch_year INT NOT NULL, -- Graduation / passing out year
    cgpa NUMERIC(4, 2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    active_backlogs INT DEFAULT 0,
    resume_url TEXT,
    portfolio_url TEXT,
    github_or_linkedin TEXT,
    placement_status VARCHAR(50) DEFAULT 'SEEKING', -- 'SEEKING', 'INTERNING', 'PLACED', 'OPTED_OUT', 'HIGHER_STUDIES'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inst_enrollment UNIQUE (institution_id, enrollment_number),
    CONSTRAINT uq_student_user UNIQUE (user_id)
);

-- Student Academic History & Semester Breakdown
CREATE TABLE student_academics (
    academic_id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    semester INT NOT NULL,
    sgpa NUMERIC(4, 2) CHECK (sgpa >= 0.00 AND sgpa <= 10.00),
    total_credits INT,
    earned_credits INT,
    attendance_percentage NUMERIC(5, 2) CHECK (attendance_percentage >= 0.00 AND attendance_percentage <= 100.00),
    remarks VARCHAR(255),
    CONSTRAINT uq_student_semester UNIQUE (student_id, semester)
);

-- Student Projects, Clinical Rotations, & Work Experiences
CREATE TABLE student_experiences (
    experience_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    experience_type VARCHAR(50) NOT NULL, -- 'CLINICAL_POSTING', 'RESEARCH_PROJECT', 'PREVIOUS_INTERNSHIP', 'COMMUNITY_HEALTH'
    organization_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_ongoing BOOLEAN DEFAULT FALSE,
    description TEXT,
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Accreditations and Industry Certifications
CREATE TABLE student_certifications (
    certification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    certificate_name VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(255) NOT NULL, -- e.g. 'Ministry of Ayush', 'NPTEL', 'Coursera', 'WHO-CCRAS'
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(150),
    credential_url TEXT,
    is_verified_by_faculty BOOLEAN DEFAULT FALSE,
    verified_by_faculty_id UUID REFERENCES faculty_mentors(mentor_id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. SKILL TAXONOMY, VERIFICATION & GAP ANALYSIS ENGINE
-- ============================================================================

-- Skill Category Tree
CREATE TABLE skill_categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES skill_categories(category_id) ON DELETE CASCADE,
    category_name VARCHAR(150) NOT NULL, -- e.g. 'Clinical Diagnosis', 'Herbal Formulation', 'Pharmacovigilance', 'Bioinformatics', 'Data Analytics', 'Soft Skills'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standardized Skill Ontology
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INT NOT NULL REFERENCES skill_categories(category_id) ON DELETE RESTRICT,
    skill_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'AYU-PANCH-001', 'PHARM-HPLC-002', 'DATA-PYTHON-003'
    skill_name VARCHAR(150) NOT NULL, -- e.g. 'Panchakarma Therapy Administration', 'HPLC Chromatography', 'Ayush Clinical Documentation', 'GCP Compliance'
    description TEXT,
    industry_demand_weight NUMERIC(3, 2) DEFAULT 1.00, -- Multiplier for market demand (1.0 to 5.0)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Acquired Skills with Proficiency & Multi-level Verification
CREATE TABLE student_skills (
    student_skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) NOT NULL DEFAULT 'BEGINNER', -- 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
    proficiency_score INT CHECK (proficiency_score BETWEEN 1 AND 100),
    verification_source VARCHAR(50) DEFAULT 'SELF_REPORTED', -- 'SELF_REPORTED', 'FACULTY_VERIFIED', 'ASSESSMENT_TESTED', 'PROJECT_PROVEN'
    verified_by_mentor_id UUID REFERENCES faculty_mentors(mentor_id) ON DELETE SET NULL,
    verification_evidence_url TEXT,
    last_assessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id)
);

-- Standardized Skill Assessments (Hackathon differentiator: verified testing)
CREATE TABLE skill_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    total_questions INT NOT NULL DEFAULT 30,
    passing_score INT NOT NULL DEFAULT 60, -- Percentage
    duration_minutes INT NOT NULL DEFAULT 45,
    difficulty_level VARCHAR(50) DEFAULT 'INTERMEDIATE', -- 'EASY', 'INTERMEDIATE', 'HARD'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Assessment Scores & Badging
CREATE TABLE student_assessment_results (
    result_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES skill_assessments(assessment_id) ON DELETE CASCADE,
    score_percentage NUMERIC(5, 2) NOT NULL,
    is_passed BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proctoring_metadata JSONB
);

-- Recommended Bridge Courses for Identified Skill Gaps
CREATE TABLE bridge_courses (
    course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    course_title VARCHAR(255) NOT NULL,
    provider_name VARCHAR(150) NOT NULL, -- e.g. 'Swayam / NPTEL', 'CCRAS e-Learning', 'Coursera', 'Ayush Skill Council'
    course_url TEXT NOT NULL,
    estimated_hours INT DEFAULT 20,
    course_cost VARCHAR(50) DEFAULT 'FREE', -- 'FREE', 'SUBSIDIZED', 'PAID'
    rating NUMERIC(3, 2) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. OPPORTUNITIES (INTERNSHIPS & PLACEMENTS) LIFECYCLE
-- ============================================================================

-- Job / Internship Postings
CREATE TABLE job_postings (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES recruiter_profiles(recruiter_id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL, -- e.g. 'Ayurvedic Clinical Research Associate Intern', 'Herbal Formulation Quality Analyst'
    opportunity_type VARCHAR(50) NOT NULL, -- 'INTERNSHIP', 'PLACEMENT_FULL_TIME', 'RESEARCH_FELLOWSHIP', 'TRAINEESHIP'
    work_mode VARCHAR(50) NOT NULL DEFAULT 'ONSITE', -- 'ONSITE', 'REMOTE', 'HYBRID'
    description TEXT NOT NULL,
    responsibilities TEXT,
    eligibility_criteria TEXT,
    min_cgpa NUMERIC(4, 2) DEFAULT 0.00,
    max_active_backlogs INT DEFAULT 2,
    vacancies INT NOT NULL DEFAULT 1,
    duration_months INT DEFAULT 6, -- Duration if internship
    stipend_or_ctc NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Monthly stipend (INR) or Annual CTC
    stipend_type VARCHAR(50) DEFAULT 'FIXED_MONTHLY', -- 'FIXED_MONTHLY', 'PERFORMANCE_BASED', 'UNPAID_VOLUNTARY'
    job_location VARCHAR(200) NOT NULL,
    application_deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN', -- 'DRAFT', 'OPEN', 'UNDER_REVIEW', 'CLOSED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Required Skills per Posting with Criticality Weighting (Key for Skill Gap Engine)
CREATE TABLE job_required_skills (
    job_skill_id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES job_postings(job_id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    criticality VARCHAR(50) NOT NULL DEFAULT 'MANDATORY', -- 'MANDATORY', 'PREFERRED', 'OPTIONAL'
    min_proficiency_level VARCHAR(50) NOT NULL DEFAULT 'INTERMEDIATE', -- 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
    weightage INT NOT NULL DEFAULT 10, -- 1 to 100 weight for match scoring
    CONSTRAINT uq_job_skill UNIQUE (job_id, skill_id)
);

-- Target Programs Allowed to Apply (Eligibility filter)
CREATE TABLE job_target_programs (
    job_program_id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES job_postings(job_id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(program_id) ON DELETE CASCADE,
    CONSTRAINT uq_job_program UNIQUE (job_id, program_id)
);

-- Applications Submitted by Students
CREATE TABLE job_applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES job_postings(job_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_version_url TEXT,
    automated_skill_match_percentage NUMERIC(5, 2) DEFAULT 0.00, -- Computed at time of application
    current_status VARCHAR(50) DEFAULT 'APPLIED', -- 'APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_job_application UNIQUE (job_id, student_id)
);

-- Application Stage History & Tracking
CREATE TABLE application_stages (
    stage_id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES job_applications(application_id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL, -- 'RESUME_SCREENING', 'SKILL_EVALUATION', 'TECHNICAL_INTERVIEW', 'OFFER_RELEASE'
    status VARCHAR(50) NOT NULL, -- 'PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED'
    feedback_notes TEXT,
    changed_by_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Scheduling
CREATE TABLE interviews (
    interview_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES job_applications(application_id) ON DELETE CASCADE,
    round_number INT NOT NULL DEFAULT 1,
    round_title VARCHAR(100) NOT NULL, -- 'Clinical Viva Round', 'Analytical Skills & Lab Assessment', 'HR Cultural Round'
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 45,
    meeting_link TEXT,
    location_details TEXT,
    interviewer_notes TEXT,
    rating NUMERIC(3, 1) CHECK (rating BETWEEN 1.0 AND 10.0),
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'RESCHEDULED', 'CANDIDATE_ABSENT', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Formal Offers Released to Students
CREATE TABLE offers (
    offer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES job_applications(application_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_postings(job_id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE RESTRICT,
    offer_letter_url TEXT,
    offered_stipend_or_ctc NUMERIC(12, 2) NOT NULL,
    joining_date DATE NOT NULL,
    offer_expiry_date DATE NOT NULL,
    student_response VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'
    student_response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_offer_application UNIQUE (application_id)
);

-- ============================================================================
-- 7. INSTITUTIONAL COMPLIANCE, NOC & INTERNSHIP LOGS
-- ============================================================================

-- College No Objection Certificate (NOC) Digital Workflow
CREATE TABLE noc_requests (
    noc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES job_applications(application_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES faculty_mentors(mentor_id) ON DELETE SET NULL,
    mentor_approval_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    mentor_remarks TEXT,
    mentor_approved_at TIMESTAMP,
    tpo_approval_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    tpo_remarks TEXT,
    tpo_approved_at TIMESTAMP,
    final_status VARCHAR(50) DEFAULT 'UNDER_PROCESS', -- 'UNDER_PROCESS', 'APPROVED', 'REJECTED', 'REVOKED'
    noc_document_hash VARCHAR(128), -- Digital verification fingerprint
    noc_pdf_url TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_app_noc UNIQUE (application_id)
);

-- Internship Performance & Completion Logs (Final Milestone)
CREATE TABLE internship_completions (
    completion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES job_applications(application_id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE RESTRICT,
    supervisor_name VARCHAR(150) NOT NULL,
    supervisor_email VARCHAR(255) NOT NULL,
    total_hours_completed INT NOT NULL,
    industry_rating NUMERIC(3, 1) CHECK (industry_rating BETWEEN 1.0 AND 5.0),
    performance_feedback TEXT,
    completion_certificate_url TEXT,
    academic_credits_awarded INT DEFAULT 4,
    verified_by_tpo BOOLEAN DEFAULT FALSE,
    completion_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. ACADEMIA-INDUSTRY COLLABORATION, MoUs & KNOWLEDGE EXCHANGE
-- ============================================================================

-- Formal Memorandums of Understanding (MoUs)
CREATE TABLE mous (
    mou_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    mou_reference_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'MOU-NIA-DABUR-2026-01'
    title VARCHAR(255) NOT NULL,
    scope_description TEXT NOT NULL, -- e.g. 'Joint R&D in Ayurvedic Pharmacopoeia, Student Clinical Rotations, Sponsored Lab Setup'
    commencement_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    annual_internship_quota INT DEFAULT 10,
    mou_document_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'DRAFT', 'ACTIVE', 'UNDER_RENEWAL', 'EXPIRED', 'TERMINATED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collaborative R&D Projects / Sponsored Student Hackathons
CREATE TABLE collaboration_projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mou_id UUID REFERENCES mous(mou_id) ON DELETE SET NULL,
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL, -- e.g. 'Standardization of Polyherbal Extracts', 'Ayurvedic AI Diagnostics'
    lead_faculty_id UUID REFERENCES faculty_mentors(mentor_id) ON DELETE SET NULL,
    industry_mentor_name VARCHAR(150),
    sanctioned_budget NUMERIC(12, 2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- 'PROPOSED', 'IN_PROGRESS', 'COMPLETED', 'PUBLISHED'
    deliverables_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Industry Guest Lectures & Faculty Immersion Sessions
CREATE TABLE guest_lectures (
    lecture_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(institution_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    speaker_name VARCHAR(150) NOT NULL,
    speaker_designation VARCHAR(150),
    target_department_id UUID REFERENCES departments(department_id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    attendees_count INT DEFAULT 0,
    recording_or_slides_url TEXT,
    feedback_score NUMERIC(3, 2) CHECK (feedback_score BETWEEN 1.00 AND 5.00),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PERFORMANCE OPTIMIZATION: INDEXES
-- ============================================================================

-- Search & Filter Indexes for Rapid Querying
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_students_inst ON students(institution_id);
CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_students_placement_status ON students(placement_status);
CREATE INDEX idx_students_cgpa ON students(cgpa);

CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_code ON skills(skill_code);
CREATE INDEX idx_student_skills_student ON student_skills(student_id);
CREATE INDEX idx_student_skills_skill ON student_skills(skill_id);

CREATE INDEX idx_job_postings_company ON job_postings(company_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_deadline ON job_postings(application_deadline);
CREATE INDEX idx_job_required_skills_job ON job_required_skills(job_id);

CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_student ON job_applications(student_id);
CREATE INDEX idx_applications_status ON job_applications(current_status);

CREATE INDEX idx_mous_inst ON mous(institution_id);
CREATE INDEX idx_mous_comp ON mous(company_id);
CREATE INDEX idx_mous_status ON mous(status);

CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
