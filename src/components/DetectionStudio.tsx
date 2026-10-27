/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  Download,
  AlertTriangle,
  Layers,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { detectWeeds } from '../services/api.ts';
import { DetectionResult, DetectionBox, WeedSpecies } from '../types/index.ts';

interface DetectionStudioProps {
  onNavigateToRemedies?: (speciesId: string) => void;
  onOpenVoiceWithQuery?: (query: string) => void;
  onDetectionCompleted?: () => void;
}

export const DetectionStudio: React.FC<DetectionStudioProps> = ({
  onNavigateToRemedies,
  onOpenVoiceWithQuery,
  onDetectionCompleted,
}) => {
  // Preset sample agricultural images for immediate testing
  const presets = [
    {
      id: 'preset-corn',
      name: 'Corn Row (Pigweed & Grasses)',
      field: 'Field Alpha (North Corn Sector)',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%234A3E2D"/><line x1="0" y1="120" x2="640" y2="120" stroke="%233A3022" stroke-width="26"/><line x1="0" y1="280" x2="640" y2="280" stroke="%233A3022" stroke-width="26"/><line x1="0" y1="420" x2="640" y2="420" stroke="%233A3022" stroke-width="26"/><g transform="translate(60, 80)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="%232E6930" transform="rotate(-25)"/><ellipse cx="0" cy="0" rx="35" ry="10" fill="%233E8940" transform="rotate(35)"/></g><g transform="translate(240, 70)"><ellipse cx="0" cy="0" rx="32" ry="11" fill="%232E6930" transform="rotate(-15)"/><ellipse cx="0" cy="0" rx="38" ry="12" fill="%233E8940" transform="rotate(25)"/></g><g transform="translate(480, 85)"><ellipse cx="0" cy="0" rx="34" ry="12" fill="%232E6930" transform="rotate(-30)"/><ellipse cx="0" cy="0" rx="36" ry="11" fill="%233E8940" transform="rotate(30)"/></g><g transform="translate(180, 195)"><ellipse cx="0" cy="0" rx="38" ry="22" fill="%23852020"/><ellipse cx="0" cy="0" rx="34" ry="18" fill="%234A7A40"/><path d="M-20,-10 Q0,-35 20,-10 Q10,15 -20,-10" fill="%233A6832"/><circle cx="0" cy="-5" r="8" fill="%239E2B2B"/><circle cx="-8" cy="8" r="6" fill="%232D5526"/><circle cx="10" cy="5" r="7" fill="%232D5526"/></g><g transform="translate(390, 220)"><ellipse cx="0" cy="0" rx="42" ry="24" fill="%238E2525"/><ellipse cx="0" cy="0" rx="36" ry="20" fill="%23528848"/><circle cx="-10" cy="-6" r="10" fill="%23A83232"/><circle cx="12" cy="7" r="9" fill="%2336632E"/></g><g transform="translate(520, 310)"><path d="M0,0 Q-30,-20 -50,-10 Q-30,-30 0,0" fill="%23729F44"/><circle cx="0" cy="0" r="12" fill="%23588032"/></g></svg>',
    },
    {
      id: 'preset-soy',
      name: 'Soybean Bed (Crabgrass Infestation)',
      field: 'Field Beta (East Soybean Ridge)',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%23554737"/><line x1="0" y1="160" x2="640" y2="160" stroke="%23433626" stroke-width="32"/><line x1="0" y1="360" x2="640" y2="360" stroke="%23433626" stroke-width="32"/><g transform="translate(140, 110)"><ellipse cx="-15" cy="0" rx="22" ry="16" fill="%232D6C35"/><ellipse cx="15" cy="0" rx="22" ry="16" fill="%232D6C35"/><ellipse cx="0" cy="-18" rx="20" ry="15" fill="%23388743"/></g><g transform="translate(420, 105)"><ellipse cx="-15" cy="0" rx="24" ry="16" fill="%232D6C35"/><ellipse cx="15" cy="0" rx="24" ry="16" fill="%232D6C35"/><ellipse cx="0" cy="-20" rx="22" ry="16" fill="%23388743"/></g><g transform="translate(280, 260)"><path d="M0,0 Q-45,-25 -70,-10 Q-50,-40 -20,-60 Q5,-70 30,-50 Q60,-35 75,-10 Q40,-25 0,0" fill="%23729F44" stroke="%23577D30" stroke-width="2"/><path d="M0,0 Q-30,25 -55,40 Q-20,35 10,45 Q40,35 60,20 Q20,15 0,0" fill="%2367913D"/><circle cx="0" cy="0" r="14" fill="%23486E27"/></g><g transform="translate(470, 270)"><circle cx="0" cy="0" r="18" fill="%234B7354"/><ellipse cx="0" cy="-15" rx="8" ry="12" fill="%23A7C5AF" opacity="0.8"/></g></svg>',
    },
    {
      id: 'preset-sedge',
      name: 'Wetland Furrow (Yellow Nutsedge)',
      field: 'Field Delta (West River Valley)',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%233A3022"/><g transform="translate(310, 240)"><path d="M0,40 L-20,-70 L-35,-110 L-20,-60 L0,40" fill="%2384A936"/><path d="M0,40 L20,-70 L35,-110 L20,-60 L0,40" fill="%2384A936"/><path d="M0,40 L-5,-90 L-8,-140 L0,-80 L0,40" fill="%239ABF42"/><path d="M0,40 L8,-90 L12,-135 L0,-80 L0,40" fill="%239ABF42"/><g transform="translate(0, -125)"><line x1="0" y1="0" x2="-25" y2="-25" stroke="%23D4AF37" stroke-width="3"/><line x1="0" y1="0" x2="25" y2="-25" stroke="%23D4AF37" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-35" stroke="%23D4AF37" stroke-width="3"/><circle cx="-25" cy="-25" r="4" fill="%23C29828"/><circle cx="25" cy="-25" r="4" fill="%23C29828"/><circle cx="0" cy="-35" r="5" fill="%23C29828"/></g></g><g transform="translate(160, 280)"><circle cx="0" cy="0" r="22" fill="%2356873A"/></g></svg>',
    },
  ];

  const [currentImage, setCurrentImage] = useState<string>(presets[0].url);
  const [currentFieldName, setCurrentFieldName] = useState<string>(presets[0].field);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_a');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCurrentImage(reader.result);
        setCurrentFieldName(file.name.replace(/\.[^/.]+$/, ''));
        setDetectionResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const runDetection = async () => {
    setIsProcessing(true);
    try {
      const result = await detectWeeds({
        image: currentImage,
        fieldId: selectedFieldId,
        fieldName: currentFieldName,
      });
      setDetectionResult(result);
      if (onDetectionCompleted) onDetectionCompleted();
    } catch (err: any) {
      alert(`Detection failed: ${err.message || 'Check server connection'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Computer Vision Weed Detector
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Precision Weed Detection Studio</h2>
          <p className="mt-1.5 text-stone-300 text-xs sm:text-sm max-w-2xl">
            Upload drone, tractor, or smartphone field imagery. Detect weeds with precise bounding boxes, evaluate weed density indices, and generate targeted agronomic remedies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={runDetection}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Field...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Weed Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Test with sample agricultural field presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setCurrentImage(preset.url);
                setCurrentFieldName(preset.field);
                setDetectionResult(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                currentImage === preset.url
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-stone-50 border-stone-200 hover:bg-white'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-12 h-12 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-200"
              />
              <div className="overflow-hidden">
                <h4 className="font-semibold text-xs text-stone-900 truncate">{preset.name}</h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">{preset.field}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detection Workspace: Image Canvas + Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visualizer Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-stone-800">{currentFieldName}</span>
                <span className="text-stone-400 text-xs">• 640 × 480 px</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-3 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                    showBoxes ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white text-stone-600 border-stone-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showBoxes ? 'Bounding Boxes Visible' : 'Boxes Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Canvas / Image Display with Bounding Boxes */}
            <div className="relative aspect-4/3 bg-stone-950 overflow-hidden flex items-center justify-center">
              <img
                src={currentImage}
                alt="Field for weed detection"
                className="w-full h-full object-contain"
              />

              {/* Bounding box overlays */}
              {showBoxes &&
                detectionResult?.detections.map((box) => {
                  const [x1, y1, x2, y2] = box.bbox;
                  const left = `${(x1 / 640) * 100}%`;
                  const top = `${(y1 / 480) * 100}%`;
                  const width = `${((x2 - x1) / 640) * 100}%`;
                  const height = `${((y2 - y1) / 480) * 100}%`;
                  const isHovered = hoveredBoxId === box.id;

                  const colorMap: Record<WeedSpecies, { border: string; bg: string; text: string }> = {
                    pigweed: { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)', text: '#FEE2E2' },
                    crabgrass: { border: '#EAB308', bg: 'rgba(234, 179, 8, 0.2)', text: '#FEF9C3' },
                    lambsquarters: { border: '#10B981', bg: 'rgba(16, 185, 129, 0.2)', text: '#D1FAE5' },
                    nutsedge: { border: '#F97316', bg: 'rgba(249, 115, 22, 0.2)', text: '#FFEDD5' },
                    foxtail: { border: '#84CC16', bg: 'rgba(132, 204, 22, 0.2)', text: '#ECFCCB' },
                    dandelion: { border: '#38BDF8', bg: 'rgba(56, 189, 248, 0.2)', text: '#E0F2FE' },
                    bindweed: { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.2)', text: '#FCE7F3' },
                    barnyardgrass: { border: '#4D7C0F', bg: 'rgba(77, 124, 15, 0.2)', text: '#ECFCCB' },
                  };

                  const theme = colorMap[box.speciesId] || {
                    border: '#10B981',
                    bg: 'rgba(16, 185, 129, 0.2)',
                    text: '#D1FAE5',
                  };

                  return (
                    <div
                      key={box.id}
                      onMouseEnter={() => setHoveredBoxId(box.id)}
                      onMouseLeave={() => setHoveredBoxId(null)}
                      style={{
                        position: 'absolute',
                        left,
                        top,
                        width,
                        height,
                        border: `2px solid ${theme.border}`,
                        backgroundColor: isHovered ? theme.bg : 'transparent',
                        boxShadow: isHovered ? `0 0 12px ${theme.border}` : 'none',
                      }}
                      className="cursor-pointer transition-all rounded-xs group"
                    >
                      <div
                        style={{ backgroundColor: theme.border }}
                        className="absolute -top-6 left-0 px-2 py-0.5 rounded-xs text-[10px] font-bold text-white whitespace-nowrap shadow-xs flex items-center gap-1"
                      >
                        <span>{box.commonName}</span>
                        <span className="opacity-90">{(box.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <div className="w-10 h-10 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mb-3" />
                  <span className="font-semibold text-sm">Analyzing weed species & density...</span>
                  <span className="text-xs text-stone-300 mt-1">Identifying pigweed, crabgrass, and sedges</span>
                </div>
              )}
            </div>

            {/* Quick helper footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
              <span>Hover over bounding boxes to inspect weed classification & confidence.</span>
              {detectionResult && (
                <span className="font-mono text-emerald-800 font-semibold">
                  Latency: {detectionResult.processingTimeMs} ms • {detectionResult.modelUsed}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Results & Remedies Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {detectionResult ? (
            <>
              {/* Metrics Summary Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-bold text-stone-900 text-base">Scan Analysis Metrics</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      detectionResult.densityLevel === 'Severe'
                        ? 'bg-rose-100 text-rose-800'
                        : detectionResult.densityLevel === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {detectionResult.densityLevel} Pressure
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xs text-stone-500 block">Total Weeds</span>
                    <span className="text-2xl font-bold text-stone-900">{detectionResult.totalWeeds}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-medium block">Weed Density</span>
                    <span className="text-2xl font-bold text-emerald-900">
                      {detectionResult.weedDensityPercentage}%
                    </span>
                  </div>
                </div>

                {/* Species distribution */}
                <div>
                  <span className="text-xs font-semibold text-stone-700 block mb-2 uppercase tracking-wider">
                    Detected Weed Breakdown
                  </span>
                  <div className="space-y-1.5">
                    {detectionResult.detections.map((det) => (
                      <div
                        key={det.id}
                        onMouseEnter={() => setHoveredBoxId(det.id)}
                        onMouseLeave={() => setHoveredBoxId(null)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          hoveredBoxId === det.id
                            ? 'bg-emerald-50 border-emerald-400'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-stone-900">{det.commonName}</div>
                          <div className="text-[11px] text-stone-500 italic">{det.scientificName}</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-800">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Remedies Card */}
              {detectionResult.recommendedRemedies.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Immediate Agronomic Remedies
                  </div>

                  {detectionResult.recommendedRemedies.map((profile) => (
                    <div
                      key={profile.speciesId}
                      className="bg-white/10 rounded-xl p-3.5 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{profile.commonName}</span>
                        <span className="text-[11px] text-emerald-300 font-medium">
                          {profile.threatLevel} Threat
                        </span>
                      </div>

                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {profile.remedies[0]?.title}: {profile.remedies[0]?.description}
                      </p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">
                          Timing: {profile.remedies[0]?.timing}
                        </span>
                        <button
                          onClick={() => onNavigateToRemedies?.(profile.speciesId)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Full Remedy</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Idle Guide */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Ready for Scan</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Click "Run Weed Scan" to analyze the active image. The model will locate weed bounding boxes, calculate coverage density, and provide actionable remedies.
              </p>
              <button
                onClick={runDetection}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
              >
                Start Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
