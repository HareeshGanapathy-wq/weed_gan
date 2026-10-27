/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Download,
  Filter,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  Tag,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  X,
  FileJson,
} from 'lucide-react';
import {
  getTrainingImages,
  getTrainingStats,
  addTrainingImage,
  deleteTrainingImage,
  exportTrainingDataset,
} from '../services/api.ts';
import { TrainingImageRecord, WeedSpecies } from '../types/index.ts';

interface TrainingDatabaseViewProps {
  onOpenVoiceWithQuery?: (query: string) => void;
}

export const TrainingDatabaseView: React.FC<TrainingDatabaseViewProps> = ({
  onOpenVoiceWithQuery,
}) => {
  const [images, setImages] = useState<TrainingImageRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedSplit, setSelectedSplit] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Inspector Modal
  const [inspectedImage, setInspectedImage] = useState<TrainingImageRecord | null>(null);

  // Add sample modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSpecies, setNewSpecies] = useState<WeedSpecies>('pigweed');
  const [newSplit, setNewSplit] = useState<'train' | 'val' | 'test'>('train');
  const [newStage, setNewStage] = useState<'Seedling' | 'Vegetative' | 'Flowering' | 'Mature'>('Vegetative');
  const [newCrop, setNewCrop] = useState('Corn');
  const [newSoil, setNewSoil] = useState('Loam');
  const [newNotes, setNewNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [imgData, statsData] = await Promise.all([
        getTrainingImages({
          species: selectedSpecies !== 'all' ? selectedSpecies : undefined,
          split: selectedSplit !== 'all' ? selectedSplit : undefined,
          stage: selectedStage !== 'all' ? selectedStage : undefined,
          search: searchQuery.trim() || undefined,
        }),
        getTrainingStats(),
      ]);
      setImages(imgData.images);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load training database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSpecies, selectedSplit, selectedStage]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this training image sample?')) return;
    try {
      await deleteTrainingImage(id);
      loadData();
    } catch (err) {
      alert('Failed to delete training image');
    }
  };

  const handleExport = async (format: 'coco' | 'yolo') => {
    try {
      const data = await exportTrainingDataset(format);
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weed_ai_dataset_${format}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export dataset');
    }
  };

  const handleAddSample = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a realistic procedural SVG training image based on species
    const speciesNames: Record<WeedSpecies, string> = {
      pigweed: 'Redroot Pigweed',
      crabgrass: 'Large Crabgrass',
      lambsquarters: 'Common Lambsquarters',
      nutsedge: 'Yellow Nutsedge',
      foxtail: 'Green Foxtail',
      dandelion: 'Common Dandelion',
      bindweed: 'Field Bindweed',
      barnyardgrass: 'Barnyardgrass',
    };

    const colors: Record<WeedSpecies, string> = {
      pigweed: '%23852020',
      crabgrass: '%23729F44',
      lambsquarters: '%23A7C5AF',
      nutsedge: '%23D4AF37',
      foxtail: '%23679E4A',
      dandelion: '%23EAB308',
      bindweed: '%23EC4899',
      barnyardgrass: '%234D7C0F',
    };

    const color = colors[newSpecies] || '%234A7A40';
    const svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%234A3E2D"/><line x1="0" y1="160" x2="640" y2="160" stroke="%233A3022" stroke-width="28"/><line x1="0" y1="340" x2="640" y2="340" stroke="%233A3022" stroke-width="28"/><g transform="translate(300, 240)"><circle cx="0" cy="0" r="45" fill="${color}" opacity="0.85"/><ellipse cx="-15" cy="-20" rx="30" ry="18" fill="%233E7535"/><ellipse cx="20" cy="15" rx="32" ry="16" fill="%232E5E27"/></g><rect x="230" y="170" width="140" height="140" fill="none" stroke="%2310B981" stroke-width="2" stroke-dasharray="4"/><text x="235" y="165" fill="%2310B981" font-size="12" font-family="sans-serif" font-weight="bold">${speciesNames[newSpecies]}: 1.00</text></svg>`;

    try {
      await addTrainingImage({
        title: newTitle || `${speciesNames[newSpecies]} (${newCrop} Context)`,
        speciesId: newSpecies,
        speciesName: speciesNames[newSpecies],
        imageUrl: svgUrl,
        split: newSplit,
        growthStage: newStage,
        soilType: newSoil as any,
        cropContext: newCrop as any,
        annotations: [
          {
            id: `ann-${Date.now()}`,
            class: newSpecies,
            speciesId: newSpecies,
            bbox: [230, 170, 370, 310],
            growthStage: newStage,
          },
        ],
        notes: newNotes || 'Ground truth training sample added for recognition dataset.',
      });

      setIsAddModalOpen(false);
      setNewTitle('');
      setNewNotes('');
      loadData();
    } catch (err) {
      alert('Failed to add sample');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Database className="w-3.5 h-3.5" /> Weed Recognition Training Database
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ground-Truth Agricultural Computer Vision Dataset
          </h2>
          <p className="mt-2 text-stone-200 text-sm leading-relaxed">
            Curated database of annotated weed images with bounding box ground-truths, lifecycle growth stages, soil contexts, and export formats (COCO & YOLO) for machine learning training.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Training Sample</span>
          </button>

          <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/15">
            <button
              onClick={() => handleExport('coco')}
              title="Export dataset in standard COCO JSON format"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>COCO</span>
            </button>
            <button
              onClick={() => handleExport('yolo')}
              title="Export dataset in YOLO normalized coordinate format"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>YOLO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Statistics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Total Images</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{stats.totalImages}</div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">High resolution samples</span>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Total Annotations</span>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{stats.totalAnnotations}</div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Bounding box labels</span>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Dataset Splits</span>
            <div className="text-xs font-semibold text-stone-800 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Train:</span>
                <span className="font-bold text-emerald-700">{stats.splitDistribution?.train || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Val / Test:</span>
                <span className="font-bold text-stone-600">
                  {stats.splitDistribution?.val || 0} / {stats.splitDistribution?.test || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Target Accuracy</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">94.8%</div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">mAP @0.5 IoU score</span>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Search training images by title, species, soil or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Species */}
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white text-stone-700 focus:outline-none"
          >
            <option value="all">All Species</option>
            <option value="pigweed">Redroot Pigweed</option>
            <option value="crabgrass">Large Crabgrass</option>
            <option value="lambsquarters">Common Lambsquarters</option>
            <option value="nutsedge">Yellow Nutsedge</option>
            <option value="foxtail">Green Foxtail</option>
            <option value="dandelion">Common Dandelion</option>
          </select>

          {/* Split */}
          <select
            value={selectedSplit}
            onChange={(e) => setSelectedSplit(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white text-stone-700 focus:outline-none"
          >
            <option value="all">All Splits</option>
            <option value="train">Train</option>
            <option value="val">Validation</option>
            <option value="test">Test</option>
          </select>

          {/* Toggle Bounding Boxes */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              showBoundingBoxes
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-300 text-stone-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showBoundingBoxes ? 'Boxes ON' : 'Boxes OFF'}</span>
          </button>

          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Loading training dataset...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <Info className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800">No training images found</h3>
          <p className="text-xs text-stone-500 mt-1">Try clearing filters or add a new training sample.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setInspectedImage(img)}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Preview */}
                <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Split Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                        img.split === 'train'
                          ? 'bg-emerald-600 text-white'
                          : img.split === 'val'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {img.split}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-xs text-white">
                      {img.growthStage}
                    </span>
                  </div>

                  {/* Action delete */}
                  <button
                    onClick={(e) => handleDelete(img.id, e)}
                    title="Delete sample"
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-stone-200 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Inspect Coordinates
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-800">{img.speciesName}</span>
                    <span className="text-stone-400 text-[11px]">{img.dateAdded}</span>
                  </div>

                  <h4 className="font-semibold text-stone-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {img.title}
                  </h4>

                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      Crop: {img.cropContext}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      Soil: {img.soilType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      {img.annotations.length} bbox
                    </span>
                  </div>
                </div>
              </div>

              {img.notes && (
                <div className="px-4 pb-3 pt-0 text-[11px] text-stone-500 italic line-clamp-1 border-t border-stone-100 mt-1 pt-2">
                  "{img.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inspect Coordinates Modal */}
      {inspectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{inspectedImage.title}</h3>
                <span className="text-xs text-stone-500 font-mono">ID: {inspectedImage.id}</span>
              </div>
              <button
                onClick={() => setInspectedImage(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border border-stone-200 bg-stone-900 aspect-4/3 relative">
              <img
                src={inspectedImage.imageUrl}
                alt={inspectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-500">
                Ground-Truth Bounding Box Annotations ({inspectedImage.annotations.length})
              </h4>
              <div className="space-y-2">
                {inspectedImage.annotations.map((ann, idx) => {
                  const [x1, y1, x2, y2] = ann.bbox;
                  const xCenter = ((x1 + x2) / 2 / inspectedImage.imageWidth).toFixed(4);
                  const yCenter = ((y1 + y2) / 2 / inspectedImage.imageHeight).toFixed(4);
                  const wNorm = ((x2 - x1) / inspectedImage.imageWidth).toFixed(4);
                  const hNorm = ((y2 - y1) / inspectedImage.imageHeight).toFixed(4);

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-emerald-800 uppercase mr-2">{ann.class}</span>
                        <span className="text-stone-600">Pixel: [{x1}, {y1}, {x2}, {y2}]</span>
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        YOLO: {xCenter} {yCenter} {wNorm} {hNorm}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-stone-700">
                <div>Split: <strong>{inspectedImage.split}</strong></div>
                <div>Stage: <strong>{inspectedImage.growthStage}</strong></div>
                <div>Soil: <strong>{inspectedImage.soilType}</strong></div>
                <div>Crop: <strong>{inspectedImage.cropContext}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Training Sample Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">Add Weed Training Sample</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSample} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Sample Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Redroot Pigweed seedling in corn furrow"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Weed Species</label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value as WeedSpecies)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white"
                  >
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

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Dataset Split</label>
                  <select
                    value={newSplit}
                    onChange={(e) => setNewSplit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium bg-white"
                  >
                    <option value="train">Train (Training)</option>
                    <option value="val">Validation</option>
                    <option value="test">Test</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Growth Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Mature">Mature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Context</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    <option value="Corn">Corn</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Fallow">Fallow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Soil Type</label>
                  <select
                    value={newSoil}
                    onChange={(e) => setNewSoil(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    <option value="Loam">Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silt">Silt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Agronomic Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Observations on morphology, lighting, soil moisture..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium"
                >
                  Save Training Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
