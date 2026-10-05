import React, { useState } from 'react';
import { PlusCircle, Upload, ShieldCheck, X, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { CaseCategory, CaseItem, UserRole, Language } from '../types';
import { RustSecurityEngine, RustHashResult } from '../services/rustSecurityService';
import { translations } from '../data/translations';

interface NewCaseModalProps {
  currentRole: UserRole;
  language: Language;
  onClose: () => void;
  onSubmitCase: (newCase: CaseItem) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  currentRole,
  language,
  onClose,
  onSubmitCase
}) => {
  const t = translations[language];

  const [category, setCategory] = useState<CaseCategory>('Tax Clearance Certificate');
  const [subCity, setSubCity] = useState<'Kirkos' | 'Bole' | 'Lideta' | 'Yeka' | 'Akaki-Kality' | 'Arada'>('Kirkos');
  const [applicantName, setApplicantName] = useState(
    currentRole === 'client' ? 'ABC Construction PLC (Rep: Selamawit D.)' : 'Abebe Bikila Gebremariam'
  );
  const [applicantTin, setApplicantTin] = useState(
    currentRole === 'client' ? 'ETH-TIN-0092837123' : 'ETH-TIN-009823145'
  );
  const [phone, setPhone] = useState('+251 91 123 4567');
  const [email, setEmail] = useState('taxpayer@ethionet.et');
  const [declaredAmount, setDeclaredAmount] = useState('148500');
  const [notes, setNotes] = useState('Application for annual commercial license renewal clearance.');

  // File upload & Rust SHA-256 simulation
  const [fileName, setFileName] = useState('Audited_Financial_Statement_2026.pdf');
  const [isHashing, setIsHashing] = useState(false);
  const [rustHashResult, setRustHashResult] = useState<RustHashResult | null>(null);

  const handleSimulateRustHash = async () => {
    setIsHashing(true);
    try {
      const res = await RustSecurityEngine.computeDocumentHash(fileName, 1850000);
      setRustHashResult(res);
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure hash exists
    let hash = rustHashResult?.hash;
    if (!hash) {
      const res = await RustSecurityEngine.computeDocumentHash(fileName, 1850000);
      hash = res.hash;
    }

    const newCaseId = `GR-2026-${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}`;
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newCase: CaseItem = {
      id: newCaseId,
      customerName: applicantName,
      customerTin: applicantTin,
      customerPhone: phone,
      customerEmail: email,
      subCity: subCity,
      roleOrigin: currentRole === 'client' ? 'client' : 'customer',
      organizationName: currentRole === 'client' ? 'ABC Construction PLC' : undefined,
      department: category.includes('Audit') ? 'Tax Audit' : category.includes('Clearance') ? 'Revenue Assessment' : 'Compliance & Legal',
      category: category,
      status: 'submitted',
      priority: Number(declaredAmount) > 500000 ? 'high' : 'medium',
      assignedOfficerId: 'OFF-0231',
      assignedOfficerName: 'Officer Dawit Haile',
      amountEtb: Number(declaredAmount) || 0,
      aiAnalysis: {
        riskScore: 8,
        priorityRecommendation: Number(declaredAmount) > 500000 ? 'high' : 'medium',
        ocrCompletenessPercent: 95,
        anomalyDetected: false,
        recommendation: 'New application registered. Automated OCR validation scheduled in Go workflow queue.',
        policyReferences: ['Federal Tax Administration Proclamation No. 979/2016'],
        confidence: 0.95
      },
      documents: [
        {
          id: `DOC-${Date.now()}`,
          name: fileName,
          type: 'application/pdf',
          sizeKb: 1850,
          uploadedAt: nowIso,
          rustSha256Hash: hash,
          ocrStatus: 'completed',
          ocrConfidence: 96,
          extractedInfo: {
            tinExtracted: applicantTin,
            financialSum: Number(declaredAmount),
            verifiedStamp: true
          }
        }
      ],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: nowIso,
          actor: applicantName,
          role: currentRole,
          action: 'Application Submitted',
          details: notes,
          status: 'submitted'
        }
      ],
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: applicantName,
          role: currentRole,
          timestamp: 'Just now',
          text: `Application filed with initial document: ${fileName}`
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    onSubmitCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {t.actions.newCase}
              </h2>
              <p className="text-xs text-slate-400">
                Official Revenue Portal Registration • FDRE Ministry of Revenues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Service Category / ማመልከቻ አይነት
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaseCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Tax Clearance Certificate">Tax Clearance Certificate (ክሊራንስ)</option>
                <option value="TIN Registration & Amendment">TIN Registration & Amendment (ቲን)</option>
                <option value="VAT Return Assessment">VAT Return Assessment (ቫት)</option>
                <option value="Business Category Audit">Business Category Audit (የደረጃ ኦዲት)</option>
                <option value="Penalty Waiver Appeal">Penalty Waiver Appeal (የቅጣት ይግባኝ)</option>
                <option value="Withholding Tax Credit">Withholding Tax Credit (ዊዝሆልዲንግ)</option>
                <option value="Duty-Free Import Clearance">Duty-Free Import Clearance (ቀረጥ ነጻ)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Branch / Sub-City (ክፍለ ከተማ)
              </label>
              <select
                value={subCity}
                onChange={(e) => setSubCity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Kirkos">Kirkos Sub-City (ቂርቆስ)</option>
                <option value="Bole">Bole Sub-City (ቦሌ)</option>
                <option value="Lideta">Lideta Sub-City (ልደታ)</option>
                <option value="Yeka">Yeka Sub-City (የካ)</option>
                <option value="Akaki-Kality">Akaki-Kality Sub-City (አቃቂ ቃሊቲ)</option>
                <option value="Arada">Arada Sub-City (አራዳ)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Taxpayer / Company Full Name
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                TIN Number (የግብር ከፋይ መለያ ቁጥር)
              </label>
              <input
                type="text"
                value={applicantTin}
                onChange={(e) => setApplicantTin(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-amber-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Contact Phone (+251)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Declared Turn-over / Amount (ETB)
              </label>
              <input
                type="number"
                value={declaredAmount}
                onChange={(e) => setDeclaredAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Document Upload & Rust SHA-256 Fingerprint */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-cyan-400" />
                Supporting Document & Rust Cryptographic Fingerprint
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Rust Actix Microservice
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => {
                  setFileName(e.target.value);
                  setRustHashResult(null);
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              />
              <button
                type="button"
                onClick={handleSimulateRustHash}
                disabled={isHashing}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 flex items-center gap-1 text-[11px] font-medium"
              >
                {isHashing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
                <span>Compute SHA-256</span>
              </button>
            </div>

            {rustHashResult && (
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-[11px] space-y-1 font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Rust SHA-256 Fingerprint Computed
                  </span>
                  <span>{rustHashResult.processingTimeMs} ms</span>
                </div>
                <div className="text-slate-300 break-all text-[10px]">
                  {rustHashResult.hash}
                </div>
                <div className="text-slate-400 text-[9px] flex items-center justify-between pt-1">
                  <span>Engine: Rust ring::digest v1.81</span>
                  <span>Zero-Copy Buffer: Validated</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Application Details / Justification
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-routed to Officer Review via Go Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-lg transition"
              >
                Submit Application
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
