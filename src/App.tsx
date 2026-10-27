/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Database,
  History,
  Compass,
  BarChart3,
  Mic,
  Sprout,
  Menu,
  X,
  Bot,
  Activity,
  Layers,
} from 'lucide-react';
import { DetectionStudio } from './components/DetectionStudio.tsx';
import { RemediesView } from './components/RemediesView.tsx';
import { TrainingDatabaseView } from './components/TrainingDatabaseView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { DensityMapView } from './components/DensityMapView.tsx';
import { AnalysisView } from './components/AnalysisView.tsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.tsx';
import { VoiceAssistantResponse } from './types/index.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'remedies' | 'training' | 'history' | 'density' | 'analytics'>('studio');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [initialRemedySpecies, setInitialRemedySpecies] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleNavigateTab = (tab: string, payload?: any) => {
    if (tab === 'remedies') {
      setActiveTab('remedies');
      if (payload?.species) {
        setInitialRemedySpecies(payload.species);
      }
    } else if (['studio', 'training', 'history', 'density', 'analytics'].includes(tab)) {
      setActiveTab(tab as any);
    }
  };

  const handleOpenVoiceWithQuery = (query: string) => {
    setIsVoiceOpen(true);
  };

  const handleActionTriggered = (action: VoiceAssistantResponse['action']) => {
    if (action?.type === 'PRUNE_HISTORY') {
      setHistoryRefreshKey((prev) => prev + 1);
    }
  };

  const navItems = [
    { id: 'studio', label: 'Detection Studio', icon: Sparkles },
    { id: 'remedies', label: 'Weed Remedies', icon: ShieldCheck, badge: 'New' },
    { id: 'training', label: 'Training Images', icon: Database, badge: 'Dataset' },
    { id: 'history', label: 'Detection History', icon: History },
    { id: 'density', label: 'Density Map', icon: Compass },
    { id: 'analytics', label: 'Analytics & ROI', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900">
                    WEED<span className="text-emerald-700">.AI</span>
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Precision Agronomy
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Detection, Agronomic Remedies & Recognition Training
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Voice Assistant Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all hover:shadow-md ring-2 ring-emerald-600/20 active:scale-95"
                title="Open Voice Copilot (Voice & Text)"
              >
                <div className="relative flex items-center justify-center">
                  <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="hidden sm:inline">Voice Copilot</span>
                <span className="sm:hidden">Voice</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <DetectionStudio
            onNavigateToRemedies={(species) => handleNavigateTab('remedies', { species })}
            onOpenVoiceWithQuery={handleOpenVoiceWithQuery}
            onDetectionCompleted={() => setHistoryRefreshKey((k) => k + 1)}
          />
        )}

        {activeTab === 'remedies' && (
          <RemediesView
            initialSpecies={initialRemedySpecies}
            onSelectForTraining={(species) => handleNavigateTab('training', { species })}
            onOpenVoiceWithQuery={handleOpenVoiceWithQuery}
          />
        )}

        {activeTab === 'training' && (
          <TrainingDatabaseView onOpenVoiceWithQuery={handleOpenVoiceWithQuery} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            refreshTrigger={historyRefreshKey}
            onNavigateRemedies={(species) => handleNavigateTab('remedies', { species })}
            onOpenVoiceWithQuery={handleOpenVoiceWithQuery}
          />
        )}

        {activeTab === 'density' && (
          <DensityMapView
            onNavigateToRemedies={(species) => handleNavigateTab('remedies', { species })}
            onOpenVoiceWithQuery={handleOpenVoiceWithQuery}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalysisView
            onNavigateToRemedies={() => handleNavigateTab('remedies')}
            onOpenVoiceWithQuery={handleOpenVoiceWithQuery}
          />
        )}
      </main>

      {/* Corrected AgriVoice Copilot Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentTab={activeTab}
        onNavigateTab={handleNavigateTab}
        onActionTriggered={handleActionTriggered}
      />

      {/* Floating Quick Voice Assistant Trigger (bottom right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 ring-4 ring-emerald-500/20 active:scale-95"
          title="Talk with AgriVoice Copilot"
        >
          <div className="relative">
            <Mic className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-semibold text-xs sm:text-sm tracking-tight pr-1">AgriVoice AI</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-stone-700">WEED.AI Platform</span>
            <span>• Full-Stack Agronomic Decision Support System</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>YOLO / COCO Compatible Training Hub</span>
            <span>•</span>
            <span>Targeted Agronomic Remedies</span>
            <span>•</span>
            <span>Real-time Voice Copilot</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
