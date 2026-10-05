import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Send, 
  Bot, 
  Eye, 
  ChevronRight, 
  Forward,
  XCircle,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { CaseItem, Language, CaseStatus } from '../types';
import { translations } from '../data/translations';

interface AdminPortalProps {
  cases: CaseItem[];
  language: Language;
  onVerifyAndForward: (caseId: string) => void;
  onEscalateCase: (caseId: string, reason: string) => void;
  onRequestDoc: (caseId: string, docName: string) => void;
  onApproveDirectly: (caseId: string) => void;
  onSendMessage: (caseId: string, text: string) => void;
  onOpenGovAi: (caseId?: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  cases,
  language,
  onVerifyAndForward,
  onEscalateCase,
  onRequestDoc,
  onApproveDirectly,
  onSendMessage,
  onOpenGovAi
}) => {
  const t = translations[language];

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'GR-2026-00001234');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [officerNote, setOfficerNote] = useState<string>('');

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const filteredCases = cases.filter(c => {
    const matchesDept = filterDepartment === 'all' || c.department === filterDepartment;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;
    const matchesSearch = 
      c.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      c.customerName.toLowerCase().includes(filterSearch.toLowerCase()) ||
      c.customerTin.toLowerCase().includes(filterSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesDept && matchesPriority && matchesSearch;
  });

  const handleSendOfficerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim() || !selectedCase) return;
    onSendMessage(selectedCase.id, officerNote.trim());
    setOfficerNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Revenue Assessment & Triage Division
              </span>
              <span className="text-xs text-slate-400 font-mono">Officer ID: OFF-0231 (Dawit Haile)</span>
            </div>
            <h2 className="text-xl font-black text-slate-100">
              Tax Case Triage & Document Verification Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Inspect submitted tax filings, review automated GovAI OCR completeness and bank discrepancies, execute administrative verifications, and forward for Executive Director seal.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenGovAi(selectedCase?.id)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>GovAI Case Auditor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-[11px] text-slate-400 mb-0.5">{t.officerStats.newCases}</div>
          <div className="text-xl font-black text-slate-100">128</div>
          <div className="text-[10px] text-emerald-400 mt-1">+14 today</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-[11px] text-slate-400 mb-0.5">{t.officerStats.inProgress}</div>
          <div className="text-xl font-black text-cyan-400">74</div>
          <div className="text-[10px] text-cyan-400 mt-1">Under OCR check</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-[11px] text-slate-400 mb-0.5">{t.officerStats.pendingApproval}</div>
          <div className="text-xl font-black text-purple-400">21</div>
          <div className="text-[10px] text-purple-400 mt-1">Ready for Director</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-[11px] text-slate-400 mb-0.5">{t.officerStats.completed}</div>
          <div className="text-xl font-black text-emerald-400">93</div>
          <div className="text-[10px] text-slate-400 mt-1">Certified this week</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-[11px] text-slate-400 mb-0.5">{t.officerStats.escalated}</div>
          <div className="text-xl font-black text-rose-400">12</div>
          <div className="text-[10px] text-rose-400 mt-1">Legal / Audit Unit</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-800/40 bg-amber-950/20 shadow-md">
          <div className="text-[11px] text-amber-300 font-semibold mb-0.5">{t.officerStats.aiAlerts}</div>
          <div className="text-xl font-black text-amber-400">7</div>
          <div className="text-[10px] text-amber-300 mt-1">Discrepancy flags</div>
        </div>
      </div>

      {/* Main Grid: Left Triage Queue & Right Case Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Case Intake Pipeline */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Filters Bar */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Filter by ID, Taxpayer, or TIN..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-slate-300 text-xs"
              >
                <option value="all">All Departments</option>
                <option value="Revenue Assessment">Revenue Assessment</option>
                <option value="Tax Audit">Tax Audit</option>
                <option value="Compliance & Legal">Compliance & Legal</option>
                <option value="Customs Clearance">Customs Clearance</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-slate-300 text-xs"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical SLA</option>
                <option value="high">High Priority</option>
                <option value="medium">Standard</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredCases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500/60 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{c.id}</span>
                    <div className="flex items-center gap-1.5">
                      {c.aiAnalysis.anomalyDetected && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          AI ALERT
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.priority === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : c.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {c.priority}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-slate-100 mt-1">
                    {c.customerName}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {c.category} • <span className="font-mono text-slate-300">{c.customerTin}</span>
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

        {/* Right Column: Case Deep-Dive Workspace */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-400 font-mono">
                      {selectedCase.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {selectedCase.department}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 text-[10px] font-bold uppercase">
                      Status: {selectedCase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">
                    {selectedCase.customerName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    TIN: <span className="font-mono text-amber-300">{selectedCase.customerTin}</span> • Tel: {selectedCase.customerPhone} • Sub-City: {selectedCase.subCity}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Assessment Value</span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    ETB {selectedCase.amountEtb.toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* GovAI Document Assistant & OCR Completeness Review */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-100 text-xs">
                        GovAI Document OCR Completeness & Anomaly Review
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Autonomous cross-check against Proclamation 979 & Bank API
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {selectedCase.aiAnalysis.ocrCompletenessPercent}% Complete
                    </span>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${selectedCase.aiAnalysis.ocrCompletenessPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommendation statement */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">AI Finding:</strong> {selectedCase.aiAnalysis.recommendation}
                </div>

                {selectedCase.aiAnalysis.anomalyDetected && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-200 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Audit Alert: Discrepancy Flagged</span>
                    </div>
                    <p>{selectedCase.aiAnalysis.anomalyReason}</p>
                  </div>
                )}
              </div>

              {/* Uploaded Documents & Rust SHA-256 Hashing */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Submitted Evidence ({selectedCase.documents.length} verified files)
                </span>

                {selectedCase.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-200">{doc.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Rust SHA-256: <span className="text-cyan-400">{doc.rustSha256Hash}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        OCR Confidence: {doc.ocrConfidence}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.sizeKb} KB
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Officer Workflow Action Buttons */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Administrative Workflow Actions
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onVerifyAndForward(selectedCase.id)}
                    className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Forward className="w-4 h-4" />
                    <span>Verify & Forward to Director</span>
                  </button>

                  <button
                    onClick={() => onRequestDoc(selectedCase.id, 'Stamped Bank Reconciliation Sheet')}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Request More Info</span>
                  </button>

                  <button
                    onClick={() => onEscalateCase(selectedCase.id, 'Discrepancy exceeds 5% variance threshold')}
                    className="p-2.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Escalate to Audit</span>
                  </button>
                </div>
              </div>

              {/* Internal Communication & Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Case Communication Log
                </span>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-40 overflow-y-auto space-y-2 text-xs">
                  {selectedCase.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-lg max-w-[85%] ${
                        m.role === 'admin'
                          ? 'ml-auto bg-amber-950/40 border border-amber-800/50 text-amber-100'
                          : m.isAi
                          ? 'mr-auto bg-emerald-950/40 border border-emerald-800/50 text-emerald-200'
                          : 'mr-auto bg-slate-800 border border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div>{m.text}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendOfficerNote} className="flex gap-2">
                  <input
                    type="text"
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    placeholder="Write official directive or message to taxpayer..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};
