import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Database, 
  Key, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Flame, 
  FileCode,
  Lock,
  Radio,
  Eye,
  Activity
} from 'lucide-react';
import { AuditLogEntry, SecurityIncident, MicroserviceHealth, Language } from '../types';
import { MICROSERVICE_TELEMETRY, INITIAL_SECURITY_INCIDENTS } from '../data/mockData';
import { RustSecurityEngine } from '../services/rustSecurityService';

interface SuperAdminPortalProps {
  auditLogs: AuditLogEntry[];
  language: Language;
  onRefreshTelemetry: () => void;
  onMitigateThreat: (incidentId: string) => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({
  auditLogs: initialLogs,
  language,
  onRefreshTelemetry,
  onMitigateThreat
}) => {
  const [activeTab, setActiveTab] = useState<'soc' | 'audit' | 'rbac' | 'infra'>('soc');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [tamperTriggered, setTamperTriggered] = useState(false);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_SECURITY_INCIDENTS);

  // RBAC Matrix State
  const [rbacMatrix, setRbacMatrix] = useState([
    { permission: 'Submit Citizen Application', customer: true, client: true, officer: false, director: false, superadmin: true },
    { permission: 'Corporate VAT & Payroll Declaration', customer: false, client: true, officer: false, director: false, superadmin: true },
    { permission: 'Execute OCR & Completeness Triage', customer: false, client: false, officer: true, director: true, superadmin: true },
    { permission: 'Administrative Case Verification', customer: false, client: false, officer: true, director: true, superadmin: true },
    { permission: 'Grant Executive Director Digital Seal', customer: false, client: false, officer: false, director: true, superadmin: false },
    { permission: 'Inspect Cryptographic Audit Trail', customer: false, client: false, officer: false, director: true, superadmin: true },
    { permission: 'Configure Microservices & Encryption', customer: false, client: false, officer: false, director: false, superadmin: true },
  ]);

  const handleSimulateTampering = () => {
    // Modify one log's details without updating its hash, simulating a database breach
    const tampered = auditLogs.map((log, idx) => {
      if (idx === 1) {
        return {
          ...log,
          details: 'TAMPERED: Illicitly altered assessment amount from ETB 148,500 to ETB 0.',
          rustVerified: false // Rust engine flags invalid hash!
        };
      }
      return log;
    });

    setAuditLogs(tampered);
    setTamperTriggered(true);

    // Add security incident
    const newInc: SecurityIncident = {
      id: `SEC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: 'critical',
      type: 'Cryptographic Hash Chain Broken',
      sourceIp: 'Internal Database Direct Query',
      status: 'active',
      description: 'Audit record #AUD-88200 hash mismatch detected by Rust ring::digest verifier.',
      aiRecommendation: 'Isolate affected node and revert state from signed write-ahead log.'
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleRestoreIntegrity = () => {
    setAuditLogs(initialLogs);
    setTamperTriggered(false);
  };

  const handleMitigate = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'mitigated' } : inc));
    onMitigateThreat(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-rose-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Security Operations Center (SOC) & Infrastructure Control
              </span>
              <span className="text-xs text-slate-400 font-mono">Actor: Root Super Administrator</span>
            </div>
            <h2 className="text-xl font-black text-slate-100">
              Government Platform Security & Distributed Systems Governance
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Monitor Go API Gateway rate-limits, Rust cryptographic SHA-256 microservices, immutable audit hash chaining, RBAC/ABAC boundary enforcement, and cybersecurity threat mitigation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              All Nodes Operational
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('soc')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'soc' ? 'border-rose-400 text-rose-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-400" />
          <span>SOC Threat & Anomaly Center ({incidents.filter(i => i.status !== 'mitigated').length} Active)</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'audit' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Immutable Cryptographic Audit Trail (Rust Chained)</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'rbac' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>RBAC / ABAC Permissions Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'infra' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Go / Rust Microservice Telemetry</span>
        </button>
      </div>

      {/* Tab 1: SOC Threats & Anomaly Center */}
      {activeTab === 'soc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Failed Authentication Rate</span>
              <span className="text-xl font-bold font-mono text-rose-400">0.04%</span>
              <span className="text-[10px] text-slate-400 block mt-1">Brute-force spray blocked at Rust boundary</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Privilege Escalation Attempts</span>
              <span className="text-xl font-bold font-mono text-amber-400">1</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Blocked by Go RBAC middleware</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Data Ingestion Integrity</span>
              <span className="text-xl font-bold font-mono text-emerald-400">100.0%</span>
              <span className="text-[10px] text-slate-400 block mt-1">All document hashes match ledger</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Live Intrusion & Threat Feed
              </h3>
              <span className="text-[10px] font-mono text-slate-400">AI Threat Evaluation Active</span>
            </div>

            <div className="space-y-2.5">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        inc.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="font-bold text-slate-200">{inc.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      IP: {inc.sourceIp} • {inc.timestamp}
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px]">{inc.description}</p>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong>AI Mitigation:</strong> {inc.aiRecommendation}
                    </div>
                    {inc.status !== 'mitigated' ? (
                      <button
                        onClick={() => handleMitigate(inc.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition flex-shrink-0"
                      >
                        Execute Mitigation
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Mitigated & Blocked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Immutable Cryptographic Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Immutable SHA-256 Ledger (Rust Ring Digest Verified)
              </h3>
              <p className="text-slate-400 text-[11px]">
                Each state transition hashes the previous block hash, actor ID, and action payload. Nobody can modify historical audit records without breaking downstream hashes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!tamperTriggered ? (
                <button
                  onClick={handleSimulateTampering}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Simulate Malicious Tampering</span>
                </button>
              ) : (
                <button
                  onClick={handleRestoreIntegrity}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Ledger Integrity</span>
                </button>
              )}
            </div>
          </div>

          {tamperTriggered && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>CRITICAL: Rust Cryptographic Chain Validation Failure!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The Rust security daemon detected that the payload of Audit Event #AUD-88200 was modified in the PostgreSQL database without recalculating its cryptographic hash. The hash chain between Block 2 and Block 1 is broken.
              </p>
            </div>
          )}

          {/* Audit Chain Cards */}
          <div className="space-y-3">
            {auditLogs.map((log, idx) => (
              <div
                key={log.id}
                className={`p-4 rounded-xl border space-y-2 transition ${
                  !log.rustVerified
                    ? 'bg-rose-950/30 border-rose-600 shadow-xl ring-1 ring-rose-500'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{log.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-slate-400">Actor: <strong className="text-slate-200">{log.actor}</strong> ({log.role})</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-slate-400">{log.timestamp}</span>
                    {log.rustVerified ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rust Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-1 font-bold animate-pulse">
                        <XCircle className="w-3 h-3" />
                        TAMPER DETECTED
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-xs">{log.details}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-400 block">Previous Block Hash:</span>
                    <span className="break-all text-slate-400">{log.prevHash}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current SHA-256 Hash:</span>
                    <span className={`break-all ${!log.rustVerified ? 'text-rose-400 font-bold' : 'text-cyan-400'}`}>
                      {log.currentHash}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: RBAC / ABAC Permissions Matrix */}
      {activeTab === 'rbac' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Role-Based & Attribute-Based Access Control (RBAC/ABAC)
              </h3>
              <p className="text-slate-400 text-[11px]">
                Enforced at the Go API Gateway HTTP middleware before reaching database controllers.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
              Policy Engine: Open Policy Agent / Go Rego
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Platform Capability / Action</th>
                  <th className="p-3 text-center">Citizen</th>
                  <th className="p-3 text-center">Client (PLC)</th>
                  <th className="p-3 text-center">Officer</th>
                  <th className="p-3 text-center">Director</th>
                  <th className="p-3 text-center">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rbacMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-200">{item.permission}</td>
                    <td className="p-3 text-center">
                      {item.customer ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3 text-center">
                      {item.client ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3 text-center">
                      {item.officer ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3 text-center">
                      {item.director ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3 text-center">
                      {item.superadmin ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Microservice Telemetry */}
      {activeTab === 'infra' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {MICROSERVICE_TELEMETRY.map((svc, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100 text-sm">{svc.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400">{svc.runtime}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {svc.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{svc.roleDescription}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                <div>
                  <span className="text-slate-400 block">Latency</span>
                  <span className="text-cyan-400 font-bold">{svc.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Throughput</span>
                  <span className="text-emerald-400 font-bold">{svc.throughput}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Memory</span>
                  <span className="text-amber-400 font-bold">{svc.memoryUsage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
