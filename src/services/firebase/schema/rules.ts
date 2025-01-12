export const FIRESTORE_RULES = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function belongsToUser(data) {
      return isAuthenticated() && data.userId == request.auth.uid;
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Farm management
    match /farms/{farmId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Stock records
    match /stock/{stockId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Sales records
    match /sales/{saleId} {
      allow read: if belongsToUser(resource.data);
      allow create: if belongsToUser(request.resource.data);
      allow update, delete: if belongsToUser(resource.data);
    }
    
    // Expenses
    match /expenses/{expenseId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Weight records
    match /weight_records/{recordId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Feed records
    match /feed_records/{recordId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Health records
    match /health_records/{recordId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Breeding cycles (pigs only)
    match /breeding_cycles/{cycleId} {
      allow read, write: if belongsToUser(resource.data);
    }
    
    // Litter records (pigs only)
    match /litter_records/{recordId} {
      allow read, write: if belongsToUser(resource.data);
    }
  }
}`;