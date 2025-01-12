export const DB_SCHEMA = {
  version: '1.0',
  collections: {
    farms: {
      fields: {
        userId: 'string',
        category: 'string',
        stock: {
          currentBirds: 'number',
          history: 'array',
          lastUpdated: 'string'
        },
        expenses: {
          birds: 'number',
          medicine: 'number',
          feeds: 'number',
          additionals: 'number'
        },
        lastUpdated: 'string'
      }
    },
    sales: {
      fields: {
        userId: 'string',
        category: 'string',
        quantity: 'number',
        pricePerBird: 'number',
        profitPerBird: 'number',
        totalProfit: 'number',
        date: 'string',
        time: 'string',
        createdAt: 'timestamp'
      },
      indexes: [
        { fields: ['userId', 'category', 'createdAt'] }
      ]
    }
  }
};