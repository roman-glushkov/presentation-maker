import { Client, Account, Databases, Storage, ID } from 'appwrite';
import { APPRITE_CONFIG } from './config';

const client = new Client()
  .setEndpoint(APPRITE_CONFIG.endpoint)
  .setProject(APPRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

export const DATABASE_ID = APPRITE_CONFIG.databaseId;
export const COLLECTION_ID = APPRITE_CONFIG.collectionId;
export const STORAGE_BUCKET_ID = APPRITE_CONFIG.bucketId;

export interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  registration: string;
  status: boolean;
  emailVerification: boolean;
  prefs: Record<string, unknown>;
  [key: string]: unknown;
}

export type AccountUser = {
  $id: string;
  name?: string;
  email?: string;
  registration?: string;
  status?: boolean;
  emailVerification?: boolean;
  prefs?: Record<string, unknown>;
  [key: string]: unknown;
};

export interface AppwriteError {
  code: number;
  message: string;
  type?: string;
}

export interface DatabaseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  [key: string]: unknown;
}
