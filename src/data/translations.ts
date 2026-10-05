import { Language } from '../types';

export interface Translations {
  portalTitle: string;
  subTitle: string;
  roleSwitcher: string;
  currentRole: string;
  roles: {
    customer: string;
    client: string;
    admin: string;
    director: string;
    superadmin: string;
  };
  roleDescriptions: {
    customer: string;
    client: string;
    admin: string;
    director: string;
    superadmin: string;
  };
  nav: {
    dashboard: string;
    cases: string;
    documents: string;
    aiAssistant: string;
    auditLogs: string;
    securityCenter: string;
    appointments: string;
    systemArch: string;
  };
  caseStatus: {
    submitted: string;
    ai_validation: string;
    officer_review: string;
    admin_verified: string;
    director_pending: string;
    approved: string;
    rejected: string;
    escalated: string;
  };
  priority: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  actions: {
    newCase: string;
    trackCase: string;
    askGovAi: string;
    approve: string;
    reject: string;
    escalate: string;
    verify: string;
    uploadDoc: string;
    downloadCertificate: string;
    search: string;
    filter: string;
    refresh: string;
    close: string;
  };
  customerStats: {
    completed: string;
    processing: string;
    actionRequired: string;
    taxClearanceStatus: string;
  };
  directorStats: {
    pendingApprovals: string;
    highPriorityCases: string;
    escalatedCases: string;
    departmentPerf: string;
  };
  officerStats: {
    newCases: string;
    inProgress: string;
    pendingApproval: string;
    completed: string;
    escalated: string;
    aiAlerts: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    portalTitle: "FDRE Ministry of Revenues",
    subTitle: "GovRevenue AI — Unified Citizen & Enterprise Revenue Management System",
    roleSwitcher: "Active Role",
    currentRole: "Current Perspective",
    roles: {
      customer: "Citizen / Taxpayer",
      client: "Client Enterprise (PLC)",
      admin: "Revenue Case Admin / Officer",
      director: "Bureau Director (Executive)",
      superadmin: "Super Admin & SOC",
    },
    roleDescriptions: {
      customer: "Individual citizen seeking clearance, TIN services, appeals, and live tracking.",
      client: "Registered corporate entity (ABC Construction PLC) managing payroll withholding & VAT.",
      admin: "Case officer triage, AI OCR verification, anomaly assessment, and case assignment.",
      director: "Executive sign-off, morning AI briefings, strategic branch allocations, and digital seals.",
      superadmin: "Platform governance, Go/Rust microservice telemetry, RBAC/ABAC, and cybersecurity SOC.",
    },
    nav: {
      dashboard: "Dashboard",
      cases: "Case Registry",
      documents: "Document Vault",
      aiAssistant: "GovAI Suite",
      auditLogs: "Immutable Audit Log",
      securityCenter: "Security Operations",
      appointments: "Appointments",
      systemArch: "Architecture Spec",
    },
    caseStatus: {
      submitted: "Submitted",
      ai_validation: "AI Validation",
      officer_review: "Officer Review",
      admin_verified: "Admin Verified",
      director_pending: "Pending Director Approval",
      approved: "Approved & Certified",
      rejected: "Rejected",
      escalated: "Escalated to Legal",
    },
    priority: {
      low: "Low Priority",
      medium: "Standard",
      high: "High Priority",
      critical: "Critical SLA",
    },
    actions: {
      newCase: "Submit New Application",
      trackCase: "Track Case Timeline",
      askGovAi: "Ask GovAI Assistant",
      approve: "Grant Executive Approval",
      reject: "Reject Application",
      escalate: "Escalate to Audit / Legal",
      verify: "Verify & Forward",
      uploadDoc: "Upload Document (Rust SHA-256)",
      downloadCertificate: "Official Digital Certificate",
      search: "Search by Case ID, TIN, or Name...",
      filter: "Filter Records",
      refresh: "Refresh Data",
      close: "Close Window",
    },
    customerStats: {
      completed: "Completed Cases",
      processing: "Under Review",
      actionRequired: "Action Required",
      taxClearanceStatus: "Tax Clearance Status",
    },
    directorStats: {
      pendingApprovals: "Pending Approvals",
      highPriorityCases: "High Priority Cases",
      escalatedCases: "Escalated Cases",
      departmentPerf: "Branch Efficiency",
    },
    officerStats: {
      newCases: "New Cases",
      inProgress: "In Progress",
      pendingApproval: "Pending Approval",
      completed: "Completed",
      escalated: "Escalated",
      aiAlerts: "AI Anomaly Alerts",
    },
  },

  am: {
    portalTitle: "የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ የገቢዎች ሚኒስቴር",
    subTitle: "ገቢዎች ቢሮ AI — የተቀናጀ የዜጎችና የድርጅቶች አገልግሎት ማስተዳደሪያ መድረክ",
    roleSwitcher: "የአሁኑ ሚና",
    currentRole: "የተመረጠ ሚና",
    roles: {
      customer: "ዜጋ / ግብር ከፋይ",
      client: "የድርጅት ተገልጋይ (PLC)",
      admin: "የገቢዎች ጉዳይ አስተዳዳሪ / ኦፊሰር",
      director: "የቢሮ ዳይሬክተር (አጽዳቂ)",
      superadmin: "ዋና አስተዳዳሪ (Super Admin & SOC)",
    },
    roleDescriptions: {
      customer: "የግብር ክሊራንስ፣ የቲን ምዝገባ፣ ቅሬታና የመረጃ አያያዝ ጥያቄ የሚያቀርብ ዜጋ።",
      client: "የተመዘገበ የግል ድርጅት (ABC ኮንስትራክሽን ኃላ/የተ/የግ/ማ) ሠራተኞች የደመወዝ ግብርና ቫት።",
      admin: "ጉዳዮችን መመርመር፣ የ AI OCR ሰነድ ማረጋገጫና ለዳይሬክተር ማስተላለፍ።",
      director: "ከፍተኛ ውሳኔዎችን ማጽደቅ፣ የቢሮ የጠዋት AI ሪፖርትና ዲጂታል ማህተም ማድረግ።",
      superadmin: "የስርዓቱን ደህንነት፣ Go እና Rust አገልጋዮች ክትትልና የመረጃ ኦዲት መቆጣጠር።",
    },
    nav: {
      dashboard: "ዳሽቦርድ",
      cases: "የጉዳዮች መዝገብ",
      documents: "የሰነድ ማህደር",
      aiAssistant: "GovAI ረዳት",
      auditLogs: "የማይለወጥ የኦዲት መዝገብ",
      securityCenter: "የደህንነት ማዕከል",
      appointments: "ቀጠሮዎች",
      systemArch: "የሲስተም አርክቴክቸር",
    },
    caseStatus: {
      submitted: "ቀርቧል",
      ai_validation: "AI በመመርመር ላይ",
      officer_review: "በኦፊሰር ምርመራ",
      admin_verified: "በአስተዳዳሪ ተረጋግጧል",
      director_pending: "የዳይሬክተር ውሳኔ የሚጠብቅ",
      approved: "ጸድቋል (የተረጋገጠ)",
      rejected: "ተቀባይነት አላገኘም",
      escalated: "ለሕግ ክፍል ተላልፏል",
    },
    priority: {
      low: "ዝቅተኛ ቅድሚያ",
      medium: "መደበኛ",
      high: "ከፍተኛ ቅድሚያ",
      critical: "አስቸኳይ ውሳኔ",
    },
    actions: {
      newCase: "አዲስ ማመልከቻ አስገባ",
      trackCase: "የጉዳዩን ሂደት ተከታተል",
      askGovAi: "GovAI ረዳትን ጠይቅ",
      approve: "አጽድቅ (ዲጂታል ማህተም)",
      reject: "ውድቅ አድርግ",
      escalate: "ወደ ኦዲት/ሕግ አሳልፍ",
      verify: "አረጋግጥና አስላልፍ",
      uploadDoc: "ሰነድ ጫን (Rust SHA-256)",
      downloadCertificate: "ዲጂታል ምስክር ወረቀት",
      search: "በጉዳይ መለያ፣ ቲን ወይም ስም ፈልግ...",
      filter: "አጣራ",
      refresh: "አድስ",
      close: "ዝጋ",
    },
    customerStats: {
      completed: "የተጠናቀቁ ጉዳዮች",
      processing: "በሂደት ላይ ያሉ",
      actionRequired: "ማስተካከያ የሚሹ",
      taxClearanceStatus: "የግብር ክሊራንስ ሁኔታ",
    },
    directorStats: {
      pendingApprovals: "ውሳኔ የሚጠብቁ",
      highPriorityCases: "ከፍተኛ ቅድሚያ ጉዳዮች",
      escalatedCases: "የተላለፉ ጉዳዮች",
      departmentPerf: "የቅርንጫፎች ቅልጥፍና",
    },
    officerStats: {
      newCases: "አዳዲስ ጉዳዮች",
      inProgress: "በሂደት ላይ",
      pendingApproval: "ማጽደቂያ የሚጠብቅ",
      completed: "የተጠናቀቁ",
      escalated: "የተላለፉ",
      aiAlerts: "የ AI አጠራጣሪ ማንቂያዎች",
    },
  },

  om: {
    portalTitle: "FDRE Ministeera Galiiwwanii",
    subTitle: "GovRevenue AI — Sirna Bulchiinsa Tajaajila Galii Lammiilee fi Dhaabbilee",
    roleSwitcher: "Gahee Ammaa",
    currentRole: "Gahee Filatame",
    roles: {
      customer: "Lammii / Kaffalaa Gibiraa",
      client: "Dhaabbata Daldalaa (PLC)",
      admin: "Gaggeessaa / Qorataa Dhimmaa",
      director: "Daarektara Biiroo (Mirkaneessaa)",
      superadmin: "Super Admin & Eegumsa SOC",
    },
    roleDescriptions: {
      customer: "Waraqaa qulqullina gibiraa, galmee TIN, fi tajaajiloota biroo kan barbaadu.",
      client: "Dhaabbata galmaa'e (ABC Construction PLC) gibira mindaa fi VAT kan bulchu.",
      admin: "Dhimmoota qorachuu, AI OCR fayyadamuun ragaa mirkaneessuu fi dabarsuu.",
      director: "Murteewwan gurguddoo mirkaneessuu, gabaasa AI ganamaa fi chaappaa dijiitaalaa.",
      superadmin: "Nageenya sirnichaa, microservices Go/Rust fi galmee oodiitii to'achuu.",
    },
    nav: {
      dashboard: "Daashboordii",
      cases: "Galmee Dhimmootaa",
      documents: "Kuusaa Sanadootaa",
      aiAssistant: "Gargaaraa GovAI",
      auditLogs: "Galmee Oodiitii",
      securityCenter: "Giddugala Nageenyaa",
      appointments: "Beellamoota",
      systemArch: "Ijaarsa Sirnichaa",
    },
    caseStatus: {
      submitted: "Dhiyaateera",
      ai_validation: "Qorannoo AI",
      officer_review: "Qorannoo Hojjetaa",
      admin_verified: "Gaggeessaan Mirkanaa'e",
      director_pending: "Eeyyama Daarektaraa Eega",
      approved: "Mirkanaa'eera",
      rejected: "Kufaa Ta'eera",
      escalated: "Gara Seeraatti Dabarfame",
    },
    priority: {
      low: "Dursa Gad-aanaa",
      medium: "Idilee",
      high: "Dursa Ol-aanaa",
      critical: "Ariifachiisaa",
    },
    actions: {
      newCase: "Iyyannoo Haaraa Galchi",
      trackCase: "Adeemsa Dhimmaa Hordofi",
      askGovAi: "GovAI Gaafadhu",
      approve: "Mirkaneessi (Chaappaa)",
      reject: "Kufaa Taasisi",
      escalate: "Gara Seeraatti Dabarai",
      verify: "Mirkaneessi & Dabarai",
      uploadDoc: "Sanada Ol-kaa'i (Rust SHA-256)",
      downloadCertificate: "Waraqaa Ragaa Dijiitaalaa",
      search: "Lakkoofsa Dhimmaa, TIN ykn Maqaadhaan Barbaadi...",
      filter: "Filtari",
      refresh: "Haaromsi",
      close: "Cufi",
    },
    customerStats: {
      completed: "Dhimmoota Xumuraman",
      processing: "Adeemsa Irra Kan Jiran",
      actionRequired: "Tarkaanfii Kan Barbaadan",
      taxClearanceStatus: "Haala Qulqullina Gibiraa",
    },
    directorStats: {
      pendingApprovals: "Mirkaneessa Kan Eegan",
      highPriorityCases: "Dhimmoota Dursa Ol-aanaa",
      escalatedCases: "Dhimmoota Dabarfaman",
      departmentPerf: "Hojii Dameelee",
    },
    officerStats: {
      newCases: "Dhimmoota Haaraa",
      inProgress: "Adeemsa Irra Jiran",
      pendingApproval: "Mirkaneessa Eegan",
      completed: "Xumuraman",
      escalated: "Dabarfaman",
      aiAlerts: "Akeekkachiisa AI",
    },
  },
};
