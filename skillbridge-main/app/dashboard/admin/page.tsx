"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock, 
  Loader2 
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Demo users fetch
    fetch("/api/auth/session")
      .then(() => {
        setUsers([
          { id: "1", name: "Aarav Sharma", email: "aarav.sharma@student.nia.ac.in", role: "STUDENT", status: "ACTIVE" },
          { id: "2", name: "Priya Nair", email: "priya.nair@student.nia.ac.in", role: "STUDENT", status: "ACTIVE" },
          { id: "3", name: "Dr. Arvind Tripathi", email: "faculty.mentor@nia.nic.in", role: "FACULTY", status: "ACTIVE" },
          { id: "4", name: "Vikram Malhotra", email: "corporate.hr@dabur.com", role: "INDUSTRY", status: "VERIFIED" },
          { id: "5", name: "Prof. Sanjeev Sharma", email: "director@nia.nic.in", role: "INSTITUTION", status: "ACTIVE" },
        ]);
      })
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
            🛡️ Central Platform Administrator
          </span>
          <span className="text-xs text-slate-500 font-medium">Ministry of Ayush / SIH Regulatory Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          System Administration & Compliance Oversight
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor multi-institutional data integrity, verify corporate partners, and review statutory audit trails.
        </p>
      </div>

      {/* User Management */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">User & Institutional Accounts Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage access control, verify corporate identities, and audit roles</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">System Audit Trail & Security Logs</h2>
        <div className="space-y-2 text-xs">
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">[NOC_APPROVED]</span> Student Priya Nair (NIA) digital NOC endorsed by TPO Dr. Arvind Tripathi.
            </div>
            <span className="text-slate-400">10 mins ago</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">[MOU_REGISTERED]</span> Bilateral research agreement executed between NIA Jaipur and Dabur India Ltd.
            </div>
            <span className="text-slate-400">1 hour ago</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">[ASSESSMENT_CLEARED]</span> HPLC Standardization quiz submitted with 100% score by candidate Priya Nair.
            </div>
            <span className="text-slate-400">2 hours ago</span>
          </div>
        </div>
      </div>

    </div>
  );
}
