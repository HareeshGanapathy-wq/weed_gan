/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Leaf,
  FlaskConical,
  Sprout,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { getRemedies } from '../services/api.ts';
import { WeedRemedyProfile, WeedSpecies } from '../types/index.ts';

interface RemediesViewProps {
  initialSpecies?: string;
  onSelectForTraining?: (species: string) => void;
  onOpenVoiceWithQuery?: (query: string) => void;
}

export const RemediesView: React.FC<RemediesViewProps> = ({
  initialSpecies,
  onSelectForTraining,
  onOpenVoiceWithQuery,
}) => {
  const [remediesList, setRemediesList] = useState<WeedRemedyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>(initialSpecies || 'all');
  const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSpecies) {
      setSelectedSpecies(initialSpecies);
    }
  }, [initialSpecies]);

  const loadRemedies = async () => {
    setLoading(true);
    try {
      const data = await getRemedies({
        species: selectedSpecies !== 'all' ? selectedSpecies : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
      });
      setRemediesList(data.remedies);

      // Expand the first 2 by default
      const initExpanded: Record<string, boolean> = {};
      data.remedies.slice(0, 2).forEach((r) => {
        initExpanded[r.speciesId] = true;
      });
      setExpandedProfiles((prev) => ({ ...initExpanded, ...prev }));
    } catch (err) {
      console.error('Failed to load weed remedies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemedies();
  }, [selectedSpecies, selectedCategory]);

  const toggleExpand = (speciesId: string) => {
    setExpandedProfiles((prev) => ({
      ...prev,
      [speciesId]: !prev[speciesId],
    }));
  };

  const threatColor = (level: WeedRemedyProfile['threatLevel']) => {
    switch (level) {
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Agronomic Remedy Protocols
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Targeted Weed Treatment & Control Database
          </h2>
          <p className="mt-2 text-stone-200 text-sm sm:text-base leading-relaxed">
            Evidence-based agronomic solutions spanning organic bio-control, cultural suppression, and precise chemical programs with active ingredient dosages, spray windows, and rotational safety guidelines.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenVoiceWithQuery?.('What are the remedies for Pigweed?')}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask Voice Assistant for Advice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadRemedies()}
            placeholder="Search by weed name, active ingredient (e.g., Mesotrione), or crop..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Species selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-stone-500">Species:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="all">All Species</option>
              <option value="pigweed">Redroot Pigweed</option>
              <option value="crabgrass">Large Crabgrass</option>
              <option value="lambsquarters">Common Lambsquarters</option>
              <option value="nutsedge">Yellow Nutsedge</option>
              <option value="foxtail">Green Foxtail</option>
              <option value="dandelion">Common Dandelion</option>
              <option value="bindweed">Field Bindweed</option>
              <option value="barnyardgrass">Barnyardgrass</option>
            </select>
          </div>

          {/* Category tabs */}
          <div className="flex items-center rounded-lg border border-stone-200 p-1 bg-stone-50">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'organic', label: 'Organic', icon: Leaf },
              { id: 'chemical', label: 'Chemical', icon: FlaskConical },
              { id: 'cultural', label: 'Cultural', icon: Sprout },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={loadRemedies}
            className="px-4 py-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Remedies List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Loading agronomic remedies...</p>
        </div>
      ) : remediesList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <Info className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800">No remedy profiles match your criteria</h3>
          <p className="text-xs text-stone-500 mt-1">Try resetting your search query or selecting "All Species".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecies('all');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {remediesList.map((profile) => {
            const isExpanded = Boolean(expandedProfiles[profile.speciesId]);

            return (
              <div
                key={profile.speciesId}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all hover:border-emerald-200"
              >
                {/* Weed Header Card */}
                <div
                  onClick={() => toggleExpand(profile.speciesId)}
                  className="p-5 sm:p-6 cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs font-bold text-lg">
                      {profile.commonName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg text-stone-900 tracking-tight">
                          {profile.commonName}
                        </h3>
                        <span className="italic text-stone-500 text-xs sm:text-sm">
                          ({profile.scientificName})
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${threatColor(profile.threatLevel)}`}>
                          {profile.threatLevel} Threat
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                        <span>Family: <strong>{profile.family}</strong></span>
                        <span>Type: <strong>{profile.weedType}</strong></span>
                        <span>Lifecycle: <strong>{profile.lifecycle}</strong></span>
                        <span>
                          Crops affected: <strong>{profile.typicalCropsAffected.join(', ')}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVoiceWithQuery?.(`What is the recommended treatment for ${profile.commonName}?`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1.5 border border-emerald-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask Copilot</span>
                    </button>

                    <div className="p-2 rounded-lg text-stone-400 hover:text-stone-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details and Treatment Protocols */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Botanical Identification & Germination triggers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs text-stone-700">
                      <div>
                        <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-emerald-700" /> Botanical Identification Tips
                        </h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-stone-600">
                          {profile.identificationTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Germination & Emergence Window
                        </h4>
                        <p className="text-stone-600 mb-2 leading-relaxed">{profile.germinationConditions}</p>
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-emerald-900">
                          <span className="font-semibold">Optimal Spray Window:</span> {profile.bestSprayWindow}
                        </div>
                      </div>
                    </div>

                    {/* Remedy Cards Grid */}
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        Remedy Programs ({profile.remedies.length} protocols)
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {profile.remedies.map((rem, rIdx) => {
                          const isOrganic = rem.category === 'organic';
                          const isChemical = rem.category === 'chemical';
                          const isCultural = rem.category === 'cultural';

                          return (
                            <div
                              key={rIdx}
                              className={`rounded-xl p-5 border flex flex-col justify-between ${
                                isOrganic
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : isChemical
                                  ? 'bg-blue-50/40 border-blue-200'
                                  : isCultural
                                  ? 'bg-amber-50/40 border-amber-200'
                                  : 'bg-stone-50 border-stone-200'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                                      isOrganic
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isChemical
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {rem.category} Remedy
                                  </span>

                                  <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
                                    <span>Efficacy:</span>
                                    <span className="text-emerald-700 font-bold">{rem.efficacy}%</span>
                                  </div>
                                </div>

                                <h5 className="font-bold text-stone-900 text-base mb-1.5">{rem.title}</h5>
                                <p className="text-xs text-stone-600 mb-3 leading-relaxed">{rem.description}</p>

                                {/* Specific active ingredient / dosage for chemical */}
                                {rem.activeIngredients && (
                                  <div className="mb-3 p-3 rounded-lg bg-white border border-stone-200 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-stone-500">Active Ingredient:</span>
                                      <span className="font-bold text-stone-800">{rem.activeIngredients}</span>
                                    </div>
                                    {rem.dosage && (
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-stone-500">Recommended Dosage:</span>
                                        <span className="font-bold text-emerald-800">{rem.dosage}</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Step by step instructions */}
                                <div className="space-y-1.5 mb-3">
                                  <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                                    Application Protocol:
                                  </span>
                                  {rem.instructions.map((step, sIdx) => (
                                    <div key={sIdx} className="flex items-start gap-2 text-xs text-stone-700">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-stone-200/60 text-[11px] text-stone-500 flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                                  <span>Timing: <strong>{rem.timing}</strong></span>
                                </div>
                                {rem.safetyNote && (
                                  <div className="flex items-start gap-1.5 text-amber-800 mt-1">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <span>{rem.safetyNote}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Environmental Caution */}
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Environmental Buffer & Eco Precautions: </span>
                        <span>{profile.environmentalCaution}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
