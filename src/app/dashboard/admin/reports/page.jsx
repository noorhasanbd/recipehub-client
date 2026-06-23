"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { getAllReports, dismissReport, resolveReportAndEraseContent } from "@/app/lib/actions/recipeActions/adminReportAction";
// import { getAllReports, dismissReport, resolveReportAndEraseContent } from "@/app/lib/actions/recipeActions/adminReportActions";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync data layer dynamically on context lifecycle mounting
  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      const response = await getAllReports();
      if (response.success && Array.isArray(response.data)) {
        setReports(response.data);
      }
      setIsLoading(false);
    }
    loadReports();
  }, []);

  const handleDismissReport = async (reportId) => {
    const response = await dismissReport(reportId);
    if (response.success) {
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      alert("Report request successfully dismissed and marked resolved.");
    } else {
      alert(`Action aborted: ${response.error || "Server processing mismatch."}`);
    }
  };

  const handleRemoveRecipe = async (reportId, recipeId, recipeTitle) => {
  if (confirm(`Are you sure you want to completely erase "${recipeTitle}"?`)) {
    const response = await resolveReportAndEraseContent(reportId, recipeId);
    if (response.success) {
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      alert("Recipe dropped and system ticket resolved successfully.");
    } else {
      alert(`Error processing cascade step: ${response.error}`);
    }
  }
};

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400 tracking-wide">Syncing system infaction databases...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Infraction Reports</h1>
        <p className="text-sm text-slate-500">Review platform complaints regarding spam, copyright issues, or offensive recipes.</p>
      </div>

      {reports.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-xl max-w-xl mx-auto space-y-2 shadow-xs">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Clear Inbox</h3>
          <p className="text-sm text-slate-400">All submitted reports have been reviewed and resolved.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <th className="p-4">Flagged Recipe Target</th>
                <th className="p-4">Reason Given</th>
                <th className="p-4">Reporter Information</th>
                <th className="p-4 text-right">Moderation Commands</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">
                      {report.targetName || "Deleted Recipe Artifact"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      ID: {report.targetId}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100/70">
                      <AlertTriangle className="w-3 h-3" /> {report.reason}
                    </span>
                    {report.details && (
                      <p className="text-xs text-slate-400 mt-1 max-w-xs italic line-clamp-2">
                        "{report.details}"
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 font-medium">{report.reporterName || "Anonymous User"}</p>
                    <p className="text-xs text-slate-400">
                      Filed {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button 
                        onClick={() => handleDismissReport(report._id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors outline-hidden focus:ring-2 focus:ring-slate-300"
                      >
                        Dismiss Flag
                      </button>
                      <button 
                        onClick={() => handleRemoveRecipe(report._id, report.targetId, report.targetName)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs outline-hidden focus:ring-2 focus:ring-red-500/20"
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