export const getStockEntryTypeStyle = (type: 'initial' | 'addition' | 'sale' | 'death'): string => {
  switch (type) {
    case 'initial':
      return 'bg-blue-100 text-blue-800';
    case 'addition':
      return 'bg-green-100 text-green-800';
    case 'sale':
      return 'bg-yellow-100 text-yellow-800';
    case 'death':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};