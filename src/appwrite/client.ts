import { Client, Account, Databases, Storage, ID, Models } from 'appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('692ff05a000563f40376');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

export const DATABASE_ID = '69317f9100076b3b6300';
export const COLLECTION_ID = 'presentations';
export const STORAGE_BUCKET_ID = 'presentation_media';

export interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  registration: string;
  status: boolean;
  emailVerification: boolean;
  prefs: any;
}

export interface AppwriteError {
  code: number;
  message: string;
  type?: string;
}

export interface AppwriteSession {
  $id: string;
  userId: string;
  expire: string;
  provider: string;
  providerUid: string;
  providerAccessToken: string;
  providerAccessTokenExpiry: string;
  providerRefreshToken: string;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  clientEngineVersion: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
}

export interface DatabaseDocument extends Models.Document {
  [key: string]: any;
}
