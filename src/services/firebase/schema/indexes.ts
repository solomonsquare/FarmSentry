export const REQUIRED_INDEXES = [
  {
    collection: 'sales',
    fields: [
      { name: 'userId', type: 'ASC' },
      { name: 'farmId', type: 'ASC' },
      { name: 'createdAt', type: 'DESC' }
    ]
  },
  {
    collection: 'expenses',
    fields: [
      { name: 'userId', type: 'ASC' },
      { name: 'farmId', type: 'ASC' },
      { name: 'category', type: 'ASC' },
      { name: 'date', type: 'DESC' }
    ]
  },
  {
    collection: 'stock',
    fields: [
      { name: 'userId', type: 'ASC' },
      { name: 'farmId', type: 'ASC' },
      { name: 'status', type: 'ASC' }
    ]
  },
  {
    collection: 'weight_records',
    fields: [
      { name: 'farmId', type: 'ASC' },
      { name: 'date', type: 'DESC' }
    ]
  },
  {
    collection: 'breeding',
    fields: [
      { name: 'farmId', type: 'ASC' },
      { name: 'status', type: 'ASC' },
      { name: 'startDate', type: 'DESC' }
    ]
  }
];