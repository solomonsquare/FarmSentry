export function cleanObject<T>(obj: T): T {
  // Remove undefined values and clean the object
  const cleaned = JSON.parse(JSON.stringify(obj));
  
  // Remove null values
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === null) {
      delete cleaned[key];
    }
  });
  
  return cleaned;
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for custom error codes
    if ('code' in error) {
      const { code } = error as { code: string };
      switch (code) {
        case 'invalid-quantity':
          return 'Please enter a valid quantity';
        case 'invalid-price':
          return 'Please enter a valid price';
        case 'insufficient-stock':
          return 'Not enough stock available';
        case 'invalid-datetime':
          return 'Invalid date or time';
        default:
          return error.message;
      }
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}