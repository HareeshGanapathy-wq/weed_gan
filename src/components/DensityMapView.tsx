/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Sparkles,
  Info,
  Droplets,
  AlertTriangle,
  Compass,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { getFields, getDensity } from '../services/api.ts';
import { FieldInfo, DensityPoint } from '../types/index.ts';

interface DensityMapViewProps {
  onNavigateToRemedies?: (weed: string) => void;
  onOpenVoiceWithQuery?: (query: string) => void;
}

export const DensityMapView: React.FC<DensityMapViewProps> = ({
  onNavigateToRemedies,
  onOpenVoiceWithQuery,
}) => {
  const [fieldsList, setFieldsList] = useState<FieldInfo[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_a');
  const [densityData, setDensityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<DensityPoint | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const fields = await getFields();
        setFieldsList(fields);
        if (fields.length > 0) {
          const dData = await getDensity(fields[0].id);
          setDensityData(dData);
          if (dData.points.length > 0) setSelectedPoint(dData.points[0]);
        }
      } catch (err) {
        console.error('Failed to load fields:', err);
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
      const dData = await getDensity(id);
      setDensityData(dData);
      if (dData.points.length > 0) setSelectedPoint(dData.points[0]);
    } catch (err) {
      console.error('Failed to change field:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCellColor = (density: number) => {
    if (density < 5) return 'bg-emerald-100 border-emerald-300 text-emerald-950';
    if (density < 15) return 'bg-emerald-200 border-emerald-400 text-emerald-950';
    if (density < 30) return 'bg-yellow-200 border-yellow-400 text-yellow-950';
    if (density < 50) return 'bg-amber-300 border-amber-500 text-amber-950';
    return 'bg-rose-400 border-rose-600 text-rose-950 animate-pulse';
  };

  const activeField = fieldsList.find((f) => f.id === selectedFieldId) || fieldsList[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> Spatial Agronomy
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Geospatial Weed Density Heatmap</h2>
          <p className="mt-1.5 text-stone-300 text-xs sm:text-sm max-w-2xl">
            High-density GPS grid mapping displaying localized weed hotspots, infestation severity, and variable-rate spraying prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFieldId}
            onChange={(e) => handleSelectField(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {fieldsList.map((f) => (
              <option key={f.id} value={f.id} className="text-stone-900">
                {f.name} ({f.crop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Field Overview Cards */}
      {activeField && densityData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Field Area</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{densityData.area_hectares} ha</div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">{activeField.crop}</span>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Average Density</span>
            <div className="text-2xl font-bold text-emerald-800 mt-1">
              {densityData.average_density}%
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              {densityData.average_density > 20 ? 'Action Recommended' : 'Optimal Management'}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Peak Density Cluster</span>
            <div className="text-2xl font-bold text-rose-700 mt-1">{densityData.max_density}%</div>
            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Hotspot Zone</span>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Total Weeds Cataloged</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{densityData.total_weeds}</div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Estimated field population</span>
          </div>
        </div>
      )}

      {/* Grid Map and Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Grid Matrix (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-base text-stone-900">Spatial Density Grid (48 Sectors)</h3>
              <p className="text-xs text-stone-500">
                Click any sector to inspect coordinates and spraying prescription.
              </p>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-emerald-200 border border-emerald-400" /> &lt;15%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-yellow-200 border border-yellow-400" /> 15-30%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-amber-300 border border-amber-500" /> 30-50%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-rose-400 border border-rose-600" /> &gt;50%
              </span>
            </div>
          </div>

          {/* Matrix Grid */}
          {densityData && (
            <div className="grid grid-cols-8 gap-2 sm:gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 aspect-16/10 items-stretch">
              {densityData.points.map((pt: DensityPoint) => {
                const isSelected = selectedPoint?.id === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPoint(pt)}
                    className={`rounded-lg border text-center flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer ${getCellColor(
                      pt.density
                    )} ${isSelected ? 'ring-3 ring-emerald-900 scale-105 z-10 shadow-md' : 'hover:scale-102'}`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold">{pt.density}%</span>
                    <span className="hidden sm:block text-[9px] truncate max-w-full opacity-80">
                      {pt.dominantWeed}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
            <span>Location: {activeField?.location}</span>
            <span>Drone imagery survey calibrated 2026</span>
          </div>
        </div>

        {/* Selected Hotspot Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPoint ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    Sector ID: {selectedPoint.id}
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedPoint.dominantWeed} Hotspot
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedPoint.status === 'critical'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedPoint.status === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedPoint.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Density Index:</span>
                  <span className="font-bold text-base text-stone-900">{selectedPoint.density}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Latitude:</span>
                  <span className="font-mono text-stone-800">{selectedPoint.lat}° N</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Longitude:</span>
                  <span className="font-mono text-stone-800">{selectedPoint.lng}° W</span>
                </div>
              </div>

              {/* Prescription */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Variable-Rate Spray Prescription
                </span>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <p className="font-medium leading-relaxed">
                    {selectedPoint.density > 30
                      ? `Apply targeted post-emergence herbicide with 100% spray volume calibrated at 15 gal/acre for ${selectedPoint.dominantWeed}.`
                      : `Maintain shallow inter-row cultivation or spot treatment with bio-herbicidal vinegar spray.`}
                  </p>
                  <button
                    onClick={() => onNavigateToRemedies?.(selectedPoint.dominantWeed.toLowerCase())}
                    className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors"
                  >
                    View {selectedPoint.dominantWeed} Remedy Protocol
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs text-center text-xs text-stone-500">
              Select any sector in the grid to view coordinates and variable-rate prescription.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
