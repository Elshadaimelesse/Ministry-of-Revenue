import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, AlertTriangle, ShieldCheck, X, Globe2, Loader2 } from 'lucide-react';
import { UserRole, Language } from '../types';
import { GovAiService } from '../services/aiService';

interface GovAiModalProps {
  currentRole: UserRole;
  language: Language;
  onClose: () => void;
  activeCaseId?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'govai';
  text: string;
  citations?: string[];
  recommendations?: string[];
  risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export const GovAiModal: React.FC<GovAiModalProps> = ({
  currentRole,
  language: initialLang,
  onClose,
  activeCaseId
}) => {
  const [lang, setLang] = useState<Language>(initialLang);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'govai',
      text: lang === 'am' 
        ? `እንኳን ደህና መጡ! እኔ የኢትዮጵያ ገቢዎች ሚኒስቴር ይፋዊ GovAI ረዳት ነኝ። እንደ [${currentRole}] ስለ ግብር አከፋፈል፣ የክሊራንስ ምስክር ወረቀት፣ የሰነድ ዝርዝር፣ ወይም በአዋጅ ቁጥር 979/2016 ድንጋጌዎች ዙሪያ ማብራሪያ ልሰጥዎ እችላለሁ።`
        : lang === 'om'
        ? `Baga nagaan dhuftan! Ani gargaaraa GovAI Ministeera Galiiwwaniiti. Akka [${currentRole}]tti waa'ee qulqullina gibiraa, galmee TIN, fi Labsii Lakkoofsa 979/2016 irratti gorsa isiniif kennuuf qophiidha.`
        : `Welcome to GovRevenue AI Assistant. I am your specialized intelligent agent for the FDRE Ministry of Revenues. How can I assist you with Ethiopian revenue laws, case assessments, or document requirements today?`,
      citations: ['Proclamation No. 979/2016', 'Ministry of Revenues Citizen Charter'],
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts: { label: string; prompt: string }[] = [
    {
      label: '📄 Tax Clearance Requirements',
      prompt: 'What documents are legally required for a Tax Clearance Certificate in Ethiopia?'
    },
    {
      label: '🇪🇹 አማርኛ፦ የክሊራንስ ሰነድ',
      prompt: 'ለግብር ክሊራንስ ምስክር ወረቀት ምን ሰነዶች ያስፈልጋሉ?'
    },
    {
      label: '⚖️ VAT & TOT Rates',
      prompt: 'What are the current VAT and Turnover Tax (TOT) thresholds and percentages under Ethiopian law?'
    },
    {
      label: '🚨 Anomaly & Fraud Rules',
      prompt: 'How does GovAI detect revenue declaration anomalies and audit discrepancies?'
    },
    {
      label: '🏢 Category A vs B Audit',
      prompt: 'What are the auditing requirements for Category A vs Category B taxpayers?'
    }
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await GovAiService.queryGovAi(
        query,
        currentRole,
        lang,
        activeCaseId ? `Current active case: ${activeCaseId}` : undefined
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'govai',
        text: response.answer,
        citations: response.sourceCitations,
        recommendations: response.recommendedActions,
        risk: response.riskAssessment,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'govai',
          text: 'GovAI is currently refreshing internal embeddings. Please check your network or try again.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">GovRevenue AI Agent</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  Role: {currentRole.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                FDRE Legal Knowledge Base • Multilingual RAG Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
              <Globe2 className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
              {(['en', 'am', 'om'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                    lang === l ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'am' ? 'አማ' : 'OM'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'govai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-xl p-3.5 space-y-2 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 shadow-md'
              }`}>
                <div className="leading-relaxed whitespace-pre-line text-[12px]">
                  {m.text}
                </div>

                {/* AI Source Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      <span>Official Legal Citations:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.citations.map((cite, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment Flag */}
                {m.risk && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-mono">
                    <AlertTriangle className={`w-3 h-3 ${
                      m.risk === 'HIGH' || m.risk === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'
                    }`} />
                    <span className="text-slate-400">Risk Assessment:</span>
                    <span className={`font-bold ${
                      m.risk === 'HIGH' || m.risk === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {m.risk}
                    </span>
                  </div>
                )}

                <div className={`text-[10px] text-right font-mono ${
                  m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs w-fit">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>GovAI consulting Ethiopian Revenue proclamations & vector store...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition flex items-center gap-1 border border-slate-700/60"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'am' ? 'ጥያቄዎን እዚህ ይጻፉ (በአማርኛ ወይም በእንግሊዝኛ)...' : 'Type your revenue inquiry or legal query...'}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Official Government Guidance Mode
            </span>
            <span>Grounded in Proclamation 979/2016</span>
          </div>
        </div>

      </div>
    </div>
  );
};
