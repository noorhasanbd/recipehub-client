"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Trash2, ShieldX } from "lucide-react";

export default function AdminReports() {
  // Mock report documents database array (Req 67 types)
  const [reports, setReports] = useState([
    { id: "rep1", recipeTitle: "Dangerous Fire Cocktails", reason: "Offensive Content", reportedBy: "user_491", date: "2026-06-19" },
    { id: "rep2", recipeTitle: "Stolen Pastry Imagery Guide", reason: "Copyright Issue", reportedBy: "user_102", date: "2026-06-18" },
    { id: "rep3", recipeTitle: "Buy Pills Fast Recipe Link", reason: "Spam", reportedBy: "user_882", date: "2026-06-14" },
  ]);

  const handleDismissReport = (id) => {
    setReports(reports.filter(r => r.id !== id));
    alert("Report request successfully dismissed and marked resolved.");
  };

  const handleRemoveRecipe = (id) => {
    if (confirm("Are you sure you want to remove the reported recipe from the platform?")) {
      setReports(reports.filter(r => r.id !== id));
      alert("Recipe removed and system ticket resolved successfully.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Infraction Reports</h1>
        <p className="text-sm text-slate-500">Review platform complaints regarding spam, copyright issues, or offensive recipes.</p>
      </div>

      {reports.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-xl max-w-xl mx-auto space-y-2">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Clear Inbox</h3>
          <p className="text-sm text-slate-400">All submitted reports have been reviewed and resolved.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                <th className="p-4">Flagged Recipe Target</th>
                <th className="Infraction Reason p-4">Reason Given</th>
                <th className="p-4">Reporter Information</th>
                <th className="p-4 text-right">Moderation Commands</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{report.recipeTitle}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                      <AlertTriangle className="w-3 h-3" /> {report.reason}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 font-medium">{report.reportedBy}</p>
                    <p className="text-xs text-slate-400">Filed {report.date}</p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button 
                        onClick={() => handleDismissReport(report.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      >
                        Dismiss Flag
                      </button>
                      <button 
                        onClick={() => handleRemoveRecipe(report.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Erase Content
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}