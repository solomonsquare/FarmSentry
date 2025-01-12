export interface WeightRecord {
  id: string;
  batchId: string;
  date: string;
  sampleSize: number;
  weights: {
    total: number;
    average: number;
    target: number;
    below: number;
    above: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PoultryBatch {
  id: string;
  startDate: string;
  initialQuantity: number;
  currentQuantity: number;
  breed?: string;
  weightRecords: WeightRecord[];
}