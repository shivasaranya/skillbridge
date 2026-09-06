"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function NewVacancyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; criticality: string }[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("INTERNSHIP");
  const [workMode, setWorkMode] = useState("ONSITE");
  const [location, setLocation] = useState("");
  const [stipendOrSalary, setStipendOrSalary] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [minCgpa, setMinCgpa] = useState("6.5");
  const [vacancies, setVacancies] = useState("1");
  const [durationMonths, setDurationMonths] = useState("");
  const [deadline, setDeadline] = useState("");

  const addSkill = () => {
    const name = newSkillInput.trim();
    if (!name) return;
    if (selectedSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setSelectedSkills([...selectedSkills, { name, criticality: "MANDATORY" }]);
    setNewSkillInput("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("Title, description, and location are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/industry/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, type, workMode, location, stipendOrSalary, description,
          responsibilities, eligibility, minCgpa: parseFloat(minCgpa),
          vacancies: parseInt(vacancies), durationMonths: durationMonths ? parseInt(durationMonths) : null,
          deadline: deadline || null,
          skills: selectedSkills,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create vacancy."); return; }
      router.push(`/industry/vacancies/${data.vacancy.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/industry/vacancies" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
          <ArrowLeft size={15} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Post New Vacancy</h1>
          <p className="text-sm text-slate-500 mt-0.5">Fill in the details to attract the right candidates.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        {/* Basic Info */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job / Role Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="e.g. Software Development Intern"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white">
                  <option value="INTERNSHIP">Internship</option>
                  <option value="JOB">Full-Time Job</option>
                  <option value="TRAINING">Training Program</option>
                  <option value="LIVE_PROJECT">Live Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Mode</label>
                <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white">
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location *</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stipend / Salary</label>
                <input type="text" value={stipendOrSalary} onChange={(e) => setStipendOrSalary(e.target.value)}
                  placeholder="e.g. ₹25,000/month"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. of Openings</label>
                <input type="number" min="1" value={vacancies} onChange={(e) => setVacancies(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Duration (months)</label>
                <input type="number" min="1" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Application Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Job Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Description *</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required
                placeholder="Describe the role, what the candidate will be doing..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Responsibilities</label>
              <textarea rows={3} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="List the key responsibilities..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none" />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Requirements</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum CGPA</label>
                <input type="number" step="0.1" min="0" max="10" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Eligibility Criteria</label>
                <input type="text" value={eligibility} onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. B.Tech CSE / IT only"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Skills <span className="text-slate-400 font-normal">(type &amp; press Add or Enter)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. Python, React, Machine Learning..."
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
                <button type="button" onClick={addSkill}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition shrink-0">
                  <Plus size={13} /> Add
                </button>
              </div>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSkills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs bg-purple-50 border border-purple-200 text-purple-700 rounded-lg px-2.5 py-1 font-semibold">
                      {s.name}
                      <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter((_, i) => i !== idx))}
                        className="text-purple-400 hover:text-red-500 transition">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <Link href="/industry/vacancies"
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {loading ? "Publishing..." : "Publish Vacancy"}
          </button>
        </div>
      </form>
    </div>
  );
}
