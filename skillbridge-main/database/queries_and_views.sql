-- ============================================================================
-- SMART INDIA HACKATHON (SIH) 2026 - PROBLEM STATEMENT SIH26044
-- ANALYTICAL VIEWS & SKILL-GAP MATCHING ALGORITHMS
-- ============================================================================

-- ============================================================================
-- VIEW 1: DYNAMIC STUDENT-TO-JOB SKILL MATCH CALCULATOR
-- Computes the exact match percentage between any student and any job posting.
-- Incorporates mandatory vs preferred weighting.
-- ============================================================================
CREATE OR REPLACE VIEW v_student_job_skill_match AS
WITH job_skill_weights AS (
    SELECT 
        job_id,
        SUM(weightage) AS total_weight,
        COUNT(CASE WHEN criticality = 'MANDATORY' THEN 1 END) AS total_mandatory_skills
    FROM job_required_skills
    GROUP BY job_id
),
student_skill_evaluation AS (
    SELECT 
        jrs.job_id,
        s.student_id,
        jrs.skill_id,
        jrs.criticality,
        jrs.weightage,
        jrs.min_proficiency_level,
        ss.proficiency_level AS student_proficiency,
        ss.proficiency_score,
        ss.verification_source,
        CASE 
            WHEN ss.student_skill_id IS NOT NULL THEN TRUE 
            ELSE FALSE 
        END AS is_skill_present,
        CASE
            -- Full weight if proficiency meets or exceeds requirement
            WHEN ss.proficiency_level = jrs.min_proficiency_level 
                 OR (jrs.min_proficiency_level = 'BEGINNER' AND ss.proficiency_level IN ('INTERMEDIATE', 'ADVANCED', 'EXPERT'))
                 OR (jrs.min_proficiency_level = 'INTERMEDIATE' AND ss.proficiency_level IN ('ADVANCED', 'EXPERT'))
                 OR (jrs.min_proficiency_level = 'ADVANCED' AND ss.proficiency_level = 'EXPERT') 
                 THEN jrs.weightage
            -- Partial credit (50%) if student has skill but lower proficiency
            WHEN ss.student_skill_id IS NOT NULL THEN (jrs.weightage * 0.5)
            ELSE 0
        END AS earned_weight,
        CASE 
            WHEN jrs.criticality = 'MANDATORY' AND ss.student_skill_id IS NOT NULL THEN 1 
            ELSE 0 
        END AS mandatory_satisfied
    FROM job_required_skills jrs
    CROSS JOIN students s
    LEFT JOIN student_skills ss 
        ON ss.student_id = s.student_id 
        AND ss.skill_id = jrs.skill_id
)
SELECT 
    sse.job_id,
    jp.title AS job_title,
    c.company_name,
    sse.student_id,
    u.first_name || ' ' || u.last_name AS student_name,
    s.enrollment_number,
    jsw.total_mandatory_skills,
    SUM(sse.mandatory_satisfied) AS mandatory_skills_met,
    CASE 
        WHEN SUM(sse.mandatory_satisfied) = jsw.total_mandatory_skills THEN TRUE 
        ELSE FALSE 
    END AS all_mandatory_skills_met,
    ROUND((SUM(sse.earned_weight)::NUMERIC / NULLIF(jsw.total_weight, 0)::NUMERIC) * 100, 2) AS match_percentage
FROM student_skill_evaluation sse
JOIN job_postings jp ON jp.job_id = sse.job_id
JOIN companies c ON c.company_id = jp.company_id
JOIN students s ON s.student_id = sse.student_id
JOIN users u ON u.user_id = s.user_id
JOIN job_skill_weights jsw ON jsw.job_id = sse.job_id
GROUP BY 
    sse.job_id, jp.title, c.company_name, sse.student_id, 
    student_name, s.enrollment_number, jsw.total_mandatory_skills, jsw.total_weight;


-- ============================================================================
-- VIEW 2: SKILL GAP IDENTIFIER & BRIDGE COURSE RECOMMENDER
-- Discovers the exact missing skills for a student for any target job,
-- and recommends specific upskilling courses from NPTEL / Ayush portal.
-- ============================================================================
CREATE OR REPLACE VIEW v_student_skill_gap_report AS
SELECT 
    s.student_id,
    u.first_name || ' ' || u.last_name AS student_name,
    jp.job_id,
    jp.title AS target_job_title,
    c.company_name,
    sk.skill_id,
    sk.skill_name AS missing_or_subpar_skill,
    sk.skill_code,
    jrs.criticality,
    jrs.min_proficiency_level AS required_level,
    COALESCE(ss.proficiency_level, 'NOT_ACQUIRED') AS current_student_level,
    CASE 
        WHEN ss.student_skill_id IS NULL THEN 'MISSING_COMPLETELY'
        ELSE 'PROFICIENCY_GAP'
    END AS gap_nature,
    bc.course_title AS recommended_bridge_course,
    bc.provider_name AS course_provider,
    bc.course_url,
    bc.estimated_hours,
    bc.course_cost
FROM job_required_skills jrs
JOIN job_postings jp ON jp.job_id = jrs.job_id
JOIN companies c ON c.company_id = jp.company_id
JOIN skills sk ON sk.skill_id = jrs.skill_id
CROSS JOIN students s
JOIN users u ON u.user_id = s.user_id
LEFT JOIN student_skills ss 
    ON ss.student_id = s.student_id 
    AND ss.skill_id = jrs.skill_id
LEFT JOIN bridge_courses bc 
    ON bc.skill_id = sk.skill_id
WHERE 
    -- Filter where student either does not have the skill, or proficiency is below required
    ss.student_skill_id IS NULL 
    OR (
        jrs.min_proficiency_level = 'EXPERT' AND ss.proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    )
    OR (
        jrs.min_proficiency_level = 'ADVANCED' AND ss.proficiency_level IN ('BEGINNER', 'INTERMEDIATE')
    )
    OR (
        jrs.min_proficiency_level = 'INTERMEDIATE' AND ss.proficiency_level = 'BEGINNER'
    );


-- ============================================================================
-- VIEW 3: INDUSTRY TRENDING SKILLS TELEMETRY (For Academic Curriculum Review)
-- Informs universities and Board of Studies what skills are surging in market demand.
-- ============================================================================
CREATE OR REPLACE VIEW v_trending_industry_skills AS
SELECT 
    sk.skill_id,
    sk.skill_name,
    sk.skill_code,
    sc.category_name,
    COUNT(jrs.job_id) AS demand_frequency_in_jobs,
    SUM(CASE WHEN jrs.criticality = 'MANDATORY' THEN 1 ELSE 0 END) AS mandatory_requirement_count,
    ROUND(AVG(jrs.weightage), 1) AS average_weightage,
    sk.industry_demand_weight,
    COUNT(DISTINCT jp.company_id) AS hiring_companies_count
FROM skills sk
JOIN skill_categories sc ON sc.category_id = sk.category_id
LEFT JOIN job_required_skills jrs ON jrs.skill_id = sk.skill_id
LEFT JOIN job_postings jp ON jp.job_id = jrs.job_id AND jp.status = 'OPEN'
GROUP BY 
    sk.skill_id, sk.skill_name, sk.skill_code, sc.category_name, sk.industry_demand_weight
ORDER BY 
    demand_frequency_in_jobs DESC, sk.industry_demand_weight DESC;


-- ============================================================================
-- VIEW 4: TPO & INSTITUTION PLACEMENT DASHBOARD
-- Ready-to-use metrics for NIRF / NAAC / Ayush Board reporting.
-- ============================================================================
CREATE OR REPLACE VIEW v_institution_placement_analytics AS
SELECT 
    i.institution_id,
    i.name AS institution_name,
    d.department_name,
    p.program_name,
    COUNT(DISTINCT s.student_id) AS total_registered_students,
    COUNT(DISTINCT CASE WHEN s.placement_status = 'PLACED' THEN s.student_id END) AS total_placed,
    COUNT(DISTINCT CASE WHEN s.placement_status = 'INTERNING' THEN s.student_id END) AS total_interning,
    COUNT(DISTINCT CASE WHEN s.placement_status = 'SEEKING' THEN s.student_id END) AS total_seeking,
    ROUND(
        (COUNT(DISTINCT CASE WHEN s.placement_status IN ('PLACED', 'INTERNING') THEN s.student_id END)::NUMERIC / 
        NULLIF(COUNT(DISTINCT s.student_id), 0)::NUMERIC) * 100, 2
    ) AS placement_internship_rate_pct,
    ROUND(AVG(o.offered_stipend_or_ctc), 2) AS average_package_or_stipend
FROM institutions i
JOIN departments d ON d.institution_id = i.institution_id
JOIN programs p ON p.department_id = d.department_id
LEFT JOIN students s ON s.program_id = p.program_id
LEFT JOIN offers o ON o.student_id = s.student_id AND o.student_response = 'ACCEPTED'
GROUP BY 
    i.institution_id, i.name, d.department_name, p.program_name;


-- ============================================================================
-- VIEW 5: ACADEMIA-INDUSTRY MoU HEALTH & FULFILLMENT INDEX
-- Tracks whether signed MoUs are yielding actual student internships and projects.
-- ============================================================================
CREATE OR REPLACE VIEW v_active_mou_health AS
SELECT 
    m.mou_id,
    m.mou_reference_code,
    i.name AS institution_name,
    c.company_name,
    m.commencement_date,
    m.expiry_date,
    m.annual_internship_quota,
    COUNT(DISTINCT cp.project_id) AS active_collaborative_projects,
    COUNT(DISTINCT gl.lecture_id) AS guest_lectures_conducted,
    COUNT(DISTINCT ic.completion_id) AS students_interned_this_cycle,
    CASE 
        WHEN COUNT(DISTINCT ic.completion_id) >= m.annual_internship_quota THEN 'QUOTA_EXCEEDED'
        WHEN COUNT(DISTINCT ic.completion_id) >= (m.annual_internship_quota * 0.5) THEN 'HEALTHY'
        ELSE 'UNDER_UTILIZED'
    END AS mou_health_status
FROM mous m
JOIN institutions i ON i.institution_id = m.institution_id
JOIN companies c ON c.company_id = m.company_id
LEFT JOIN collaboration_projects cp ON cp.mou_id = m.mou_id
LEFT JOIN guest_lectures gl ON gl.company_id = c.company_id AND gl.institution_id = i.institution_id
LEFT JOIN internship_completions ic ON ic.company_id = c.company_id
WHERE m.status = 'ACTIVE'
GROUP BY 
    m.mou_id, m.mou_reference_code, i.name, c.company_name, 
    m.commencement_date, m.expiry_date, m.annual_internship_quota;
