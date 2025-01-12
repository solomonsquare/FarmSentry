export function RecordDeaths({ stock, onUpdate }: Props) {
  const handleRecordDeaths = () => {
    if (deathCount <= 0 || deathCount > stock.currentBirds) return;

    const { date, time } = formatDateTime();
    const newStock = stock.currentBirds - deathCount;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date,
      time,
      type: 'death',
      quantity: deathCount,
      remainingStock: newStock,
      description: `Recorded ${deathCount} bird deaths`,
      expenses: {
        birds: 0,
        medicine: 0,
        feeds: 0,
        additionals: 0
      }
    };

    // ... rest of the function ...
  };

  // ... rest of the component ...
} 