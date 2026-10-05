import React from 'react';
import { ShieldCheck, Printer, CheckCircle, Award, QrCode, Lock, X } from 'lucide-react';
import { CaseItem } from '../types';

interface OfficialCertificateModalProps {
  caseItem: CaseItem;
  onClose: () => void;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({ caseItem, onClose }) => {
  const serialNumber = caseItem.directorApproval?.certificateSerial || `ET-REV-2026-${caseItem.id.slice(-4)}`;
  const sealHash = caseItem.directorApproval?.digitalSealHash || 'f8d1c4b2a9e34c2b98e11a2f64c8d9e03f21b7a95e4d2c1b8a7f6e5d4c3b2a1f';
  const approvalDate = caseItem.directorApproval?.approvedAt || new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Official Government Clearance Issuance</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-amber-50/5 via-slate-900 to-slate-950 text-slate-100">
          <div className="border-4 border-double border-amber-500/40 p-6 rounded-xl bg-slate-900/90 relative shadow-inner">
            
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-8xl font-black text-amber-400 uppercase select-none">ገቢዎች</span>
            </div>

            {/* Header */}
            <div className="text-center border-b border-amber-500/30 pb-4 mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 via-amber-500 to-yellow-600 flex items-center justify-center p-[2px] shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-sm">★</span>
                  </div>
                </div>
              </div>
              <h2 className="text-base font-extrabold text-amber-300 uppercase tracking-widest">
                የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የገቢዎች ሚኒስቴር
              </h2>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                Federal Democratic Republic of Ethiopia Ministry of Revenues
              </h3>
              <p className="text-[11px] font-mono text-emerald-400 mt-1">
                Official Digital Tax Clearance Certificate • የግብር ክሊራንስ የምስክር ወረቀት
              </p>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-5">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Certificate Serial:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{serialNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Taxpayer Full Name:</span>
                  <span className="font-bold text-slate-100">{caseItem.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Taxpayer ID (TIN):</span>
                  <span className="font-mono text-amber-300 font-semibold">{caseItem.customerTin}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Registered Sub-City:</span>
                  <span className="font-semibold text-slate-200">{caseItem.subCity} Sub-City Branch</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Issue & Endorsement Date:</span>
                  <span className="font-mono text-slate-200">{approvalDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Validity Duration:</span>
                  <span className="font-semibold text-emerald-400">Valid for 1 Year (Through 2027)</span>
                </div>
              </div>
            </div>

            {/* Official Certification Statement */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-slate-200 text-xs mb-5 leading-relaxed">
              <p className="font-medium">
                This is to officially certify that the taxpayer named above has fully declared and cleared all assessed income taxes, Value Added Tax (VAT), and employee withholding obligations in accordance with <strong>FDRE Federal Tax Administration Proclamation No. 979/2016</strong>.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Authorized for: Business License Renewal, Commercial Bank Loan Processing, Government Procurement Tenders, and Foreign Currency Allocation.
              </p>
            </div>

            {/* Bottom Row: Seal, Signature, Rust Crypto Hash, QR Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              
              {/* QR Code and Hash */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div className="text-[10px] space-y-0.5 max-w-[220px]">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Rust SHA-256 Ledger Verified</span>
                  </div>
                  <div className="font-mono text-slate-400 break-all leading-tight">
                    {sealHash.slice(0, 32)}...
                  </div>
                  <div className="text-slate-400">
                    Scan QR code or query /api/v1/verify
                  </div>
                </div>
              </div>

              {/* Director Seal & Signature */}
              <div className="text-right">
                <div className="inline-flex flex-col items-end">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>DIRECTOR DIGITAL SEAL</span>
                  </div>
                  <div className="mt-1 font-serif italic text-amber-200 text-sm font-semibold tracking-wide">
                    Dr. Kassahun Tadesse
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Executive Director of Revenue Assessment
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Seal ID: #ET-SEAL-99214
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <div className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographically sealed under FDRE Electronic Signature Proclamation</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
