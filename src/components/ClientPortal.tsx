import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileSpreadsheet, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  Send, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { CaseItem, Language } from '../types';
import { CLIENT_EMPLOYEES } from '../data/mockData';
import { translations } from '../data/translations';

interface ClientPortalProps {
  cases: CaseItem[];
  language: Language;
  onOpenNewCase: () => void;
  onOpenGovAi: () => void;
  onViewCertificate: (caseItem: CaseItem) => void;
  onSendMessage: (caseId: string, text: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  cases,
  language,
  onOpenNewCase,
  onOpenGovAi,
  onViewCertificate,
  onSendMessage
}) => {
  const t = translations[language];

  // Cases associated with ABC Construction PLC or client origin
  const clientCases = cases.filter(c => c.roleOrigin === 'client' || c.customerName.includes('ABC'));
  const [selectedCaseId, setSelectedCaseId] = useState<string>(clientCases[0]?.id || 'GR-2026-00001289');
  const [activeTab, setActiveTab] = useState<'cases' | 'payroll' | 'signatories'>('cases');
  const [chatMessage, setChatMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCase = clientCases.find(c => c.id === selectedCaseId) || clientCases[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedCase) return;
    onSendMessage(selectedCase.id, chatMessage.trim());
    setChatMessage('');
  };

  const filteredEmployees = CLIENT_EMPLOYEES.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.tin.includes(searchTerm)
  );

  const totalWithheldEtb = CLIENT_EMPLOYEES.reduce((acc, curr) => acc + curr.withholdingTaxEtb, 0);
  const totalPensionEtb = CLIENT_EMPLOYEES.reduce((acc, curr) => acc + curr.pensionContributionEtb, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Organization Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Corporate Tax Client Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">TIN: 0092837123 • VAT: 9982314-V</span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              ABC Construction PLC (Grade 1 General Contractor)
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Corporate Account. Managing tax compliance for 142 permanent employees, quarterly VAT filings, subcontractor withholding certificates, and customs duty-free incentive clearance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewCase}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>File Corporate Declaration</span>
            </button>
            <button
              onClick={onOpenGovAi}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Ask Corporate GovAI
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Compliance Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Corporate Filing Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">
            Category A
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Audited Books • Proclamation 979
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Monthly Payroll Withholding</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            ETB {totalWithheldEtb.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            142 Employees Declared
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Quarterly VAT Return</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400">
            Reconciled
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Form 21 (Q3 2026)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Cases & Inquiries</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">
            {clientCases.length} Active
          </div>
          <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            1 Anomaly Under Review
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'cases' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Company Applications & Customs Cases ({clientCases.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'payroll' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Payroll Withholding Schedule (142 Staff)</span>
        </button>
        <button
          onClick={() => setActiveTab('signatories')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'signatories' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Authorized Signatories</span>
        </button>
      </div>

      {/* Tab 1: Company Cases Workspace */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Filed Corporate Applications
            </span>

            {clientCases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.status === 'escalated'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 mt-1">
                    {c.category}
                  </div>

                  {c.aiAnalysis.anomalyDetected && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-200 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{c.aiAnalysis.anomalyReason}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                    <span>Dept: {c.department}</span>
                    <span className="font-mono font-bold text-slate-200">ETB {c.amountEtb.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {selectedCase ? (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                
                <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100 font-mono">
                        {selectedCase.id}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono">
                        {selectedCase.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Filing Entity: <span className="text-slate-200 font-semibold">{selectedCase.customerName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Duty Claimed:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ETB {selectedCase.amountEtb.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* AI Anomaly Inspection Card */}
                {selectedCase.aiAnalysis.anomalyDetected && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>GovAI Customs Anomaly Alert Triggered</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedCase.aiAnalysis.anomalyReason}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-rose-900/50">
                      Recommendation: {selectedCase.aiAnalysis.recommendation}
                    </div>
                  </div>
                )}

                {/* Case Documents Vault */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Attached Invoices & Bill of Lading
                  </span>
                  {selectedCase.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="font-semibold text-slate-200">{doc.name}</span>
                          <div className="text-[10px] font-mono text-slate-400">
                            Rust Hash: {doc.rustSha256Hash.slice(0, 24)}...
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {doc.sizeKb} KB
                      </span>
                    </div>
                  ))}
                </div>

                {/* Communication with Assigned Officer */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Direct Officer Communication Channel
                  </span>

                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-44 overflow-y-auto space-y-2 text-xs">
                    {selectedCase.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-lg max-w-[85%] ${
                          m.role === 'client'
                            ? 'ml-auto bg-cyan-950/50 border border-cyan-800/60 text-cyan-100'
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

                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Message Customs Officer Tigist regarding equipment specs..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
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
      )}

      {/* Tab 2: Payroll Withholding Schedule */}
      {activeTab === 'payroll' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Monthly Employee Withholding Tax Declaration (Schedule A)
              </h3>
              <p className="text-xs text-slate-400">
                142 Employees registered under ABC Construction PLC • Month of Meskerem / September
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee by name, role, TIN..."
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400"
              />
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition">
                <Download className="w-3.5 h-3.5" />
                <span>Export Tax Ledger</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Staff ID / Name</th>
                  <th className="p-3">TIN Number</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3 text-right">Gross Salary (ETB)</th>
                  <th className="p-3 text-right">Withholding Tax</th>
                  <th className="p-3 text-right">Pension (7%)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-slate-100">{emp.fullName}</div>
                      <div className="text-[10px] text-slate-400">{emp.id}</div>
                    </td>
                    <td className="p-3 text-amber-300">{emp.tin}</td>
                    <td className="p-3 font-sans text-slate-300">{emp.role}</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {emp.grossSalaryEtb.toLocaleString()}.00
                    </td>
                    <td className="p-3 text-right text-rose-400 font-bold">
                      {emp.withholdingTaxEtb.toLocaleString()}.00
                    </td>
                    <td className="p-3 text-right text-amber-400">
                      {emp.pensionContributionEtb.toLocaleString()}.00
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Directly integrated with Ministry of Revenues e-Tax declaration gateway</span>
            </div>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow transition">
              Submit Monthly Withholding Declaration (ETB {totalWithheldEtb.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Authorized Signatories */}
      {activeTab === 'signatories' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-100">
            Authorized Corporate Signatories & Power of Attorney
          </h3>
          <p className="text-slate-400">
            Officials authorized to file tax disputes, sign duty exemptions, and receive official Ministry clearance letters on behalf of ABC Construction PLC.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100">Eng. Daniel Kassa</div>
              <div className="text-cyan-400 font-mono text-[11px]">Managing Director</div>
              <div className="text-slate-400 text-[11px]">Authorized for all contracts & clearances &gt; ETB 5,000,000</div>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                Full Power of Attorney
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100">Selamawit Daniel</div>
              <div className="text-cyan-400 font-mono text-[11px]">Chief Financial Officer</div>
              <div className="text-slate-400 text-[11px]">Authorized for VAT, withholding tax declarations & refund appeals</div>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                Tax Representative
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100">Ato Yonas Berhanu</div>
              <div className="text-cyan-400 font-mono text-[11px]">Senior Tax Accountant</div>
              <div className="text-slate-400 text-[11px]">Authorized for monthly payroll submission & receipts upload</div>
              <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
                Filing Agent
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
