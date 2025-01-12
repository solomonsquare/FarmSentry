import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Expense } from '../../../types';
import { COLLECTIONS } from '../schema/collections';
import { cleanObject } from '../../../utils/data';

export async function getExpenses(farmId: string): Promise<Expense | null> {
  try {
    const expensesRef = doc(db, COLLECTIONS.EXPENSES, farmId);
    const expensesDoc = await getDoc(expensesRef);
    
    if (!expensesDoc.exists()) {
      return null;
    }
    
    return expensesDoc.data() as Expense;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function updateExpenses(
  farmId: string,
  expenses: Expense
): Promise<boolean> {
  try {
    const expensesRef = doc(db, COLLECTIONS.EXPENSES, farmId);
    await updateDoc(expensesRef, {
      ...cleanObject(expenses),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating expenses:', error);
    throw error;
  }
}