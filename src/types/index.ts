export type UserRole = 'customer' | 'client' | 'admin' | 'director' | 'superadmin';

export type Language = 'en' | 'am' | 'om';

export type CasePriority = 'low' | 'medium' | 'high' | 'critical';

export type CaseStatus = 
  | 'submitted' 
  | 'ai_validation' 
  | 'officer_review' 
  | 'admin_verified' 
  | 'director_pending' 
  | 'approved' 
  | 'rejected' 
  | 'escalated';

export type CaseCategory = 
  | 'Tax Clearance Certificate'
  | 'TIN Registration & Amendment'
  | 'VAT Return Assessment'
  | 'Business Category Audit'
  | 'Penalty Waiver Appeal'
  | 'Withholding Tax Credit'
  | 'Duty-Free Import Clearance';

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  sizeKb: number;
  uploadedAt: string;
  rustSha256Hash: string;
  ocrStatus: 'completed' | 'processing' | 'flagged';
  ocrConfidence: number;
  extractedInfo?: {
    tinExtracted?: string;
    financialSum?: number;
    issueDate?: string;
    verifiedStamp?: boolean;
  };
  anomalyFlag?: string;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  details: string;
  status: CaseStatus;
}

export interface CaseMessage {
  id: string;
  sender: string;
  role: UserRole;
  timestamp: string;
  text: string;
  isAi?: boolean;
}

export interface CaseItem {
  id: string; // e.g. GR-2026-00001234
  customerName: string;
  customerTin: string;
  customerPhone: string;
  customerEmail: string;
  subCity: 'Kirkos' | 'Bole' | 'Lideta' | 'Yeka' | 'Akaki-Kality' | 'Arada';
  roleOrigin: 'customer' | 'client';
  organizationName?: string;
  department: 'Revenue Assessment' | 'Tax Audit' | 'Compliance & Legal' | 'Customs Clearance';
  category: CaseCategory;
  status: CaseStatus;
  priority: CasePriority;
  assignedOfficerId: string;
  assignedOfficerName: string;
  amountEtb: number;
  aiAnalysis: {
    riskScore: number; // 0 - 100
    priorityRecommendation: CasePriority;
    ocrCompletenessPercent: number;
    anomalyDetected: boolean;
    anomalyReason?: string;
    recommendation: string;
    policyReferences: string[];
    confidence: number;
  };
  documents: CaseDocument[];
  timeline: CaseTimelineEvent[];
  messages: CaseMessage[];
  directorApproval?: {
    approvedBy: string;
    approvedAt: string;
    digitalSealHash: string;
    certificateSerial: string;
    comments?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  caseId?: string;
  ipAddress: string;
  details: string;
  prevHash: string;
  currentHash: string;
  rustVerified: boolean;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  sourceIp: string;
  status: 'active' | 'blocked' | 'mitigated';
  description: string;
  aiRecommendation: string;
}

export interface ClientEmployee {
  id: string;
  fullName: string;
  tin: string;
  role: string;
  grossSalaryEtb: number;
  withholdingTaxEtb: number;
  pensionContributionEtb: number;
  status: 'active' | 'leave';
}

export interface MicroserviceHealth {
  name: string;
  runtime: 'Go 1.23' | 'Rust 1.81' | 'Python 3.12 / Gemini' | 'PostgreSQL 16' | 'Redis 7.2';
  roleDescription: string;
  status: 'healthy' | 'warning' | 'degraded';
  uptime: string;
  latencyMs: number;
  throughput: string;
  memoryUsage: string;
}
