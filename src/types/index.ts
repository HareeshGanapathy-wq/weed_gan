/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WeedSpecies = 
  | 'pigweed' 
  | 'crabgrass' 
  | 'lambsquarters' 
  | 'nutsedge' 
  | 'foxtail' 
  | 'dandelion' 
  | 'bindweed' 
  | 'barnyardgrass';

export interface DetectionBox {
  id: string;
  class: string;
  speciesId: WeedSpecies;
  commonName: string;
  scientificName: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in pixels
  relativeBbox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 or 0-1
  severity: 'low' | 'medium' | 'high';
}

export interface RemedyDetail {
  category: 'organic' | 'chemical' | 'cultural' | 'preventive';
  title: string;
  description: string;
  instructions: string[];
  timing: string;
  efficacy: number; // 0 - 100%
  safetyNote?: string;
  activeIngredients?: string;
  dosage?: string;
}

export interface WeedRemedyProfile {
  speciesId: WeedSpecies;
  commonName: string;
  scientificName: string;
  family: string;
  lifecycle: 'Annual' | 'Perennial' | 'Biennial';
  weedType: 'Broadleaf' | 'Grassy' | 'Sedge';
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  typicalCropsAffected: string[];
  germinationConditions: string;
  identificationTips: string[];
  remedies: RemedyDetail[];
  bestSprayWindow: string;
  environmentalCaution: string;
}

export interface DetectionResult {
  id: string;
  timestamp: string;
  fieldId: string;
  fieldName: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  totalWeeds: number;
  weedDensityPercentage: number;
  densityLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  averageConfidence: number;
  processingTimeMs: number;
  modelUsed: string;
  detections: DetectionBox[];
  speciesBreakdown: { [key in WeedSpecies]?: number };
  recommendedRemedies: WeedRemedyProfile[];
  notes?: string;
}

export interface TrainingImageAnnotation {
  id: string;
  class: string;
  speciesId: WeedSpecies;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Mature';
}

export interface TrainingImageRecord {
  id: string;
  title: string;
  speciesId: WeedSpecies;
  speciesName: string;
  imageUrl: string;
  thumbnailUrl?: string;
  imageWidth: number;
  imageHeight: number;
  split: 'train' | 'val' | 'test';
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Mature';
  soilType: 'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Peat';
  cropContext: 'Corn' | 'Soybean' | 'Wheat' | 'Cotton' | 'Fallow' | 'Vineyard';
  annotations: TrainingImageAnnotation[];
  dateAdded: string;
  verified: boolean;
  notes?: string;
}

export interface DensityPoint {
  id: string;
  lat: number;
  lng: number;
  density: number; // 0 to 100
  dominantWeed: string;
  status: 'clean' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface FieldInfo {
  id: string;
  name: string;
  crop: string;
  areaHectares: number;
  location: string;
  lastScanned: string;
  averageDensity: number;
  totalWeedsDetected: number;
  status: 'good' | 'warning' | 'alert';
}

export interface VoiceAssistantResponse {
  query: string;
  reply: string;
  action?: {
    type: 'NAVIGATE' | 'PRUNE_HISTORY' | 'FILTER_REMEDY' | 'TRIGGER_SCAN' | 'FILTER_TRAINING';
    target?: string;
    payload?: any;
  };
  suggestedPrompts: string[];
}
