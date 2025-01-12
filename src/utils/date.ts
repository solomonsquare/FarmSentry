export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date: Date | string = new Date()): { date: string; time: string } => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    date: formatDate(dateObj),
    time: formatTime(dateObj)
  };
};