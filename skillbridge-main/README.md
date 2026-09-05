# SIH26044: Portal for Academia-Industry Collaboration for Skill Mapping, Internships, and Placement
### Smart India Hackathon (SIH) 2026 | Sponsoring Ministry: Ministry of Ayush / Higher Education

This repository contains the complete, production-grade 3NF Relational Database suite designed specifically for **SIH Problem Statement SIH26044**.

---

## Repository Structure

```
.
└── database/
    ├── schema.sql              # 32 Normalized 3NF Tables, Indexes & Foreign Keys
    ├── seed_data.sql            # Rich Ayush & Healthcare Industry Realistic Dataset
    ├── queries_and_views.sql    # Match Scoring, Skill-Gap Detection & Analytics Views
    └── DATABASE_DESIGN.md       # Full ER Diagram, Data Dictionary & Hackathon Presentation Pitch
```

---

## Key Highlights of this Database

1. **Multi-Stakeholder Architecture**:
   - Central Ministry & State Regulators
   - Universities, Colleges & National Institutes (e.g. National Institute of Ayurveda, AIIA)
   - TPOs, Deans & Faculty Mentors
   - Industry Corporates & R&D Labs (e.g. Dabur, Himalaya, Patanjali, CCRAS)
   - Students & Research Scholars

2. **Smart Skill-Gap & Recommendation Engine**:
   - Multi-tiered skill taxonomy (clinical protocols, phytochemical HPLC assay, WHO-GMP, biostatistics).
   - Multi-level skill verification (Self-Reported, Faculty-Verified, Assessment-Tested, Project-Proven).
   - Algorithmic candidate-to-job match scoring (differentiating **MANDATORY** vs **PREFERRED** skills).
   - Direct integration with bridge courses (Swayam / NPTEL / CCRAS) to close detected gaps.

3. **Institutional Governance & Compliance**:
   - Digital No Objection Certificate (NOC) approval workflow with SHA-256 integrity hashing.
   - End-of-internship logbook verification and NEP-2020 academic credit awards.
   - Active MoU health monitoring and student quota fulfillment telemetry.

---

## How to Run & Deploy

### PostgreSQL / Supabase / Neon
```bash
# 1. Connect to PostgreSQL
psql -U postgres -d sih26044_db

# 2. Execute schema, seed data, and analytical views in order
\i database/schema.sql
\i database/seed_data.sql
\i database/queries_and_views.sql
```

For complete documentation, ER diagrams, and presentation notes, refer to [DATABASE_DESIGN.md](file:///c:/Users/Shiva%20saranya/Desktop/New%20folder%20(3)/database/DATABASE_DESIGN.md).
