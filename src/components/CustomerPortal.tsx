import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Bot, 
  Upload, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  ChevronRight,
  Send,
  Sparkles,
  Calculator,
  Building,
  Check
} from 'lucide-react';
import { CaseItem, Language } from '../types';
import { translations } from '../data/translations';

interface CustomerPortalProps {
  cases: CaseItem[];
  language: Language;
  onOpenNewCase: () => void;
  onOpenGovAi: () => void;
  onViewCertificate: (caseItem: CaseItem) => void;
  onSendMessage: (caseId: string, text: string) => void;
  onUploadDocToCase: (caseId: string, docName: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  cases,
  language,
  onOpenNewCase,
  onOpenGovAi,
  onViewCertificate,
  onSendMessage,
  onUploadDocToCase
}) => {
  const t = translations[language];

  // Abebe Bikila's cases
  const myCases = cases.filter(c => c.roleOrigin === 'customer' || c.customerName.includes('Abebe'));
  const [selectedCaseId, setSelectedCaseId] = useState<string>(myCases[0]?.id || 'GR-2026-00001234');
  const [chatInput, setChatInput] = useState('');
  
  // Tax calculator state
  const [monthlyGrossSalary, setMonthlyGrossSalary] = useState<number>(25000);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentBranch, setAppointmentBranch] = useState('Kirkos Sub-City Office');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-10');
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selectedCase = myCases.find(c => c.id === selectedCaseId) || myCases[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedCase) return;
    onSendMessage(selectedCase.id, chatInput.trim());
    setChatInput('');
  };

  // Ethiopian Employment Income Tax Calculation (Proclamation 979/2016)
  const calculateTax = (salary: number) => {
    let tax = 0;
    if (salary <= 600) {
      tax = 0;
    } else if (salary <= 1650) {
      tax = (salary - 600) * 0.10;
    } else if (salary <= 3200) {
      tax = 1050 * 0.10 + (salary - 1650) * 0.15;
    } else if (salary <= 5250) {
      tax = 1050 * 0.10 + 1550 * 0.15 + (salary - 3200) * 0.20;
    } else if (salary <= 7800) {
      tax = 1050 * 0.10 + 1550 * 0.15 + 2050 * 0.20 + (salary - 5250) * 0.25;
    } else if (salary <= 10900) {
      tax = 1050 * 0.10 + 1550 * 0.15 + 2050 * 0.20 + 2550 * 0.25 + (salary - 7800) * 0.30;
    } else {
      tax = 1050 * 0.10 + 1550 * 0.15 + 2050 * 0.20 + 2550 * 0.25 + 3100 * 0.30 + (salary - 10900) * 0.35;
    }
    const pension = salary * 0.07;
    const net = salary - tax - pension;
    return { tax, pension, net };
  };

  const taxBreakdown = calculateTax(monthlyGrossSalary);

  return (
    <div className="space-y-6">
      
      {/* Top Citizen Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                Citizen Portal • የዜጎች መግቢያ
              </span>
              <span className="text-xs text-slate-400 font-mono">TIN: ETH-TIN-009823145</span>
            </div>
            <h2 className="text-xl font-black text-slate-100">
              Welcome, Abebe Bikila Gebremariam
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Kirkos Sub-City Tax District. Manage your tax clearances, business license assessments, track live case workflows, and communicate directly with your assigned revenue officers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewCase}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>{t.actions.newCase}</span>
            </button>
            <button
              onClick={onOpenGovAi}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask GovAI</span>
            </button>
            <button
              onClick={() => setShowAppointmentModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.customerStats.completed}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {myCases.filter(c => c.status === 'approved').length + 4}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Previous certificates verified
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.customerStats.processing}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">
            {myCases.filter(c => c.status !== 'approved' && c.status !== 'rejected').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Pending Director endorsement
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.customerStats.actionRequired}</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            0
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            All bank slips verified
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-800/40 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tax Clearance Status</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-300">
            Ready for Endorsement
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Case GR-2026-00001234
          </p>
        </div>
      </div>

      {/* Main Workspace: Left Applications List & Right Interactive Case Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: My Applications Registry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                My Revenue Applications
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {myCases.length} records
              </span>
            </div>

            <div className="space-y-2.5">
              {myCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/60 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                        c.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : c.status === 'director_pending'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-200 mt-1">
                      {c.category}
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                      <span>Officer: {c.assignedOfficerName}</span>
                      <span className="font-mono text-slate-300">ETB {c.amountEtb.toLocaleString()}</span>
                    </div>

                    {c.status === 'approved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCertificate(c);
                        }}
                        className="mt-2 w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Digital Certificate</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tax Calculator Widget */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Ethiopian Tax Brackets Estimator
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Proc 979/2016</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">
                  Monthly Gross Salary (ETB):
                </label>
                <input
                  type="number"
                  value={monthlyGrossSalary}
                  onChange={(e) => setMonthlyGrossSalary(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-100"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Income Tax (Sched A):</span>
                  <span className="text-rose-400 font-bold">ETB {taxBreakdown.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Employee Pension (7%):</span>
                  <span className="text-amber-400 font-bold">ETB {taxBreakdown.pension.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-200 pt-1 border-t border-slate-800 font-bold">
                  <span>Estimated Net Take-Home:</span>
                  <span className="text-emerald-400 font-bold">ETB {taxBreakdown.net.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Deep-Dive Tracker & Officer Communication */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              
              {/* Header with Case Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100 font-mono">
                      {selectedCase.id}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      {selectedCase.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned Officer: <span className="text-slate-200 font-semibold">{selectedCase.assignedOfficerName}</span> (Kirkos Branch)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pay Assessment Fee</span>
                  </button>
                  {selectedCase.status === 'approved' && (
                    <button
                      onClick={() => onViewCertificate(selectedCase)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Tier Workflow Visual Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Workflow Progression Tracker (Customer → Officer → Admin → Director)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1. Submitted</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Application logged</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>2. AI OCR Check</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">96% Completeness</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>3. Admin Verified</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Audit matched</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border ${
                    selectedCase.status === 'approved'
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                      : 'bg-purple-950/40 border-purple-700/60 text-purple-300 animate-pulse'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {selectedCase.status === 'approved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>4. Director Seal</span>
                    </div>
                    <span className="text-[10px] text-slate-300 block mt-0.5">
                      {selectedCase.status === 'approved' ? 'Signed & Issued' : 'Awaiting Endorsement'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Vault with Rust SHA-256 fingerprint */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Cryptographic Document Vault ({selectedCase.documents.length} verified files)
                  </span>
                  <button
                    onClick={() => onUploadDocToCase(selectedCase.id, 'Withholding_Reconciliation_Slip.pdf')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Additional File</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedCase.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-200">{doc.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Rust SHA-256: <span className="text-cyan-400">{doc.rustSha256Hash.slice(0, 20)}...</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                          OCR {doc.ocrConfidence}%
                        </span>
                        <span className="text-slate-400 font-mono">{doc.sizeKb} KB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Communication Thread (Citizen <-> Officer <-> AI) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  Direct Case Communication Channel
                </span>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-48 overflow-y-auto space-y-2.5 text-xs">
                  {selectedCase.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg max-w-[85%] ${
                        msg.role === 'customer'
                          ? 'ml-auto bg-emerald-900/40 border border-emerald-700/50 text-emerald-100'
                          : msg.isAi
                          ? 'mr-auto bg-cyan-950/40 border border-cyan-800/50 text-cyan-200'
                          : 'mr-auto bg-slate-800/80 border border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span className="font-bold text-slate-300">{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="text-xs leading-relaxed">{msg.text}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send message to Officer Dawit or ask case status..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
              No application selected.
            </div>
          )}
        </div>

      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Schedule In-Person Revenue Appointment
              </h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {appointmentBooked ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-emerald-300 text-sm">Appointment Confirmed!</div>
                <p className="text-slate-300 text-[11px]">
                  Reference: <strong>APP-2026-9812</strong> at {appointmentBranch} on {appointmentDate}.
                </p>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setAppointmentBooked(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Select Branch / Sub-City</label>
                  <select
                    value={appointmentBranch}
                    onChange={(e) => setAppointmentBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Kirkos Sub-City Office">Kirkos Sub-City Office (Meskel Flower)</option>
                    <option value="Bole Sub-City Revenue Center">Bole Sub-City Revenue Center (Medhanialem)</option>
                    <option value="Ministry Head Office">Ministry Head Office (Kazanchis)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAppointmentBooked(true)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal (Telebirr & CBE Birr) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Ministry Revenue Payment Portal
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-emerald-300 text-sm">Payment Reconciled via Telebirr!</div>
                <div className="font-mono text-[10px] text-slate-300">
                  Transaction Ref: TXN-ET-2026-998124
                </div>
                <p className="text-slate-400 text-[11px]">
                  Receipt anchored in Rust security ledger. Zero outstanding assessment balance.
                </p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs mt-2"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Tax Clearance Assessment Fee:</span>
                    <span className="font-mono text-emerald-400 font-bold">ETB 1,500.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400 mt-1">
                    <span>Target Account:</span>
                    <span className="font-mono text-slate-200">FDRE Ministry Treasury (CBE)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-300 font-semibold block">Select Instant Channel:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentSuccess(true)}
                      className="p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-700/60 text-emerald-300 font-bold flex flex-col items-center gap-1 transition"
                    >
                      <span>telebirr</span>
                      <span className="text-[10px] font-normal text-slate-400">Ethio Telecom</span>
                    </button>
                    <button
                      onClick={() => setPaymentSuccess(true)}
                      className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-700/60 text-purple-300 font-bold flex flex-col items-center gap-1 transition"
                    >
                      <span>CBE Birr</span>
                      <span className="text-[10px] font-normal text-slate-400">Commercial Bank</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
