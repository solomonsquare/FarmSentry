import { COLLECTIONS } from './collections';
import { DB_SCHEMA } from './schema';
import { REQUIRED_INDEXES } from './indexes';
import { FIRESTORE_RULES } from './rules';
import { initializeDatabase } from './init';
import { validateSchema } from './validate';
import { migrateToNewSchema } from './migrations';

export {
  COLLECTIONS,
  DB_SCHEMA,
  REQUIRED_INDEXES,
  FIRESTORE_RULES,
  initializeDatabase,
  validateSchema,
  migrateToNewSchema
};