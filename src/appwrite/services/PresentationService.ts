// C:\PGTU\FRONT-end\presentation maker\src\appwrite\PresentationService.ts
import { databases, DATABASE_ID, COLLECTION_ID, ID, DatabaseDocument } from '../client';
import { Query } from 'appwrite';
import validatePresentation from '../schemas/validator';
import { Presentation, Slide } from '../../store/types/presentation';

export interface StoredPresentation {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  id?: string;
  title: string;
  slides: Slide[];
  currentSlideId: string;
  selectedSlideIds: string[];
  ownerId: string;
  ownerName: string;
  updatedAt?: string;
  createdAt?: string;
}

export class PresentationService {
  static async savePresentation(
    presentation: Presentation,
    userId: string,
    userName: string,
    presentationId?: string
  ): Promise<StoredPresentation> {
    const slidesJson = JSON.stringify(presentation.slides || []);
    const selectedSlideIdsJson = JSON.stringify(presentation.selectedSlideIds || []);

    const data: Record<string, unknown> = {
      title: presentation.title || 'Без названия',
      slides: slidesJson,
      currentSlideId: presentation.currentSlideId || '',
      selectedSlideIds: selectedSlideIdsJson,
      ownerId: userId,
      ownerName: userName,
      updatedAt: new Date().toISOString(),
    };

    if (presentationId) {
      const result = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        presentationId,
        data
      );
      return this.mapToStoredPresentation(result, data);
    } else {
      const docId = ID.unique();
      const dataWithCreatedAt = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        docId,
        dataWithCreatedAt
      );
      return this.mapToStoredPresentation(result, dataWithCreatedAt);
    }
  }

  static async getUserPresentations(userId: string): Promise<StoredPresentation[]> {
    try {
      const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('ownerId', userId),
        Query.orderDesc('$updatedAt'),
      ]);

      const presentations: StoredPresentation[] = [];

      for (const doc of result.documents) {
        const validationResult = validatePresentation(doc);
        if (!validationResult.isValid) continue;

        let slides: Slide[] = [];
        let selectedSlideIds: string[] = [];

        if (validationResult.parsedData?.slides) {
          slides = validationResult.parsedData.slides as Slide[];
        }

        if (validationResult.parsedData?.selectedSlideIds) {
          selectedSlideIds = validationResult.parsedData.selectedSlideIds as string[];
        }

        const docData = doc as Record<string, unknown>;
        let currentSlideId =
          typeof docData.currentSlideId === 'string' ? docData.currentSlideId : '';

        if (currentSlideId && slides.length > 0) {
          const slideExists = slides.some((slide) => slide.id === currentSlideId);
          if (!slideExists && slides.length > 0) {
            currentSlideId = slides[0].id;
          }
        } else if (slides.length > 0 && !currentSlideId) {
          currentSlideId = slides[0].id;
        }

        presentations.push({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
          $permissions: doc.$permissions,
          $collectionId: doc.$collectionId,
          $databaseId: doc.$databaseId,
          id: doc.$id,
          title: typeof docData.title === 'string' ? docData.title : 'Без названия',
          slides: slides,
          currentSlideId: currentSlideId,
          selectedSlideIds: selectedSlideIds,
          ownerId: typeof docData.ownerId === 'string' ? docData.ownerId : '',
          ownerName: typeof docData.ownerName === 'string' ? docData.ownerName : '',
          updatedAt: typeof docData.updatedAt === 'string' ? docData.updatedAt : '',
          createdAt: typeof docData.createdAt === 'string' ? docData.createdAt : '',
        });
      }

      return presentations.sort((a, b) => {
        const dateA = new Date(a.$updatedAt || a.updatedAt || 0);
        const dateB = new Date(b.$updatedAt || b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch {
      return [];
    }
  }

  static async getPresentation(id: string): Promise<StoredPresentation> {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const validationResult = validatePresentation(doc);

    if (!validationResult.isValid) {
      throw new Error('Данные презентации повреждены или имеют неверный формат');
    }

    const docData = doc as Record<string, unknown>;
    const slides = (validationResult.parsedData?.slides as Slide[]) || [];
    const selectedSlideIds = (validationResult.parsedData?.selectedSlideIds as string[]) || [];
    const currentSlideId = typeof docData.currentSlideId === 'string' ? docData.currentSlideId : '';

    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      id: doc.$id,
      title: typeof docData.title === 'string' ? docData.title : 'Без названия',
      slides: slides,
      currentSlideId: currentSlideId,
      selectedSlideIds: selectedSlideIds,
      ownerId: typeof docData.ownerId === 'string' ? docData.ownerId : '',
      ownerName: typeof docData.ownerName === 'string' ? docData.ownerName : '',
    };
  }

  private static mapToStoredPresentation(
    doc: DatabaseDocument,
    data: Record<string, unknown>
  ): StoredPresentation {
    let slides: Slide[] = [];
    let selectedSlideIds: string[] = [];

    try {
      slides =
        typeof data.slides === 'string'
          ? JSON.parse(data.slides)
          : Array.isArray(data.slides)
            ? (data.slides as Slide[])
            : [];
    } catch {
      slides = [];
    }

    try {
      selectedSlideIds =
        typeof data.selectedSlideIds === 'string'
          ? JSON.parse(data.selectedSlideIds)
          : Array.isArray(data.selectedSlideIds)
            ? (data.selectedSlideIds as string[])
            : [];
    } catch {
      selectedSlideIds = [];
    }

    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      id: doc.$id,
      title: typeof data.title === 'string' ? data.title : 'Без названия',
      slides: slides,
      currentSlideId: typeof data.currentSlideId === 'string' ? data.currentSlideId : '',
      selectedSlideIds: selectedSlideIds,
      ownerId: typeof data.ownerId === 'string' ? data.ownerId : '',
      ownerName: typeof data.ownerName === 'string' ? data.ownerName : '',
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
    };
  }

  static createEmptyPresentation(title = 'Новая презентация'): Presentation {
    const slideId = `slide-${Date.now()}`;
    return {
      title,
      slides: [
        {
          id: slideId,
          background: { type: 'color', value: '#ffffff' },
          elements: [],
        },
      ],
      currentSlideId: slideId,
      selectedSlideIds: [slideId],
    };
  }

  static async deletePresentation(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
  }
}
