import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Bot, 
  FileText, 
  Lock, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Building,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CaseItem, Language } from '../types';
import { translations } from '../data/translations';

interface DirectorPortalProps {
  cases: CaseItem[];
  language: Language;
  onDirectorApprove: (caseId: string, comments?: string) => void;
  onDirectorReject: (caseId: string, reason: string) => void;
  onViewCertificate: (caseItem: CaseItem) => void;
  onOpenGovAi: () => void;
}

export const DirectorPortal: React.FC<DirectorPortalProps> = ({
  cases,
  language,
  onDirectorApprove,
  onDirectorReject,
  onViewCertificate,
  onOpenGovAi
}) => {
  const t = translations[language];

  // Cases pending director review or approved by director
  const pendingCases = cases.filter(c => c.status === 'director_pending' || c.status === 'escalated');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(pendingCases[0]?.id || cases[0]?.id);
  const [approvalComment, setApprovalComment] = useState('Reconciled and certified under Proclamation No. 979/2016.');
  const [aiBriefingRefreshed, setAiBriefingRefreshed] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleApprove = () => {
    if (!selectedCase) return;
    onDirectorApprove(selectedCase.id, approvalComment);
  };

  const handleReject = () => {
    if (!selectedCase) return;
    onDirectorReject(selectedCase.id, 'Returned by Executive Director for re-audit.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Executive Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-purple-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Executive Director Suite • የዳይሬክተር ማዕከል
              </span>
              <span className="text-xs text-slate-400 font-mono">Dr. Kassahun Tadesse (Bureau Chief)</span>
            </div>
            <h2 className="text-xl font-black text-slate-100">
              High-Level Executive Endorsements & Strategic Oversight
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Final sign-off authority for high-value tax clearances, customs duty exemptions, penalty waivers, and AI-driven department performance tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenGovAi}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Director GovAI Advisory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Director AI Morning Briefing Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-800/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Director's Morning AI Strategic Briefing
              </h3>
              <p className="text-[11px] text-slate-400">
                Generated today at 07:30 AM • Comprehensive Bureau Analytics
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiBriefingRefreshed(!aiBriefingRefreshed)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
          >
            <RefreshCw className="w-3 h-3 text-purple-400" />
            <span>Recalculate Briefing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Weekly Processed Cases</span>
            <span className="text-xl font-black text-slate-100 font-mono">1,842</span>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +14.2% YoY Increase
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Weekly Revenue Reconciled</span>
            <span className="text-xl font-black text-emerald-400 font-mono">ETB 48.6M</span>
            <div className="text-[10px] text-slate-400">Target: ETB 45.0M (108%)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Average Resolution SLA</span>
            <span className="text-xl font-black text-cyan-400 font-mono">2.8 Days</span>
            <div className="text-[10px] text-cyan-400">Fastest: Kirkos (1.9d)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">AI Detected Anomalies</span>
            <span className="text-xl font-black text-amber-400 font-mono">17</span>
            <div className="text-[10px] text-rose-400">3 require physical dry port audit</div>
          </div>
        </div>

        {/* AI Bottleneck & Strategic Recommendation Box */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Service Bottleneck & Reallocation Recommendation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            <strong>Diagnostic:</strong> Bole Sub-City revenue branch document verification turnaround is currently 3.4 days versus the 2.0-day benchmark due to a 32% spike in Category A import requests.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>
              <strong>GovAI Recommendation:</strong> Reallocate 4 verification officers from Kirkos Sub-City to Bole branch for the next 7 days.
            </span>
            <button className="px-3 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold hover:bg-emerald-600/50">
              Apply Reallocation Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Approval Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pending Executive Decisions Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Executive Approvals Queue ({pendingCases.length} waiting)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Dr. Kassahun Sign-Off
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingCases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500/60 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-400">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.status === 'director_pending'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="font-bold text-slate-100 mt-1">
                    {c.customerName}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {c.category} • <span className="text-slate-300 font-mono">TIN: {c.customerTin}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">{c.subCity} Sub-City</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ETB {c.amountEtb.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High-Level Endorsement Seal & Decision Canvas */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-purple-400 font-mono">
                      {selectedCase.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {selectedCase.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">
                    {selectedCase.customerName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    TIN: <span className="font-mono text-amber-300">{selectedCase.customerTin}</span> • Tel: {selectedCase.customerPhone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Assessment / Exemption</span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    ETB {selectedCase.amountEtb.toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* Case Summary & Verified Documents */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Reconciliation Summary & Administrative Clearance
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Verified by <strong>Admin Meron Assefa</strong> & <strong>Officer Dawit Haile</strong>. Bank transaction ledger matches declared turnover under Proclamation 979/2016 Art. 47. Ready for Ministry Digital Seal #ET-SEAL-99214.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedCase.documents.map((d) => (
                    <span key={d.id} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-400" />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Digital Seal & Executive Signature Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-purple-950/20 border-2 border-dashed border-amber-500/40 text-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-amber-300 uppercase tracking-wider">
                      Ministry Executive Digital Endorsement Seal
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    FDRE Public Key Crypto
                  </span>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Director's Official Assessment Endorsement Remarks:
                  </label>
                  <input
                    type="text"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>Signatory: <strong className="text-slate-200">Dr. Kassahun Tadesse</strong></div>
                    <div className="font-mono text-[10px]">Title: Executive Director of Revenue Assessment</div>
                    <div className="font-mono text-[10px] text-amber-400">Seal Serial: #ET-SEAL-99214</div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleReject}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject / Re-audit</span>
                    </button>

                    <button
                      onClick={handleApprove}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl shadow-xl flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>SIGN & APPLY DIGITAL SEAL</span>
                    </button>
                  </div>
                </div>

                {selectedCase.status === 'approved' && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Case Approved & Digital Certificate Issued
                    </span>
                    <button
                      onClick={() => onViewCertificate(selectedCase)}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Inspect Official Certificate</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};
