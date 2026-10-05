import { CaseItem, AuditLogEntry, SecurityIncident, ClientEmployee, MicroserviceHealth } from '../types';

export const INITIAL_CASES: CaseItem[] = [
  {
    id: 'GR-2026-00001234',
    customerName: 'Abebe Bikila Gebremariam',
    customerTin: 'ETH-TIN-009823145',
    customerPhone: '+251 91 123 4567',
    customerEmail: 'abebe.bikila@ethionet.et',
    subCity: 'Kirkos',
    roleOrigin: 'customer',
    department: 'Revenue Assessment',
    category: 'Tax Clearance Certificate',
    status: 'director_pending',
    priority: 'high',
    assignedOfficerId: 'OFF-0231',
    assignedOfficerName: 'Officer Dawit Haile',
    amountEtb: 148500,
    aiAnalysis: {
      riskScore: 12,
      priorityRecommendation: 'high',
      ocrCompletenessPercent: 96,
      anomalyDetected: false,
      recommendation: 'All 4 required documents verified via OCR. Revenue declaration matches CBE bank statement with 0.4% variance. Ready for Director digital endorsement.',
      policyReferences: [
        'Proclamation No. 979/2016 Art. 47 (Tax Clearance)',
        'Directive No. 44/2014 Compliance Standards'
      ],
      confidence: 0.94
    },
    documents: [
      {
        id: 'DOC-1234-A',
        name: 'Trade_License_Renewal_2026.pdf',
        type: 'application/pdf',
        sizeKb: 1240,
        uploadedAt: '2026-10-04 09:10',
        rustSha256Hash: 'a7f34c2b98e11a2f64c8d9e03f21b7a95e4d2c1b8a7f6e5d4c3b2a1f0e9d8c7b',
        ocrStatus: 'completed',
        ocrConfidence: 98,
        extractedInfo: {
          tinExtracted: 'ETH-TIN-009823145',
          issueDate: '2026-01-15',
          verifiedStamp: true
        }
      },
      {
        id: 'DOC-1234-B',
        name: 'Bank_Statement_CBE_6mo.pdf',
        type: 'application/pdf',
        sizeKb: 3410,
        uploadedAt: '2026-10-04 09:12',
        rustSha256Hash: '5e8b2a1c9f7d4e3a2b1c0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c',
        ocrStatus: 'completed',
        ocrConfidence: 95,
        extractedInfo: {
          financialSum: 148500,
          verifiedStamp: true
        }
      },
      {
        id: 'DOC-1234-C',
        name: 'VAT_Withholding_Receipts.pdf',
        type: 'application/pdf',
        sizeKb: 890,
        uploadedAt: '2026-10-04 11:31',
        rustSha256Hash: '3c1d9e7f5b3a1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d',
        ocrStatus: 'completed',
        ocrConfidence: 96,
        extractedInfo: {
          financialSum: 22275,
          verifiedStamp: true
        }
      }
    ],
    timeline: [
      {
        id: 'TL-1',
        timestamp: '2026-10-04 09:10',
        actor: 'Abebe Bikila',
        role: 'customer',
        action: 'Application Submitted',
        details: 'Submitted request for annual business tax clearance certificate.',
        status: 'submitted'
      },
      {
        id: 'TL-2',
        timestamp: '2026-10-04 09:12',
        actor: 'GovAI OCR Engine',
        role: 'superadmin',
        action: 'AI Validation Passed',
        details: 'Rust SHA-256 fingerprint computed. OCR extracted TIN and verified against Ministry DB.',
        status: 'ai_validation'
      },
      {
        id: 'TL-3',
        timestamp: '2026-10-04 09:15',
        actor: 'System Router',
        role: 'admin',
        action: 'Assigned to Officer',
        details: 'Auto-routed to Kirkos Sub-City Officer Dawit Haile (OFF-0231).',
        status: 'officer_review'
      },
      {
        id: 'TL-4',
        timestamp: '2026-10-04 10:02',
        actor: 'Officer Dawit Haile',
        role: 'admin',
        action: 'Requested Bank Reconciliation',
        details: 'Requested stamped copy of CBE 6-month transaction sheet.',
        status: 'officer_review'
      },
      {
        id: 'TL-5',
        timestamp: '2026-10-04 11:31',
        actor: 'Abebe Bikila',
        role: 'customer',
        action: 'Additional Document Provided',
        details: 'Uploaded VAT_Withholding_Receipts.pdf.',
        status: 'officer_review'
      },
      {
        id: 'TL-6',
        timestamp: '2026-10-04 13:45',
        actor: 'Admin Meron Assefa',
        role: 'admin',
        action: 'Admin Verification Completed',
        details: 'Verified all reconciliation sheets. Escalated for Executive Director sign-off.',
        status: 'director_pending'
      }
    ],
    messages: [
      {
        id: 'MSG-1',
        sender: 'Officer Dawit Haile',
        role: 'admin',
        timestamp: '10:02 AM',
        text: 'Ato Abebe, please upload your stamped bank statement including the September withholding voucher.'
      },
      {
        id: 'MSG-2',
        sender: 'Abebe Bikila',
        role: 'customer',
        timestamp: '11:32 AM',
        text: 'I have uploaded the stamped bank sheet and the 2% withholding receipts. Kindly review.'
      },
      {
        id: 'MSG-3',
        sender: 'GovAI Document Bot',
        role: 'admin',
        timestamp: '11:33 AM',
        text: 'AI Check: Bank Statement financial sum ETB 148,500.00 matches VAT receipts. Completeness score: 96%.',
        isAi: true
      },
      {
        id: 'MSG-4',
        sender: 'Officer Dawit Haile',
        role: 'admin',
        timestamp: '13:40 PM',
        text: 'Audit verification successful. Case forwarded to Director Dr. Kassahun for digital signature.'
      }
    ],
    createdAt: '2026-10-04 09:10',
    updatedAt: '2026-10-04 13:45'
  },

  {
    id: 'GR-2026-00001289',
    customerName: 'ABC Construction PLC (Rep: Selamawit D.)',
    customerTin: 'ETH-TIN-0092837123',
    customerPhone: '+251 11 554 8899',
    customerEmail: 'tax.compliance@abcconstruction.et',
    subCity: 'Bole',
    roleOrigin: 'client',
    organizationName: 'ABC Construction PLC',
    department: 'Customs Clearance',
    category: 'Duty-Free Import Clearance',
    status: 'escalated',
    priority: 'critical',
    assignedOfficerId: 'OFF-0104',
    assignedOfficerName: 'Officer Tigist Mengistu',
    amountEtb: 1840000,
    aiAnalysis: {
      riskScore: 78,
      priorityRecommendation: 'critical',
      ocrCompletenessPercent: 88,
      anomalyDetected: true,
      anomalyReason: 'Declared tariff code (HS 8429.52 Excavator) differs from commercial packing list specifications (Crane Attachment). Potential tariff evasion risk: ETB 320,000.',
      recommendation: 'Potential tariff classification anomaly detected. Recommend physical customs inspection at Modjo Dry Port prior to duty exemption endorsement.',
      policyReferences: [
        'Customs Proclamation No. 859/2014 Art. 34',
        'Investment Proclamation No. 1180/2020 Duty-Free Incentives'
      ],
      confidence: 0.91
    },
    documents: [
      {
        id: 'DOC-1289-A',
        name: 'Commercial_Invoice_Caterpillar.pdf',
        type: 'application/pdf',
        sizeKb: 2840,
        uploadedAt: '2026-10-03 14:20',
        rustSha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        ocrStatus: 'flagged',
        ocrConfidence: 91,
        extractedInfo: {
          financialSum: 1840000,
          verifiedStamp: true
        },
        anomalyFlag: 'Tariff code mismatch'
      }
    ],
    timeline: [
      {
        id: 'TL-10',
        timestamp: '2026-10-03 14:20',
        actor: 'Selamawit D. (ABC Construction)',
        role: 'client',
        action: 'Duty-Free Exemption Filed',
        details: 'Submitted duty-free application for 2 imported hydraulic crawler excavators.',
        status: 'submitted'
      },
      {
        id: 'TL-11',
        timestamp: '2026-10-03 14:25',
        actor: 'GovAI Anomaly Engine',
        role: 'superadmin',
        action: 'Tariff Anomaly Triggered',
        details: 'HS code 8429.52 mismatch detected against packing list line items.',
        status: 'ai_validation'
      },
      {
        id: 'TL-12',
        timestamp: '2026-10-04 08:30',
        actor: 'Admin Solomon Worku',
        role: 'admin',
        action: 'Escalated to Investigation Unit',
        details: 'Dispatched to Customs Investigation Unit for physical inspection verification.',
        status: 'escalated'
      }
    ],
    messages: [
      {
        id: 'MSG-10',
        sender: 'Selamawit D.',
        role: 'client',
        timestamp: '2026-10-03 14:21',
        text: 'We submitted the duty-free incentive recommendation letter from the Ministry of Innovation and Technology.'
      },
      {
        id: 'MSG-11',
        sender: 'Officer Tigist Mengistu',
        role: 'admin',
        timestamp: '2026-10-04 08:35',
        text: 'ABC Construction: AI inspection flagged a discrepancy in the equipment specifications. Modjo Dry Port physical exam requested.'
      }
    ],
    createdAt: '2026-10-03 14:20',
    updatedAt: '2026-10-04 08:35'
  },

  {
    id: 'GR-2026-00001302',
    customerName: 'Almaz Kebede Workneh',
    customerTin: 'ETH-TIN-007712399',
    customerPhone: '+251 92 887 6655',
    customerEmail: 'almaz.kebede@gmail.com',
    subCity: 'Yeka',
    roleOrigin: 'customer',
    department: 'Revenue Assessment',
    category: 'Withholding Tax Credit',
    status: 'approved',
    priority: 'medium',
    assignedOfficerId: 'OFF-0309',
    assignedOfficerName: 'Officer Henok Tesfaye',
    amountEtb: 38200,
    aiAnalysis: {
      riskScore: 4,
      priorityRecommendation: 'low',
      ocrCompletenessPercent: 100,
      anomalyDetected: false,
      recommendation: 'Withholding vouchers matched 100% with government payer agency filing. Fully cleared.',
      policyReferences: ['Federal Tax Administration Proclamation No. 979/2016 Art. 92'],
      confidence: 0.98
    },
    documents: [
      {
        id: 'DOC-1302-A',
        name: 'Ministry_of_Education_Withholding_Slip.pdf',
        type: 'application/pdf',
        sizeKb: 720,
        uploadedAt: '2026-10-02 10:00',
        rustSha256Hash: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b',
        ocrStatus: 'completed',
        ocrConfidence: 99,
        extractedInfo: {
          financialSum: 38200,
          verifiedStamp: true
        }
      }
    ],
    timeline: [
      {
        id: 'TL-20',
        timestamp: '2026-10-02 10:00',
        actor: 'Almaz Kebede',
        role: 'customer',
        action: 'Submitted Withholding Credit Claim',
        details: 'Submitted proof of 2% deduction from textbook supply contract.',
        status: 'submitted'
      },
      {
        id: 'TL-21',
        timestamp: '2026-10-02 15:30',
        actor: 'Director Dr. Kassahun T.',
        role: 'director',
        action: 'Executive Approval Granted',
        details: 'Signed with Digital Ministry Seal #ET-SEAL-99214.',
        status: 'approved'
      }
    ],
    messages: [],
    directorApproval: {
      approvedBy: 'Director Dr. Kassahun Tadesse',
      approvedAt: '2026-10-02 15:30',
      digitalSealHash: 'f8d1c4b2a9e34c2b98e11a2f64c8d9e03f21b7a95e4d2c1b8a7f6e5d4c3b2a1f',
      certificateSerial: 'ET-REV-2026-X992',
      comments: 'Duly approved and reconciled with Treasury ledger.'
    },
    createdAt: '2026-10-02 10:00',
    updatedAt: '2026-10-02 15:30'
  },

  {
    id: 'GR-2026-00001340',
    customerName: 'Ethiopian Rift Valley Agribusiness Ltd',
    customerTin: 'ETH-TIN-006124589',
    customerPhone: '+251 11 661 2233',
    customerEmail: 'finance@riftvalley-agri.com',
    subCity: 'Akaki-Kality',
    roleOrigin: 'client',
    organizationName: 'Ethiopian Rift Valley Agribusiness Ltd',
    department: 'Tax Audit',
    category: 'VAT Return Assessment',
    status: 'officer_review',
    priority: 'high',
    assignedOfficerId: 'OFF-0231',
    assignedOfficerName: 'Officer Dawit Haile',
    amountEtb: 420000,
    aiAnalysis: {
      riskScore: 34,
      priorityRecommendation: 'medium',
      ocrCompletenessPercent: 92,
      anomalyDetected: false,
      recommendation: 'Agri-processing zero-rated export exemption claimed. Awaiting export customs bill of lading endorsement.',
      policyReferences: ['VAT Proclamation No. 285/2002 Art. 7 Zero-Rating Exports'],
      confidence: 0.89
    },
    documents: [],
    timeline: [
      {
        id: 'TL-30',
        timestamp: '2026-10-04 11:00',
        actor: 'Finance Director (Rift Valley)',
        role: 'client',
        action: 'Export VAT Refund Claim Filed',
        details: 'Submitted monthly VAT refund request for coffee bean shipments.',
        status: 'submitted'
      }
    ],
    messages: [],
    createdAt: '2026-10-04 11:00',
    updatedAt: '2026-10-04 11:45'
  },

  {
    id: 'GR-2026-00001411',
    customerName: 'Bethlehem Tadesse Hailu',
    customerTin: 'ETH-TIN-008891230',
    customerPhone: '+251 93 445 6677',
    customerEmail: 'bethlehem.tadesse@gmail.com',
    subCity: 'Lideta',
    roleOrigin: 'customer',
    department: 'Revenue Assessment',
    category: 'TIN Registration & Amendment',
    status: 'ai_validation',
    priority: 'low',
    assignedOfficerId: 'OFF-0199',
    assignedOfficerName: 'Officer Rahel Bekele',
    amountEtb: 0,
    aiAnalysis: {
      riskScore: 2,
      priorityRecommendation: 'low',
      ocrCompletenessPercent: 100,
      anomalyDetected: false,
      recommendation: 'Fayda Ethiopian National ID biometric match confirmed. Automatic TIN generation eligible.',
      policyReferences: ['National ID Integration Act 2025'],
      confidence: 0.99
    },
    documents: [],
    timeline: [],
    messages: [],
    createdAt: '2026-10-04 16:00',
    updatedAt: '2026-10-04 16:05'
  },

  {
    id: 'GR-2026-00001450',
    customerName: 'Tekle & Sons Metal Works',
    customerTin: 'ETH-TIN-004455667',
    customerPhone: '+251 11 440 1212',
    customerEmail: 'tekle.metal@ethionet.et',
    subCity: 'Kirkos',
    roleOrigin: 'client',
    organizationName: 'Tekle & Sons Metal Works',
    department: 'Compliance & Legal',
    category: 'Penalty Waiver Appeal',
    status: 'officer_review',
    priority: 'medium',
    assignedOfficerId: 'OFF-0231',
    assignedOfficerName: 'Officer Dawit Haile',
    amountEtb: 65000,
    aiAnalysis: {
      riskScore: 45,
      priorityRecommendation: 'medium',
      ocrCompletenessPercent: 85,
      anomalyDetected: false,
      recommendation: 'Delay in filing due to regional banking system downtime. Proclamation 979 Art. 110 permits director waiver under substantiated force majeure.',
      policyReferences: ['Federal Tax Administration Proclamation No. 979/2016 Art. 110 (Waiver of Penalty)'],
      confidence: 0.88
    },
    documents: [],
    timeline: [],
    messages: [],
    createdAt: '2026-10-04 14:10',
    updatedAt: '2026-10-04 15:20'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-88201',
    timestamp: '2026-10-04 15:30:12',
    actor: 'Dr. Kassahun Tadesse',
    role: 'director',
    action: 'APPROVED_TAX_CLEARANCE',
    caseId: 'GR-2026-00001302',
    ipAddress: '10.12.4.15 (Internal Exec Net)',
    details: 'Digital Seal ET-SEAL-99214 applied to certificate. Withholding credit ETB 38,200.',
    prevHash: '7a9c8b6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    currentHash: 'f8d1c4b2a9e34c2b98e11a2f64c8d9e03f21b7a95e4d2c1b8a7f6e5d4c3b2a1f',
    rustVerified: true
  },
  {
    id: 'AUD-88200',
    timestamp: '2026-10-04 13:45:00',
    actor: 'Meron Assefa',
    role: 'admin',
    action: 'ADMIN_VERIFICATION_COMPLETED',
    caseId: 'GR-2026-00001234',
    ipAddress: '10.12.8.44 (Kirkos Branch Subnet)',
    details: 'Verified bank reconciliation for Abebe Bikila. Escalated for Executive Director sign-off.',
    prevHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    currentHash: '7a9c8b6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    rustVerified: true
  },
  {
    id: 'AUD-88199',
    timestamp: '2026-10-04 09:12:44',
    actor: 'GovAI OCR Rust Daemon',
    role: 'superadmin',
    action: 'DOCUMENT_HASH_RECORDED',
    caseId: 'GR-2026-00001234',
    ipAddress: '127.0.0.1 (Rust Worker Node 03)',
    details: 'Computed SHA-256 fingerprint on Trade_License_Renewal_2026.pdf (1,240 KB). 0 memory leaks.',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    rustVerified: true
  }
];

export const INITIAL_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    id: 'SEC-9921',
    timestamp: '2026-10-04 16:12:08',
    severity: 'critical',
    type: 'Brute-force Authentication Spray',
    sourceIp: '196.188.120.44 (Addis Ababa Telecom proxy)',
    status: 'blocked',
    description: '52 failed authentication attempts against /api/v1/auth/login targeting officer accounts.',
    aiRecommendation: 'IP subnetwork quarantined in Rust gateway. Enforced mandatory biometric hardware token.'
  },
  {
    id: 'SEC-9920',
    timestamp: '2026-10-04 14:05:22',
    severity: 'high',
    type: 'Tamper Signature Anomaly',
    sourceIp: '197.156.88.19',
    status: 'mitigated',
    description: 'Attempted modification of document payload hash in transit before Rust signature verification.',
    aiRecommendation: 'Payload rejected by Go API Gateway; certificate revoking protocol dispatched.'
  },
  {
    id: 'SEC-9919',
    timestamp: '2026-10-04 10:20:15',
    severity: 'medium',
    type: 'Privilege Escalation Probe',
    sourceIp: '10.14.2.99',
    status: 'blocked',
    description: 'Citizen token attempted to access internal director approval endpoint /api/v1/cases/approve.',
    aiRecommendation: 'RBAC boundary enforced by Go middleware. Token revoked and incident logged.'
  }
];

export const CLIENT_EMPLOYEES: ClientEmployee[] = [
  { id: 'EMP-001', fullName: 'Dawit Kassa Tefera', tin: 'ETH-TIN-889102', role: 'Project Director', grossSalaryEtb: 65000, withholdingTaxEtb: 19850, pensionContributionEtb: 4550, status: 'active' },
  { id: 'EMP-002', fullName: 'Selamawit Daniel', tin: 'ETH-TIN-889103', role: 'Chief Financial Officer', grossSalaryEtb: 58000, withholdingTaxEtb: 17400, pensionContributionEtb: 4060, status: 'active' },
  { id: 'EMP-003', fullName: 'Yonas Berhanu', tin: 'ETH-TIN-889104', role: 'Senior Structural Engineer', grossSalaryEtb: 45000, withholdingTaxEtb: 12850, pensionContributionEtb: 3150, status: 'active' },
  { id: 'EMP-004', fullName: 'Tigist Alemayehu', tin: 'ETH-TIN-889105', role: 'Procurement Specialist', grossSalaryEtb: 28000, withholdingTaxEtb: 6900, pensionContributionEtb: 1960, status: 'active' },
  { id: 'EMP-005', fullName: 'Biruk Solomon', tin: 'ETH-TIN-889106', role: 'Heavy Machinery Operator', grossSalaryEtb: 18500, withholdingTaxEtb: 3625, pensionContributionEtb: 1295, status: 'active' },
];

export const MICROSERVICE_TELEMETRY: MicroserviceHealth[] = [
  {
    name: 'Go API Gateway & Case Engine',
    runtime: 'Go 1.23',
    roleDescription: 'Handles REST/gRPC routing, workflow state machine, rate-limiting, and RBAC middleware.',
    status: 'healthy',
    uptime: '99.98% (42 days)',
    latencyMs: 11.4,
    throughput: '4,820 req/sec',
    memoryUsage: '142 MB (Go GC)'
  },
  {
    name: 'Rust Cryptographic & Security Service',
    runtime: 'Rust 1.81',
    roleDescription: 'Zero-copy document SHA-256 fingerprinting, tamper detection, and audit hash-chaining.',
    status: 'healthy',
    uptime: '100% (68 days)',
    latencyMs: 0.8,
    throughput: '428,500 hashes/sec',
    memoryUsage: '38 MB (Jemalloc, 0 leaks)'
  },
  {
    name: 'GovAI Reasoning & OCR Extraction Agent',
    runtime: 'Python 3.12 / Gemini',
    roleDescription: 'Multilingual RAG pipeline with Ethiopian tax proclamations, OCR validation & anomaly scoring.',
    status: 'healthy',
    uptime: '99.92%',
    latencyMs: 185.0,
    throughput: '120 infer/sec',
    memoryUsage: '1.2 GB'
  },
  {
    name: 'PostgreSQL Relational DB Cluster',
    runtime: 'PostgreSQL 16',
    roleDescription: 'ACID transactional store for users, cases, workflows, documents, and audit chains.',
    status: 'healthy',
    uptime: '99.99%',
    latencyMs: 2.1,
    throughput: '12,400 query/sec',
    memoryUsage: '3.4 GB / 8 GB'
  },
  {
    name: 'Redis Cache & Distributed Locks',
    runtime: 'Redis 7.2',
    roleDescription: 'Sub-millisecond token sessions, high-velocity case queues, and cache hit ratio 94.2%.',
    status: 'healthy',
    uptime: '99.99%',
    latencyMs: 0.4,
    throughput: '34,000 ops/sec',
    memoryUsage: '512 MB'
  }
];
