"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  ExternalLink,
  Loader2
} from "lucide-react";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/assessments")
      .then((res) => res.json())
      .then((data) => setAssessments(data.assessments || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleStartQuiz = (assessment: any) => {
    setActiveQuiz(assessment);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/assessments/${activeQuiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await res.json();
      setQuizResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Accredited Skill Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Assess Your Skills & Prove Competency
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Discover your strengths and bridge critical knowledge gaps. Successfully passing an assessment unlocks verified skill credentials visible to recruiters and boosts your career readiness score.
        </p>
      </div>

      {/* QUIZ RUNNER MODAL / VIEW */}
      {activeQuiz ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl mx-auto">
          
          {/* Result view */}
          {quizResult ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                {quizResult.isPassed ? (
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Award className="h-9 w-9" />
                  </div>
                ) : (
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <AlertCircle className="h-9 w-9" />
                  </div>
                )}

                <h2 className="text-2xl font-extrabold text-slate-900">
                  {quizResult.isPassed ? "Assessment Passed! Skill Verified" : "Assessment Completed (Gap Detected)"}
                </h2>

                <div className="text-4xl font-extrabold text-brand-600 my-2">
                  {quizResult.scorePercentage}%
                </div>

                <p className="text-xs text-slate-500">
                  You scored {quizResult.correctCount} out of {quizResult.totalCount} questions. Passing threshold was {quizResult.passingScore}%.
                </p>

                {quizResult.isPassed && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold max-w-md mx-auto">
                    🎉 Competency verified! "{quizResult.skillName}" has been added to your profile and your readiness score increased.
                  </div>
                )}
              </div>

              {/* Recommended Bridge Courses if failed */}
              {!quizResult.isPassed && quizResult.bridgeCourses?.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                  <div className="text-xs font-bold text-amber-900 uppercase">Recommended Bridge Courses</div>
                  {quizResult.bridgeCourses.map((bc: any) => (
                    <div key={bc.id} className="rounded-lg bg-white p-3 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{bc.title}</div>
                        <div className="text-slate-500">Provider: {bc.provider} • {bc.estimatedHours} Hours ({bc.cost})</div>
                      </div>
                      <a
                        href={bc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        Enroll <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Question Breakdown with Explanations */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Question-by-Question Review</h3>
                {quizResult.questionReview?.map((qr: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-4 space-y-1 text-xs ${
                      qr.isCorrect ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Q{idx + 1}. {qr.questionText}</span>
                      <span className={qr.isCorrect ? "text-emerald-700" : "text-red-700"}>
                        {qr.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Your answer: <strong>{qr.yourAnswer || "Not answered"}</strong> | Correct answer: <strong>{qr.correctAnswer}</strong>
                    </div>
                    {qr.explanation && (
                      <p className="text-slate-500 pt-1 italic">
                        <strong>Rationale:</strong> {qr.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="rounded-xl bg-slate-900 text-white px-6 py-2.5 text-xs font-semibold hover:bg-slate-800"
                >
                  Return to Assessments
                </button>
                <Link
                  href="/dashboard/student"
                  className="rounded-xl bg-brand-600 text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-700"
                >
                  View Updated Profile
                </Link>
              </div>

            </div>
          ) : (
            // Quiz In-Progress Questions
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{activeQuiz.title}</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    Question {currentQIndex + 1} of {activeQuiz.questions.length}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{activeQuiz.durationMinutes} mins</span>
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const q = activeQuiz.questions[currentQIndex];
                const selectedOpt = selectedAnswers[q.id];

                return (
                  <div className="space-y-4">
                    <p className="text-base font-semibold text-slate-900 leading-relaxed">
                      {q.questionText}
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { opt: "A", text: q.optionA },
                        { opt: "B", text: q.optionB },
                        { opt: "C", text: q.optionC },
                        { opt: "D", text: q.optionD },
                      ].map((item) => (
                        <button
                          key={item.opt}
                          type="button"
                          onClick={() => handleSelectOption(q.id, item.opt)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition ${
                            selectedOpt === item.opt
                              ? "border-brand-600 bg-brand-50/70 text-brand-900 font-semibold shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                              selectedOpt === item.opt
                                ? "bg-brand-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.opt}
                          </span>
                          <span className="flex-1">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Quiz Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex(currentQIndex - 1)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex(currentQIndex + 1)}
                    className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitQuiz}
                    className="rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Submit & Score</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        /* List of Available Assessments */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                    {a.difficulty} • {a.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{a.totalQuestions} Questions</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{a.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{a.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{a.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Pass: {a.passingScore}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Verifies: {a.skill?.code}</span>
                <button
                  onClick={() => handleStartQuiz(a)}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
