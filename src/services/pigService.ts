import { Stock, Expense } from '../types';
import { PigBreed } from '../types/pig';
import { formatDateTime } from '../utils/date';
import { DatabaseService } from './database';

export class PigService {
  static async addStock(
    userId: string,
    currentStock: Stock,
    quantity: number,
    breed: PigBreed,
    birthDate: string,
    currentWeight: number,
    purpose: 'breeding' | 'meat' | 'both',
    expenses: Expense
  ): Promise<Stock> {
    try {
      const { date, time } = formatDateTime();
      const newStock = currentStock.currentBirds + quantity;
      
      const newEntry = {
        id: Date.now().toString(),
        date,
        time,
        type: currentStock.history.length === 0 ? 'initial' : 'addition',
        quantity,
        remainingStock: newStock,
        description: `Added ${quantity} ${breed.name} pigs`,
        breed,
        birthDate,
        currentWeight,
        purpose,
        expenses
      };

      const updatedStock = {
        currentBirds: newStock,
        history: [...currentStock.history, newEntry],
        lastUpdated: date,
        breed,
        birthDate,
        currentWeight,
        purpose
      };

      // Update database
      await DatabaseService.updateFarmData(userId, 'pigs', {
        stock: updatedStock,
        expenses: {
          birds: expenses.birds,
          medicine: expenses.medicine,
          feeds: expenses.feeds,
          additionals: expenses.additionals
        }
      });

      return updatedStock;
    } catch (error) {
      console.error('Error adding stock:', error);
      throw new Error('Failed to add stock');
    }
  }

  static async recordDeaths(
    userId: string,
    currentStock: Stock,
    deathCount: number
  ): Promise<Stock> {
    try {
      const { date, time } = formatDateTime();
      const newStock = currentStock.currentBirds - deathCount;
      
      const newEntry = {
        id: Date.now().toString(),
        date,
        time,
        type: 'death',
        quantity: deathCount,
        remainingStock: newStock,
        description: `Recorded ${deathCount} pig deaths`
      };

      const updatedStock = {
        ...currentStock,
        currentBirds: newStock,
        history: [...currentStock.history, newEntry],
        lastUpdated: date
      };

      // Update database
      await DatabaseService.updateFarmData(userId, 'pigs', {
        stock: updatedStock
      });

      return updatedStock;
    } catch (error) {
      console.error('Error recording deaths:', error);
      throw new Error('Failed to record deaths');
    }
  }
}