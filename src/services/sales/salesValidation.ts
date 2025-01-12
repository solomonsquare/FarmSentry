import { Sale, Stock } from '../../types';

interface ValidationError extends Error {
  code: string;
}

export class SaleValidationError extends Error implements ValidationError {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'SaleValidationError';
  }
}

export function validateSale(sale: Sale, stock: Stock): boolean {
  if (!sale.quantity || sale.quantity <= 0) {
    throw new SaleValidationError('Invalid sale quantity', 'invalid-quantity');
  }

  if (!sale.pricePerBird || sale.pricePerBird <= 0) {
    throw new SaleValidationError('Invalid price per unit', 'invalid-price');
  }

  if (sale.quantity > stock.currentBirds) {
    throw new SaleValidationError(
      'Sale quantity exceeds current stock',
      'insufficient-stock'
    );
  }

  if (!sale.date || !sale.time) {
    throw new SaleValidationError(
      'Invalid sale date/time',
      'invalid-datetime'
    );
  }

  return true;
}