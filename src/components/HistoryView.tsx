/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  Scissors,
  Trash2,
  Search,
  Filter,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import {
  getHistory,
  deleteHistoryItem,
  pruneHistory,
  clearAllHistory,
} from '../services/api.ts';
import { DetectionResult } from '../types/index.ts';

interface HistoryViewProps {
  onSelectRecordForInspection?: (record: DetectionResult) => void;
  onNavigateRemedies?: (speciesId: string) => void;
  onOpenVoiceWithQuery?: (query: string) => void;
  refreshTrigger?: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectRecordForInspection,
  onNavigateRemedies,
  onOpenVoiceWithQuery,
  refreshTrigger = 0,
}) => {
  const [historyList, setHistoryList] = useState<DetectionResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [isCompactView, setIsCompactView] = useState(false);
  const [pruningStatus, setPruningStatus] = useState<string | null>(null);

  // Inspector modal
  const [inspectedRecord, setInspectedRecord] = useState<DetectionResult | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory({
        species: selectedSpecies !== 'all' ? selectedSpecies : undefined,
        search: searchQuery.trim() || undefined,
      });
      setHistoryList(data.history);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Failed to load detection history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedSpecies, refreshTrigger]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this detection record from history?')) return;
    try {
      await deleteHistoryItem(id);
      loadHistory();
    } catch (err) {
      alert('Failed to delete history item');
    }
  };

  const handlePruneHistory = async (keepCount: number) => {
    try {
      const res = await pruneHistory(keepCount);
      setPruningStatus(`Reduced detection history: retained ${res.remainingCount} recent scans (removed ${res.removedCount}).`);
      setTimeout(() => setPruningStatus(null), 4000);
      loadHistory();
    } catch (err) {
      alert('Failed to prune detection history');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL detection history?')) return;
    try {
      await clearAllHistory();
      setPruningStatus('All detection history has been cleared.');
      setTimeout(() => setPruningStatus(null), 3000);
      loadHistory();
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Reduce Detection History Controls */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" /> Field Scans Archive
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Detection History & Pruning</h2>
          <p className="mt-1 text-stone-300 text-xs sm:text-sm">
            Review past scans, inspect weed bounding boxes, or reduce detection history to minimize storage and UI clutter.
          </p>
        </div>

        {/* Reduce Detection History Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs p-1 rounded-xl border border-white/15">
            <span className="text-xs font-semibold text-emerald-300 px-2 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" /> Reduce History:
            </span>
            <button
              onClick={() => handlePruneHistory(3)}
              title="Reduce history to the 3 most recent scans"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors"
            >
              Keep 3
            </button>
            <button
              onClick={() => handlePruneHistory(5)}
              title="Reduce history to the 5 most recent scans"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              Keep 5
            </button>
            <button
              onClick={handleClearAll}
              title="Clear all detection history"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-900/60 hover:bg-rose-800 text-rose-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Pruning Feedback Status */}
      {pruningStatus && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pruningStatus}</span>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadHistory()}
            placeholder="Search scans by field name, weed type, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white text-stone-700"
          >
            <option value="all">All Weeds</option>
            <option value="pigweed">Pigweed</option>
            <option value="crabgrass">Crabgrass</option>
            <option value="lambsquarters">Lambsquarters</option>
            <option value="nutsedge">Nutsedge</option>
            <option value="foxtail">Foxtail</option>
          </select>

          {/* Toggle compact / reduced view */}
          <button
            onClick={() => setIsCompactView(!isCompactView)}
            className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isCompactView
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-300 text-stone-600'
            }`}
            title="Toggle between full cards and reduced compact list"
          >
            {isCompactView ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
            <span>{isCompactView ? 'Compact View' : 'Card View'}</span>
          </button>

          <button
            onClick={loadHistory}
            className="px-3.5 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium"
          >
            Filter
          </button>
        </div>
      </div>

      {/* History Items List / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Loading detection history...</p>
        </div>
      ) : historyList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <History className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800">No detection scans in history</h3>
          <p className="text-xs text-stone-500 mt-1">Run a scan in the Detection Studio to record field analytics.</p>
        </div>
      ) : isCompactView ? (
        /* Reduced Compact View */
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 shadow-xs overflow-hidden">
          {historyList.map((item) => (
            <div
              key={item.id}
              onClick={() => setInspectedRecord(item)}
              className="p-3 sm:p-4 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.fieldName}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-stone-900">{item.fieldName}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {item.densityLevel} ({item.weedDensityPercentage}%)
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-3 mt-0.5">
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    <span>{item.totalWeeds} weeds detected</span>
                    <span className="text-emerald-700 font-medium">
                      {(item.averageConfidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectedRecord(item);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  title="Delete record"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {historyList.map((item) => (
            <div
              key={item.id}
              onClick={() => setInspectedRecord(item)}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Image & Metrics */}
                <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.fieldName}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/70 backdrop-blur-xs text-white">
                      {item.densityLevel} Density ({item.weedDensityPercentage}%)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-700 text-white">
                      {item.totalWeeds} Weeds
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    title="Delete record"
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-2 left-3 text-[11px] text-stone-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-base">{item.fieldName}</h3>
                    <span className="text-xs font-semibold text-emerald-800">
                      {(item.averageConfidence * 100).toFixed(1)}% conf.
                    </span>
                  </div>

                  {/* Species breakdown pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {Object.entries(item.speciesBreakdown).map(([species, count]) => (
                      <span
                        key={species}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200 capitalize"
                      >
                        {species}: {count}
                      </span>
                    ))}
                  </div>

                  {item.notes && (
                    <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Recommended Remedy Preview */}
              {item.recommendedRemedies && item.recommendedRemedies.length > 0 && (
                <div className="px-5 py-3 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                  <span className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    {item.recommendedRemedies[0].commonName} Protocol
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateRemedies?.(item.recommendedRemedies[0].speciesId);
                    }}
                    className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Remedy</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inspect Single Record Modal */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-lg text-stone-900">{inspectedRecord.fieldName}</h3>
                <span className="text-xs text-stone-500">{new Date(inspectedRecord.timestamp).toLocaleString()}</span>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 aspect-16/9 bg-stone-900 rounded-xl overflow-hidden relative">
              <img
                src={inspectedRecord.imageUrl}
                alt={inspectedRecord.fieldName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Total Weeds</span>
                <span className="text-base font-bold text-stone-900">{inspectedRecord.totalWeeds}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Weed Density</span>
                <span className="text-base font-bold text-emerald-800">{inspectedRecord.weedDensityPercentage}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Confidence</span>
                <span className="text-base font-bold text-stone-900">
                  {(inspectedRecord.averageConfidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Latency</span>
                <span className="text-base font-bold text-stone-900">{inspectedRecord.processingTimeMs} ms</span>
              </div>
            </div>

            {/* Detections listing */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Identified Detections ({inspectedRecord.detections.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-stone-100">
                {inspectedRecord.detections.map((det) => (
                  <div key={det.id} className="pt-1.5 flex items-center justify-between text-xs text-stone-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="font-semibold">{det.commonName}</span>
                      <span className="text-stone-400 italic">({det.scientificName})</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Remedies */}
            {inspectedRecord.recommendedRemedies && inspectedRecord.recommendedRemedies.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Agronomic Remedy Plan
                </h4>
                <div className="space-y-2">
                  {inspectedRecord.recommendedRemedies.map((rem) => (
                    <div
                      key={rem.speciesId}
                      className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-emerald-950">{rem.commonName}</span>
                        <p className="text-emerald-800 text-[11px] mt-0.5">{rem.remedies[0]?.title}</p>
                      </div>
                      <button
                        onClick={() => {
                          setInspectedRecord(null);
                          onNavigateRemedies?.(rem.speciesId);
                        }}
                        className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-medium hover:bg-emerald-800 text-[11px]"
                      >
                        Open Protocol
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
