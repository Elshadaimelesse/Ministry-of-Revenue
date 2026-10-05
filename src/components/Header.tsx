import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Briefcase, 
  Sliders, 
  Globe2, 
  Cpu, 
  Search, 
  Bot, 
  Bell, 
  FileCheck2,
  CheckCircle2,
  Download,
  Loader2
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../data/translations';
import { CodeExportService } from '../services/codeExportService';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenArchSpec: () => void;
  onOpenGovAi: () => void;
  onSearchCase: (query: string) => void;
  pendingDirectorCount: number;
  totalAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  onOpenArchSpec,
  onOpenGovAi,
  onSearchCase,
  pendingDirectorCount,
  totalAlertsCount
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadFullCode = async () => {
    setIsExporting(true);
    try {
      await CodeExportService.downloadFullProjectZip();
    } catch (err) {
      console.error('Error generating project ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode; userAlias: string; badge: string; color: string }[] = [
    {
      id: 'customer',
      label: t.roles.customer,
      icon: <User className="w-4 h-4 text-emerald-400" />,
      userAlias: 'Abebe Bikila (Citizen • TIN: 009823145)',
      badge: 'Public Citizen',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'client',
      label: t.roles.client,
      icon: <Building2 className="w-4 h-4 text-cyan-400" />,
      userAlias: 'ABC Construction PLC (Rep: Selamawit D.)',
      badge: 'Corporate Entity',
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'admin',
      label: t.roles.admin,
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      userAlias: 'Officer Dawit Haile (Assessment Div)',
      badge: 'Case Admin / Officer',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    {
      id: 'director',
      label: t.roles.director,
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      userAlias: 'Dr. Kassahun Tadesse (Bureau Director)',
      badge: `Executive Approver ${pendingDirectorCount > 0 ? `(${pendingDirectorCount})` : ''}`,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    {
      id: 'superadmin',
      label: t.roles.superadmin,
      icon: <Sliders className="w-4 h-4 text-rose-400" />,
      userAlias: 'Root Security Officer (SOC & Infra)',
      badge: 'System Admin / SOC',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
  ];

  const currentRoleObj = rolesList.find(r => r.id === currentRole) || rolesList[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchCase(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Gold Government Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Official Emblem & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Ethiopian Official Seal Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 via-slate-800 to-amber-600 p-[2px] shadow-lg flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[4px]"></div>
                <div className="relative text-amber-400 font-black text-lg select-none">
                  ★
                </div>
              </div>
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                  FDRE • የገቢዎች ሚኒስቴር
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GovRevenue v2.6 AI
                </span>
              </div>
              <h1 className="text-sm md:text-base font-bold text-slate-100 tracking-tight truncate">
                {t.portalTitle}
              </h1>
            </div>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t.actions.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                type="submit"
                className="absolute right-2 text-[10px] font-mono bg-emerald-600/30 text-emerald-300 px-1.5 py-0.5 rounded hover:bg-emerald-600/50"
              >
                Go
              </button>
            )}
          </form>

          {/* Action Tools & Switchers */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* GovAI Assistant Trigger */}
            <button
              onClick={onOpenGovAi}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Open GovAI Multilingual Assistant"
            >
              <Bot className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="hidden sm:inline">GovAI</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-mono">
                RAG
              </span>
            </button>

            {/* Architecture Spec Modal Trigger */}
            <button
              onClick={onOpenArchSpec}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
              title="Inspect Go + Rust + React + AI Microservice Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Go / Rust Spec</span>
            </button>

            {/* Direct Download Full Code (.zip) Button */}
            <button
              onClick={handleDownloadFullCode}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm transition-all"
              title="Download Full Project Source Code (.zip)"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">Download Code</span>
            </button>

            {/* Multilingual Selector */}
            <div className="relative">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
                <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
                {(['en', 'am', 'om'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      language === lang 
                        ? 'bg-emerald-600 text-white font-bold shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'OM'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {totalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                    {totalAlertsCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-200">System Notifications</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Director Approval Pending</span>
                        <span className="text-[10px] text-purple-400">12m ago</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Case GR-2026-00001234 (Abebe Bikila) awaiting digital seal.
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>AI Anomaly Flagged</span>
                        <span className="text-[10px] text-amber-400">45m ago</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ABC Construction tariff mismatch on excavator import.
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Rust Hash Verified</span>
                        <span className="text-[10px] text-emerald-400">1h ago</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        SHA-256 fingerprint anchored to ledger with zero memory leak.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-md transition-all ${currentRoleObj.color} hover:brightness-110`}
              >
                {currentRoleObj.icon}
                <div className="text-left hidden sm:block">
                  <div className="leading-none text-[11px] opacity-75 font-normal">
                    {t.currentRole}
                  </div>
                  <div className="leading-tight font-bold">{currentRoleObj.label}</div>
                </div>
                <div className="text-left sm:hidden leading-tight font-bold">
                  {currentRoleObj.label.split(' ')[0]}
                </div>
              </button>

              {/* Role Switch Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      {t.roleSwitcher} (Switch Perspective)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select one of the 5 platform roles to test multi-tier workflows:
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {rolesList.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          onRoleChange(role.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left text-xs transition-colors ${
                          currentRole === role.id 
                            ? 'bg-slate-800 text-white font-medium border border-slate-700' 
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="p-1.5 rounded-md bg-slate-950 border border-slate-700 mt-0.5">
                          {role.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100">{role.label}</span>
                            {currentRole === role.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{role.userAlias}</p>
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                            {role.badge}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
