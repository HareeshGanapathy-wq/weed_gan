/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getFields, getAnalysis } from '../services/api.ts';
import { FieldInfo } from '../types/index.ts';

interface AnalysisViewProps {
  onNavigateToRemedies?: () => void;
  onOpenVoiceWithQuery?: (query: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  onNavigateToRemedies,
  onOpenVoiceWithQuery,
}) => {
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_a');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const fieldList = await getFields();
        setFields(fieldList);
        if (fieldList.length > 0) {
          const data = await getAnalysis(fieldList[0].id);
          setAnalysis(data);
        }
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSelectField = async (id: string) => {
    setSelectedFieldId(id);
    setLoading(true);
    try {
      const data = await getAnalysis(id);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to update field analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const broadcastCost = analysis ? Math.round(analysis.areaHectares * 78.5) : 1100;
  const targetedCost = analysis?.herbicideCostEstimateUsd || 430;
  const savings = broadcastCost - targetedCost;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Precision Agronomy Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Weed Pressure & Economic ROI Analytics</h2>
          <p className="mt-1.5 text-stone-300 text-xs sm:text-sm max-w-2xl">
            Quantify chemical input reduction, weekly weed infestation trajectories, and savings achieved through AI spot spraying over traditional broadcast herbicide application.
          </p>
        </div>

        <div>
          <select
            value={selectedFieldId}
            onChange={(e) => handleSelectField(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-xs sm:text-sm focus:outline-none"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id} className="text-stone-900">
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ROI & Chemical Savings Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Estimated Precision Savings</span>
            <div className="text-2xl font-bold text-emerald-800 mt-0.5">${savings} USD</div>
            <span className="text-[11px] text-stone-500">Over conventional broadcast spray</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Chemical Reduction</span>
            <div className="text-2xl font-bold text-blue-900 mt-0.5">
              {Math.round((savings / broadcastCost) * 100)}%
            </div>
            <span className="text-[11px] text-stone-500">Targeted spot application efficiency</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Average Weed Density</span>
            <div className="text-2xl font-bold text-stone-900 mt-0.5">
              {analysis?.currentAverageDensity || 14.2}%
            </div>
            <span className="text-[11px] text-stone-500">Current field average coverage</span>
          </div>
        </div>
      </div>

      {/* Historical Trend and Species Breakdown */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trend Bars (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Weekly Weed Density Progression</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tracks weed density % across weekly drone & tractor passes.
                </p>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="py-6 space-y-4">
              {analysis.historicalTrend.map((t: any, idx: number) => {
                const barWidth = `${Math.min(100, t.weedDensity * 3)}%`;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-700">{t.week}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-800 font-bold">{t.weedDensity}% Density</span>
                        <span className="text-stone-400 text-[11px]">Stress: {t.cropStressIndex}/100</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: barWidth }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.weedDensity > 20
                            ? 'bg-rose-500'
                            : t.weedDensity > 12
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Threshold line: 15% density triggers economic weed loss</span>
              <span className="text-emerald-700 font-semibold">Post-spray reduction active</span>
            </div>
          </div>

          {/* Species Distribution Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Species Infestation Distribution</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Dominant weed species identified across active sectors.
              </p>
            </div>

            <div className="space-y-3 py-2">
              {analysis.speciesDistribution.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-stone-800">{item.name}</span>
                    </div>
                    <span className="font-bold text-stone-900">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <span className="font-semibold block flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Agronomic Prescription Note:
              </span>
              <p className="text-stone-700 leading-relaxed">{analysis.recommendedAction}</p>
              <button
                onClick={onNavigateToRemedies}
                className="mt-1 text-emerald-800 hover:text-emerald-950 font-bold underline underline-offset-2 flex items-center gap-1"
              >
                <span>Browse Full Remedy Programs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
