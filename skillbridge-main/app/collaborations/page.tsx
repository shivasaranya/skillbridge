"use client";

import { useEffect, useState } from "react";
import { Users, Building2, Calendar, FileText, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setCollaborations(data.collaborations || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Academia–Industry Collaborations & Bilateral MoUs
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Formal institutional agreements powering joint R&D, sponsored student hackathons, dedicated internship quotas, and curriculum advisory boards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((collab) => (
          <div key={collab.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4">
            
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                  {collab.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{collab.title}</h3>
                <p className="text-xs font-semibold text-brand-600">
                  {collab.institution?.name} × {collab.company?.companyName}
                </p>
              </div>

              <span className="inline-flex rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 border border-emerald-200">
                Active MoU
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {collab.scope}
            </p>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 flex items-center justify-between">
              <div>Annual Internship Quota: <strong>{collab.quota} Students</strong></div>
              <div>Sanctioned Budget: <strong className="text-emerald-700">₹{(collab.budget / 100000).toFixed(1)} Lakhs</strong></div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
