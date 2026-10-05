import React, { useState } from 'react';
import { UserRole, Language, CaseItem, AuditLogEntry } from './types';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS } from './data/mockData';
import { Header } from './components/Header';
import { CustomerPortal } from './components/CustomerPortal';
import { ClientPortal } from './components/ClientPortal';
import { AdminPortal } from './components/AdminPortal';
import { DirectorPortal } from './components/DirectorPortal';
import { SuperAdminPortal } from './components/SuperAdminPortal';
import { OfficialCertificateModal } from './components/OfficialCertificateModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { GovAiModal } from './components/GovAiModal';
import { NewCaseModal } from './components/NewCaseModal';
import { RustSecurityEngine } from './services/rustSecurityService';
import { Bot } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [language, setLanguage] = useState<Language>('en');

  // Master State
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals
  const [activeCertificateCase, setActiveCertificateCase] = useState<CaseItem | null>(null);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [showGovAiModal, setShowGovAiModal] = useState<boolean>(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [govAiCaseContext, setGovAiCaseContext] = useState<string | undefined>();

  // Add event to cryptographic audit ledger
  const recordAuditEvent = async (
    actor: string,
    role: UserRole,
    action: string,
    caseId: string,
    details: string
  ) => {
    const prevLog = auditLogs[0];
    const prevHash = prevLog?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000';
    
    // Compute genuine SHA-256 for the new ledger block
    const payload = `${prevHash}-${action}-${actor}-${caseId}-${Date.now()}`;
    const hashResult = await RustSecurityEngine.computeDocumentHash(payload);

    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor,
      role,
      action,
      caseId,
      ipAddress: '10.14.0.88 (Intranet Go Gateway)',
      details,
      prevHash,
      currentHash: hashResult.hash,
      rustVerified: true,
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Submit New Case
  const handleSubmitNewCase = async (newCase: CaseItem) => {
    setCases(prev => [newCase, ...prev]);
    await recordAuditEvent(
      newCase.customerName,
      newCase.roleOrigin,
      'SUBMITTED_NEW_CASE',
      newCase.id,
      `Submitted ${newCase.category} application under ${newCase.subCity} branch.`
    );
  };

  // 2. Officer: Verify & Forward to Director
  const handleVerifyAndForward = async (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'director_pending',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: 'Officer Dawit Haile',
              role: 'admin',
              action: 'Verified by Admin',
              details: 'Reconciliation verified. Forwarded to Executive Director for sign-off.',
              status: 'director_pending'
            }
          ]
        };
      }
      return c;
    }));

    await recordAuditEvent(
      'Officer Dawit Haile',
      'admin',
      'ADMIN_VERIFY_FORWARD',
      caseId,
      'Validated OCR and bank transactions. Escalated to Director Dr. Kassahun.'
    );
  };

  // 3. Officer: Escalate Case
  const handleEscalateCase = async (caseId: string, reason: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'escalated',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: 'Officer Dawit Haile',
              role: 'admin',
              action: 'Escalated to Investigation Unit',
              details: reason,
              status: 'escalated'
            }
          ]
        };
      }
      return c;
    }));

    await recordAuditEvent(
      'Officer Dawit Haile',
      'admin',
      'CASE_ESCALATED',
      caseId,
      `Escalated to Investigation & Legal Compliance: ${reason}`
    );
  };

  // 4. Officer: Request Document
  const handleRequestDoc = (caseId: string, docName: string) => {
    handleSendMessage(caseId, `Official Notice: Please provide an updated ${docName} to proceed.`);
  };

  // 5. Director: Approve Case
  const handleDirectorApprove = async (caseId: string, comments?: string) => {
    const sealHash = (await RustSecurityEngine.computeDocumentHash(`SEAL-${caseId}`)).hash;
    const certSerial = `ET-REV-2026-${caseId.slice(-4)}`;

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'approved',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          directorApproval: {
            approvedBy: 'Director Dr. Kassahun Tadesse',
            approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            digitalSealHash: sealHash,
            certificateSerial: certSerial,
            comments: comments || 'Approved with digital seal.'
          },
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: 'Director Dr. Kassahun Tadesse',
              role: 'director',
              action: 'Executive Digital Seal Applied',
              details: `Official Certificate ${certSerial} issued.`,
              status: 'approved'
            }
          ]
        };
      }
      return c;
    }));

    await recordAuditEvent(
      'Director Dr. Kassahun Tadesse',
      'director',
      'EXECUTIVE_DIRECTOR_APPROVED',
      caseId,
      `Signed and applied Digital Seal #ET-SEAL-99214. Certificate ${certSerial} issued.`
    );
  };

  // 6. Director: Reject Case
  const handleDirectorReject = async (caseId: string, reason: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'rejected',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: 'Director Dr. Kassahun Tadesse',
              role: 'director',
              action: 'Executive Endorsement Declined',
              details: reason,
              status: 'rejected'
            }
          ]
        };
      }
      return c;
    }));

    await recordAuditEvent(
      'Director Dr. Kassahun Tadesse',
      'director',
      'DIRECTOR_REJECTED',
      caseId,
      `Executive rejection: ${reason}`
    );
  };

  // 7. Case Messaging
  const handleSendMessage = (caseId: string, text: string) => {
    const senderName = 
      currentRole === 'customer' ? 'Abebe Bikila' :
      currentRole === 'client' ? 'Selamawit D. (ABC Construction)' :
      currentRole === 'admin' ? 'Officer Dawit Haile' :
      currentRole === 'director' ? 'Dr. Kassahun Tadesse' : 'Security SuperAdmin';

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: `MSG-${Date.now()}`,
              sender: senderName,
              role: currentRole,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: text
            }
          ]
        };
      }
      return c;
    }));
  };

  // 8. Upload doc to case
  const handleUploadDocToCase = async (caseId: string, docName: string) => {
    const hash = (await RustSecurityEngine.computeDocumentHash(docName)).hash;
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          documents: [
            ...c.documents,
            {
              id: `DOC-${Date.now()}`,
              name: docName,
              type: 'application/pdf',
              sizeKb: 1420,
              uploadedAt: nowIso,
              rustSha256Hash: hash,
              ocrStatus: 'completed',
              ocrConfidence: 97
            }
          ]
        };
      }
      return c;
    }));
  };

  // Pending counts
  const pendingDirectorCount = cases.filter(c => c.status === 'director_pending').length;
  const totalAlertsCount = cases.filter(c => c.aiAnalysis.anomalyDetected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Universal Government Header & Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageChange={setLanguage}
        onOpenArchSpec={() => setShowArchModal(true)}
        onOpenGovAi={() => {
          setGovAiCaseContext(undefined);
          setShowGovAiModal(true);
        }}
        onSearchCase={(query) => {
          const found = cases.find(c => 
            c.id.toLowerCase().includes(query.toLowerCase()) || 
            c.customerTin.includes(query) ||
            c.customerName.toLowerCase().includes(query.toLowerCase())
          );
          if (found) {
            if (found.status === 'approved') {
              setActiveCertificateCase(found);
            } else {
              setGovAiCaseContext(`Querying details for case ${found.id}`);
              setShowGovAiModal(true);
            }
          }
        }}
        pendingDirectorCount={pendingDirectorCount}
        totalAlertsCount={totalAlertsCount}
      />

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentRole === 'customer' && (
          <CustomerPortal
            cases={cases}
            language={language}
            onOpenNewCase={() => setShowNewCaseModal(true)}
            onOpenGovAi={() => {
              setGovAiCaseContext(undefined);
              setShowGovAiModal(true);
            }}
            onViewCertificate={(item) => setActiveCertificateCase(item)}
            onSendMessage={handleSendMessage}
            onUploadDocToCase={handleUploadDocToCase}
          />
        )}

        {currentRole === 'client' && (
          <ClientPortal
            cases={cases}
            language={language}
            onOpenNewCase={() => setShowNewCaseModal(true)}
            onOpenGovAi={() => {
              setGovAiCaseContext('ABC Construction PLC Corporate Inquiry');
              setShowGovAiModal(true);
            }}
            onViewCertificate={(item) => setActiveCertificateCase(item)}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentRole === 'admin' && (
          <AdminPortal
            cases={cases}
            language={language}
            onVerifyAndForward={handleVerifyAndForward}
            onEscalateCase={handleEscalateCase}
            onRequestDoc={handleRequestDoc}
            onApproveDirectly={handleDirectorApprove}
            onSendMessage={handleSendMessage}
            onOpenGovAi={(caseId) => {
              setGovAiCaseContext(caseId ? `Audit check for case ${caseId}` : undefined);
              setShowGovAiModal(true);
            }}
          />
        )}

        {currentRole === 'director' && (
          <DirectorPortal
            cases={cases}
            language={language}
            onDirectorApprove={handleDirectorApprove}
            onDirectorReject={handleDirectorReject}
            onViewCertificate={(item) => setActiveCertificateCase(item)}
            onOpenGovAi={() => {
              setGovAiCaseContext('Director Executive Summary Consultation');
              setShowGovAiModal(true);
            }}
          />
        )}

        {currentRole === 'superadmin' && (
          <SuperAdminPortal
            auditLogs={auditLogs}
            language={language}
            onRefreshTelemetry={() => {}}
            onMitigateThreat={() => {}}
          />
        )}

      </main>

      {/* Floating Quick Action Button for GovAI */}
      <button
        onClick={() => {
          setGovAiCaseContext(undefined);
          setShowGovAiModal(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs border border-emerald-400/40"
        title="Open GovAI Multilingual Assistant"
      >
        <Bot className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline">Ask GovAI</span>
      </button>

      {/* Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600/30 flex items-center justify-center text-amber-400 text-xs font-bold">
              ★
            </div>
            <div>
              <div className="font-bold text-slate-300">
                Federal Democratic Republic of Ethiopia • Ministry of Revenues (የገቢዎች ሚኒስቴር)
              </div>
              <div className="text-[11px] text-slate-400">
                GovRevenue AI Architecture: Go 1.23 API Gateway • Rust 1.81 Crypto Microservice • Python/Gemini 2.5 Flash • Postgres 16
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setShowArchModal(true)} className="hover:text-cyan-400 underline">
              Architecture Spec
            </button>
            <span>•</span>
            <span className="font-mono text-emerald-400">Ledger Status: 100% Cryptographically Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeCertificateCase && (
        <OfficialCertificateModal
          caseItem={activeCertificateCase}
          onClose={() => setActiveCertificateCase(null)}
        />
      )}

      {showArchModal && (
        <ArchitectureModal
          onClose={() => setShowArchModal(false)}
        />
      )}

      {showGovAiModal && (
        <GovAiModal
          currentRole={currentRole}
          language={language}
          onClose={() => setShowGovAiModal(false)}
          activeCaseId={govAiCaseContext}
        />
      )}

      {showNewCaseModal && (
        <NewCaseModal
          currentRole={currentRole}
          language={language}
          onClose={() => setShowNewCaseModal(false)}
          onSubmitCase={handleSubmitNewCase}
        />
      )}

    </div>
  );
}
