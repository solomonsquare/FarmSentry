import { FarmCategory, FarmData } from '../types';

export class FarmFactory {
  static createInitialFarmData(category: FarmCategory): FarmData {
    const baseData = {
      stock: {
        currentBirds: 0,
        history: [],
        lastUpdated: new Date().toISOString()
      },
      expenses: {
        birds: 0,
        medicine: 0,
        feeds: 0,
        additionals: 0
      },
      sales: [],
      lastUpdated: new Date().toISOString()
    };

    if (category === 'pigs') {
      return {
        ...baseData,
        breedingCycles: [],
        weightRecords: [],
        feedConversion: [],
        stock: {
          ...baseData.stock,
          breed: null,
          birthDate: null,
          currentWeight: 0,
          purpose: null
        }
      };
    }

    return baseData;
  }
}