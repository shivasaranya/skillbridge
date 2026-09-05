"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Award, Clock, Star, Sparkles } from "lucide-react";

export default function LearningPage() {
  const courses = [
    {
      id: "1",
      title: "Modern Instrumental Methods of Herbal Drug Analysis",
      provider: "Swayam / NPTEL (IIT Kharagpur)",
      url: "https://onlinecourses.nptel.ac.in/noc24_ph01/preview",
      hours: 30,
      cost: "FREE",
      rating: 4.8,
      category: "Phytochemical & Chromatography",
      description: "Comprehensive curriculum covering HPLC, HPTLC, and UV-Vis spectrophotometric methods for Ayurvedic drug standardization.",
    },
    {
      id: "2",
      title: "Clinical Research & Pharmacovigilance in Traditional Medicine",
      provider: "CCRAS National Training Portal",
      url: "https://ccras.res.in/content/training-programmes",
      hours: 20,
      cost: "FREE",
      rating: 4.9,
      category: "Good Clinical Practice & Ethics",
      description: "Statutory reporting of Adverse Drug Reactions (ADR), clinical trial protocols, and ethics committee filings for Ayush systems.",
    },
    {
      id: "3",
      title: "Introduction to Biostatistics for Clinical Health Trials",
      provider: "Coursera (Johns Hopkins University)",
      url: "https://www.coursera.org/learn/biostatistics",
      hours: 25,
      cost: "SUBSIDIZED",
      rating: 4.7,
      category: "Health Informatics",
      description: "Hands-on data analysis using R and Python for survival analysis, Kaplan-Meier curves, and clinical trial endpoint statistics.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Industry Learning & Bridge Courses
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Close detected skill gaps and earn accredited certifications recognized by corporate recruiters and academic boards under NEP-2020.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                  {course.cost}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {course.rating}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h3>
              <p className="text-xs font-semibold text-brand-600">Provider: {course.provider}</p>
              <p className="text-xs text-slate-500 line-clamp-3">{course.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.hours} Hours
              </span>
              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-brand-600 px-3.5 py-1.5 font-semibold text-white hover:bg-brand-700 transition flex items-center gap-1"
              >
                <span>Enroll Now</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
