import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

if (import.meta.env.DEV) {
  const required = [
    'VITE_APPWRITE_ENDPOINT',
    'VITE_APPWRITE_PROJECT_ID',
    'VITE_APPWRITE_DATABASE_ID',
    'VITE_APPWRITE_COLLECTION_ID',
    'VITE_APPWRITE_BUCKET_ID',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing .env variables:', missing);
  }
}

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
