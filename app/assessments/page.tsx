"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Clock, Award, ArrowRight, Sparkles,
  ShieldCheck, BarChart3, Lock, Play, X, ChevronRight, Star
} from "lucide-react";

const ASSESSMENTS = [
  {
    id: "python-basics", title: "Python Programming", category: "Programming",
    difficulty: "INTERMEDIATE", duration: 30, questions: 20, passMark: 70,
    description: "Arrays, OOP, file I/O, decorators, and standard library. Passing unlocks Python-Intermediate verification badge.",
    skills: ["Python", "OOP", "Data Structures"],
    color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", border: "border-blue-200", accent: "text-blue-700",
    enrolled: 2840, avgScore: 71,
    questions_data: [
      { q: "What is the output of `print(type([]))`?", options: ["<class 'list'>","<class 'array'>","[type]","TypeError"], ans: 0 },
      { q: "Which keyword is used to define a generator function in Python?", options: ["return","yield","generate","async"], ans: 1 },
      { q: "What does `len({'a':1,'b':2})` return?", options: ["1","2","{'a','b'}","TypeError"], ans: 1 },
      { q: "Which of these is a mutable data type in Python?", options: ["tuple","string","list","int"], ans: 2 },
      { q: "What is the time complexity of Python list `.append()`?", options: ["O(n)","O(log n)","O(1)","O(n²)"], ans: 2 },
    ]
  },
  {
    id: "react-frontend", title: "React & Frontend Development", category: "Web Development",
    difficulty: "INTERMEDIATE", duration: 35, questions: 20, passMark: 70,
    description: "Hooks, component lifecycle, state management, and performance optimization in React 18.",
    skills: ["React", "JavaScript", "TypeScript"],
    color: "from-cyan-500 to-teal-500", bg: "bg-cyan-50", border: "border-cyan-200", accent: "text-cyan-700",
    enrolled: 1920, avgScore: 68,
    questions_data: [
      { q: "Which hook is used to perform side effects in React?", options: ["useState","useEffect","useMemo","useRef"], ans: 1 },
      { q: "What does the key prop do in a React list?", options: ["Styles the element","Helps React identify changed items","Sets element ID","Encrypts data"], ans: 1 },
      { q: "What is the Virtual DOM?", options: ["An actual DOM copy","A lightweight JS representation of the DOM","A server-side DOM","A browser plugin"], ans: 1 },
      { q: "What does `React.memo` do?", options: ["Memorizes state","Prevents re-render if props unchanged","Caches API calls","Stores refs"], ans: 1 },
      { q: "Which hook replaces componentDidMount?", options: ["useEffect(fn, [])","useState","useRef","useContext"], ans: 0 },
    ]
  },
  {
    id: "sql-databases", title: "SQL & Database Fundamentals", category: "Databases",
    difficulty: "BEGINNER", duration: 25, questions: 15, passMark: 65,
    description: "SELECT, JOINs, aggregations, indexes, and ACID properties. Great for data analyst and backend roles.",
    skills: ["SQL", "PostgreSQL", "Databases"],
    color: "from-emerald-500 to-green-500", bg: "bg-emerald-50", border: "border-emerald-200", accent: "text-emerald-700",
    enrolled: 3100, avgScore: 76,
    questions_data: [
      { q: "Which SQL clause filters grouped rows?", options: ["WHERE","HAVING","GROUP BY","ORDER BY"], ans: 1 },
      { q: "What type of JOIN returns all rows from both tables?", options: ["INNER JOIN","LEFT JOIN","FULL OUTER JOIN","CROSS JOIN"], ans: 2 },
      { q: "Which SQL keyword removes duplicate rows?", options: ["UNIQUE","DISTINCT","DIFFERENT","REMOVE"], ans: 1 },
      { q: "What does an INDEX do in SQL?", options: ["Filters rows","Speeds up data retrieval","Creates new tables","Encrypts columns"], ans: 1 },
      { q: "Which function returns the number of rows?", options: ["SUM()","COUNT()","MAX()","AVG()"], ans: 1 },
    ]
  },
  {
    id: "ml-basics", title: "Machine Learning Fundamentals", category: "AI & ML",
    difficulty: "ADVANCED", duration: 40, questions: 25, passMark: 75,
    description: "Supervised/unsupervised learning, model evaluation, bias-variance tradeoff, and common algorithms.",
    skills: ["Machine Learning", "Python", "TensorFlow"],
    color: "from-purple-500 to-violet-500", bg: "bg-purple-50", border: "border-purple-200", accent: "text-purple-700",
    enrolled: 1450, avgScore: 63,
    questions_data: [
      { q: "What is overfitting?", options: ["Model is too simple","Model performs well on train but poorly on test","Model is undertrained","Model has no bias"], ans: 1 },
      { q: "Which algorithm is used for classification?", options: ["Linear Regression","K-Means","Logistic Regression","PCA"], ans: 2 },
      { q: "What does cross-validation help with?", options: ["Feature selection","Hyperparameter search","Estimating generalization error","Data cleaning"], ans: 2 },
      { q: "What is the 'kernel trick' used for?", options: ["Reducing dimensions","Transforming non-linear data to higher dimensions","Normalizing data","Selecting features"], ans: 1 },
      { q: "Which metric is best for imbalanced classification?", options: ["Accuracy","F1 Score","MSE","R²"], ans: 1 },
    ]
  },
  {
    id: "dsa-cpp", title: "Data Structures & Algorithms", category: "Computer Science",
    difficulty: "ADVANCED", duration: 45, questions: 25, passMark: 70,
    description: "Arrays, linked lists, trees, graphs, sorting, searching, and time/space complexity analysis.",
    skills: ["C++", "Java", "Python"],
    color: "from-amber-500 to-orange-500", bg: "bg-amber-50", border: "border-amber-200", accent: "text-amber-700",
    enrolled: 2200, avgScore: 58,
    questions_data: [
      { q: "Time complexity of binary search?", options: ["O(n)","O(log n)","O(n log n)","O(1)"], ans: 1 },
      { q: "Which data structure uses LIFO?", options: ["Queue","Stack","Heap","Graph"], ans: 1 },
      { q: "Best sorting algorithm for nearly sorted data?", options: ["Merge Sort","Quick Sort","Insertion Sort","Heap Sort"], ans: 2 },
      { q: "Which traversal visits root first?", options: ["Inorder","Postorder","Preorder","Level Order"], ans: 2 },
      { q: "Time complexity of Dijkstra's algorithm with min-heap?", options: ["O(V²)","O(V + E)","O((V+E) log V)","O(E log V)"], ans: 2 },
    ]
  },
  {
    id: "cloud-aws", title: "Cloud Computing & AWS Basics", category: "Cloud & DevOps",
    difficulty: "INTERMEDIATE", duration: 30, questions: 20, passMark: 70,
    description: "EC2, S3, IAM, VPC, Lambda, and cloud architecture fundamentals for AWS Certified Cloud Practitioner level.",
    skills: ["AWS", "Cloud Computing", "DevOps"],
    color: "from-orange-500 to-red-500", bg: "bg-orange-50", border: "border-orange-200", accent: "text-orange-700",
    enrolled: 1680, avgScore: 72,
    questions_data: [
      { q: "What does S3 stand for?", options: ["Simple Storage Service","Secure Server Solution","Scalable Static Storage","Super Simple System"], ans: 0 },
      { q: "Which AWS service runs code without provisioning servers?", options: ["EC2","ECS","Lambda","Elastic Beanstalk"], ans: 2 },
      { q: "What is IAM used for?", options: ["Database management","Identity & Access Management","Infrastructure monitoring","Image processing"], ans: 1 },
      { q: "What is a VPC?", options: ["Virtual Private Cloud","Virtual Processing Core","Verified Public Container","Variable Port Configuration"], ans: 0 },
      { q: "Which service provides managed Kubernetes?", options: ["ECS","EKS","ECR","EMR"], ans: 1 },
    ]
  },
];

const DIFF_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-red-100 text-red-700",
};

export default function AssessmentsPage() {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  const CATEGORIES = ["ALL", ...Array.from(new Set(ASSESSMENTS.map(a => a.category)))];

  const startQuiz = (assessment: any) => {
    setActiveQuiz(assessment);
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  };

  const submitQuiz = () => {
    const qs = activeQuiz.questions_data;
    let correct = 0;
    qs.forEach((q: any, i: number) => { if (answers[i] === q.ans) correct++; });
    const score = Math.round((correct / qs.length) * 100);
    const passed = score >= activeQuiz.passMark;
    setResult({ score, correct, total: qs.length, passed });
  };

  const filtered = filter === "ALL" ? ASSESSMENTS : ASSESSMENTS.filter(a => a.category === filter);

  // Quiz Modal
  if (activeQuiz) {
    const qs = activeQuiz.questions_data;
    if (result) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-5 ${result.passed ? "bg-emerald-100" : "bg-red-50"}`}>
              {result.passed ? <Award size={40} className="text-emerald-600" /> : <X size={40} className="text-red-500" />}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{result.passed ? "Passed! 🎉" : "Not Passed"}</h2>
            <p className="text-slate-500 text-sm mb-6">{activeQuiz.title}</p>
            <div className="text-5xl font-extrabold mb-2" style={{ color: result.passed ? "#10b981" : "#ef4444" }}>{result.score}%</div>
            <p className="text-sm text-slate-500 mb-6">{result.correct}/{result.total} correct · Pass mark: {activeQuiz.passMark}%</p>
            {result.passed && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6 text-sm text-emerald-800">
                <ShieldCheck size={16} className="inline mr-1" />
                <strong>{activeQuiz.skills[0]} — Assessment Verified</strong> badge added to your profile!
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setActiveQuiz(null); setResult(null); }} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Back to Assessments
              </button>
              <button onClick={() => startQuiz(activeQuiz)} className="flex-1 rounded-xl bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700">
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    const q = qs[currentQ];
    const progress = ((currentQ + 1) / qs.length) * 100;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Quiz header */}
          <div className={`bg-gradient-to-r ${activeQuiz.color} p-5 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{activeQuiz.title}</span>
              <button onClick={() => setActiveQuiz(null)} className="rounded-lg p-1 hover:bg-white/20">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs text-white/80 mb-2">Question {currentQ + 1} of {qs.length}</div>
            <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="p-6 space-y-5">
            <p className="text-base font-bold text-slate-900 leading-snug">{q.q}</p>
            <div className="space-y-2.5">
              {q.options.map((opt: string, i: number) => (
                <button key={i} onClick={() => setAnswers({ ...answers, [currentQ]: i })}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    answers[currentQ] === i
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700"
                  }`}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)} disabled={currentQ === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50">
                ← Previous
              </button>
              {currentQ < qs.length - 1 ? (
                <button onClick={() => setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === undefined}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40">
                  Next →
                </button>
              ) : (
                <button onClick={submitQuiz} disabled={answers[currentQ] === undefined}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40">
                  Submit Quiz ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-xs font-semibold mb-4">
          <ShieldCheck size={12} /> Accredited Skill Verification
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Assess Your Skills & Prove Competency</h1>
        <p className="text-blue-100 max-w-2xl text-sm leading-relaxed mb-5">
          Take verified assessments to unlock skill badges. Passing an assessment upgrades your skill from "Self Declared" to "Assessment Verified" — making you 4× more visible to recruiters.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            { icon: BarChart3, label: "Score tracked on profile" },
            { icon: Award,     label: "Verified badges issued" },
            { icon: Lock,      label: "Proctored & tamper-proof" },
          ].map(i => (
            <div key={i.label} className="flex items-center gap-1.5 text-white/90 font-medium">
              <i.icon size={14} />{i.label}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Assessments Available", value: "6", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Students Assessed", value: "13,000+", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg. Score", value: "68%", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Verified Badges Issued", value: "4,200+", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-slate-100`}>
            <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`text-xs px-4 py-1.5 rounded-full border font-medium transition ${filter === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(assessment => (
          <div key={assessment.id} className={`rounded-2xl border ${assessment.border} bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col`}>
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${assessment.color} flex items-center justify-center mb-4 shadow-lg`}>
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex-1">{assessment.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${DIFF_COLORS[assessment.difficulty]}`}>{assessment.difficulty}</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed flex-1">{assessment.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {assessment.skills.map(s => (
                <span key={s} className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">{s}</span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Clock size={11} />{assessment.duration} min</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={11} />{assessment.questions} Qs</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-amber-500" />{assessment.avgScore}% avg</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">{assessment.enrolled.toLocaleString()} enrolled</span>
                <span className={assessment.accent}>Pass: {assessment.passMark}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${assessment.color}`} style={{ width: `${assessment.avgScore}%` }} />
              </div>
            </div>

            <button onClick={() => startQuiz(assessment)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${assessment.color} py-2.5 text-xs font-bold text-white hover:opacity-90 transition`}>
              <Play size={13} /> Start Assessment
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">How Skill Verification Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Take Assessment", desc: "Answer MCQs designed by industry experts and faculty.", icon: Play },
            { step: "02", title: "Score ≥ Pass Mark", desc: "Score above the pass threshold for the specific skill.", icon: BarChart3 },
            { step: "03", title: "Badge Awarded", desc: "Your skill gets upgraded from Self-Declared to Assessment Verified.", icon: Award },
            { step: "04", title: "Recruiter Visibility", desc: "Verified skills rank you higher in recruiter searches.", icon: ShieldCheck },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <s.icon size={20} />
              </div>
              <div className="text-[10px] font-bold text-blue-600 mb-1">STEP {s.step}</div>
              <div className="text-sm font-bold text-slate-900 mb-1">{s.title}</div>
              <div className="text-xs text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
