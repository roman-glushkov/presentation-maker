import { databases, DATABASE_ID, COLLECTION_ID, ID, DatabaseDocument } from '../client';
import { Query } from 'appwrite';
import { Presentation } from '../../store/types/presentation';
import { Slide } from '../../store/types/presentation';
import validatePresentation from '../schemas/validator';

export interface SavedPresentation extends Presentation {
  id?: string;
  ownerId: string;
  ownerName: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  collaborators?: string[];
  version?: number;
}

export interface StoredPresentation extends SavedPresentation {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
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
    }

    const docId = ID.unique();
    data.createdAt = new Date().toISOString();
    const result = await databases.createDocument(DATABASE_ID, COLLECTION_ID, docId, data);
    return this.mapToStoredPresentation(result, data);
  }

  static async getUserPresentations(userId: string): Promise<StoredPresentation[]> {
    try {
      const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('ownerId', userId),
        Query.orderDesc('$updatedAt'),
      ]);

      const presentations: StoredPresentation[] = [];

      for (const doc of result.documents) {
        const docData = doc as Record<string, unknown>;

        if (!docData.ownerId || docData.ownerId !== userId) {
          continue;
        }

        const validationResult = validatePresentation(doc);

        if (!validationResult.isValid) {
          continue;
        }

        let slides: Slide[] = [];
        try {
          if (validationResult.parsedData?.slides) {
            slides = validationResult.parsedData.slides as Slide[];
          } else {
            slides =
              docData.slides && typeof docData.slides === 'string'
                ? JSON.parse(docData.slides)
                : [];
          }
        } catch {
          continue;
        }

        let selectedSlideIds: string[] = [];
        try {
          if (validationResult.parsedData?.selectedSlideIds) {
            selectedSlideIds = validationResult.parsedData.selectedSlideIds as string[];
          } else {
            selectedSlideIds =
              docData.selectedSlideIds && typeof docData.selectedSlideIds === 'string'
                ? JSON.parse(docData.selectedSlideIds)
                : [];
          }
        } catch {
          selectedSlideIds = [];
        }

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

        const presentation: StoredPresentation = {
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
        };

        presentations.push(presentation);
      }

      presentations.sort((a, b) => {
        const dateA = new Date(a.$updatedAt || a.updatedAt || 0);
        const dateB = new Date(b.$updatedAt || b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      return presentations;
    } catch {
      return [];
    }
  }

  static async getPresentation(id: string): Promise<StoredPresentation> {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const validationResult = validatePresentation(doc);

    if (!validationResult.isValid) {
      const validationError = new Error(
        `Данные презентации повреждены или имеют неверный формат.\n\n${
          validationResult.formattedError ||
          validationResult.errors?.join('\n') ||
          'Ошибка валидации данных'
        }`
      );
      validationError.name = 'ValidationError';
      throw validationError;
    }

    const docData = doc as Record<string, unknown>;

    let slides: Slide[] = [];
    let selectedSlideIds: string[] = [];

    try {
      if (docData.slides && typeof docData.slides === 'string') {
        const parsedSlides = validationResult.parsedData?.slides || [];
        slides = (parsedSlides as Slide[]) || [];
      }
    } catch {
      slides = [];
    }

    try {
      if (docData.selectedSlideIds && typeof docData.selectedSlideIds === 'string') {
        const parsedIds = validationResult.parsedData?.selectedSlideIds || [];
        selectedSlideIds = (parsedIds as string[]) || [];
      }
    } catch {
      selectedSlideIds = [];
    }

    const currentSlideId = typeof docData.currentSlideId === 'string' ? docData.currentSlideId : '';

    if (currentSlideId && slides.length > 0) {
      const slideExists = slides.some((slide) => slide.id === currentSlideId);
      if (!slideExists) {
        // currentSlideId не найден среди слайдов
      }
    }

    const result: StoredPresentation = {
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
    };

    return result;
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
            ? data.slides
            : [];
    } catch {
      slides = [];
    }

    try {
      selectedSlideIds =
        typeof data.selectedSlideIds === 'string'
          ? JSON.parse(data.selectedSlideIds)
          : Array.isArray(data.selectedSlideIds)
            ? data.selectedSlideIds
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

  static async deletePresentation(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
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
}
