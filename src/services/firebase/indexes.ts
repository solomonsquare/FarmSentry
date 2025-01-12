export const REQUIRED_INDEXES = [
  {
    collectionGroup: 'sales',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  }
];