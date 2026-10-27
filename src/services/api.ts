/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DetectionResult,
  WeedRemedyProfile,
  TrainingImageRecord,
  FieldInfo,
  VoiceAssistantResponse,
  WeedSpecies,
} from '../types/index.ts';

const API_BASE = '/api';

export async function detectWeeds(params: {
  image: string;
  fieldId?: string;
  fieldName?: string;
}): Promise<DetectionResult> {
  const res = await fetch(`${API_BASE}/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to detect weeds');
  }
  return res.json();
}

export async function getHistory(params?: {
  limit?: number;
  species?: string;
  search?: string;
  fieldId?: string;
}): Promise<{ totalCount: number; returnedCount: number; history: DetectionResult[] }> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.species) query.set('species', params.species);
  if (params?.search) query.set('search', params.search);
  if (params?.fieldId) query.set('fieldId', params.fieldId);

  const res = await fetch(`${API_BASE}/history?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch detection history');
  return res.json();
}

export async function deleteHistoryItem(id: string): Promise<{ success: boolean; remainingCount: number }> {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete history record');
  return res.json();
}

export async function pruneHistory(keepCount: number = 3): Promise<{
  success: boolean;
  message: string;
  removedCount: number;
  remainingCount: number;
  history: DetectionResult[];
}> {
  const res = await fetch(`${API_BASE}/history/prune`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keepCount }),
  });
  if (!res.ok) throw new Error('Failed to prune detection history');
  return res.json();
}

export async function clearAllHistory(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/history/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to clear detection history');
  return res.json();
}

export async function getRemedies(params?: {
  species?: string;
  category?: string;
  search?: string;
}): Promise<{ total: number; remedies: WeedRemedyProfile[] }> {
  const query = new URLSearchParams();
  if (params?.species) query.set('species', params.species);
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/remedies?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch weed remedies');
  return res.json();
}

export async function getRemedyBySpecies(species: WeedSpecies): Promise<WeedRemedyProfile> {
  const res = await fetch(`${API_BASE}/remedies/${species}`);
  if (!res.ok) throw new Error(`Failed to fetch remedy profile for ${species}`);
  return res.json();
}

export async function getTrainingImages(params?: {
  species?: string;
  split?: string;
  stage?: string;
  search?: string;
}): Promise<{ total: number; images: TrainingImageRecord[] }> {
  const query = new URLSearchParams();
  if (params?.species) query.set('species', params.species);
  if (params?.split) query.set('split', params.split);
  if (params?.stage) query.set('stage', params.stage);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/training/images?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch training images');
  return res.json();
}

export async function getTrainingStats(): Promise<{
  totalImages: number;
  totalAnnotations: number;
  splitDistribution: { train: number; val: number; test: number };
  speciesDistribution: Record<string, number>;
}> {
  const res = await fetch(`${API_BASE}/training/stats`);
  if (!res.ok) throw new Error('Failed to fetch training stats');
  return res.json();
}

export async function addTrainingImage(data: Partial<TrainingImageRecord>): Promise<TrainingImageRecord> {
  const res = await fetch(`${API_BASE}/training/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save training image');
  return res.json();
}

export async function deleteTrainingImage(id: string): Promise<{ success: boolean; remainingCount: number }> {
  const res = await fetch(`${API_BASE}/training/images/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete training image');
  return res.json();
}

export async function exportTrainingDataset(format: 'coco' | 'yolo' = 'coco'): Promise<any> {
  const res = await fetch(`${API_BASE}/training/export?format=${format}`);
  if (!res.ok) throw new Error('Failed to export dataset');
  return res.json();
}

export async function askVoiceAssistant(query: string, currentTab?: string): Promise<VoiceAssistantResponse> {
  const res = await fetch(`${API_BASE}/voice/assist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, currentTab }),
  });
  if (!res.ok) throw new Error('Voice assistant request failed');
  return res.json();
}

export async function getFields(): Promise<FieldInfo[]> {
  const res = await fetch(`${API_BASE}/fields`);
  if (!res.ok) throw new Error('Failed to fetch fields');
  return res.json();
}

export async function getDensity(fieldId: string) {
  const res = await fetch(`${API_BASE}/density/${fieldId}`);
  if (!res.ok) throw new Error('Failed to fetch density map');
  return res.json();
}

export async function getAnalysis(fieldId: string) {
  const res = await fetch(`${API_BASE}/analysis/${fieldId}`);
  if (!res.ok) throw new Error('Failed to fetch field analysis');
  return res.json();
}
