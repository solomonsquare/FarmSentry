export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

export const calculatePerBirdCost = (total: number, birds: number): number => {
  return birds > 0 ? total / birds : 0;
};