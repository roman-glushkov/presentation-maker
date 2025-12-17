import { databases, DATABASE_ID, COLLECTION_ID, ID, DatabaseDocument } from '../client';
import { Query } from 'appwrite';
import { Presentation, Slide } from '../../store/types/presentation';
import validatePresentation from '../schemas/validator';

export interface SavedPresentation extends Presentation {
  id?: string;
  ownerId: string;
  ownerName: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
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
    const data = {
      title: presentation.title || 'Без названия',
      slides: JSON.stringify(presentation.slides || []),
      currentSlideId: presentation.currentSlideId || '',
      selectedSlideIds: JSON.stringify(presentation.selectedSlideIds || []),
      ownerId: userId,
      ownerName: userName,
      updatedAt: new Date().toISOString(),
    };

    const doc = presentationId
      ? await databases.updateDocument(DATABASE_ID, COLLECTION_ID, presentationId, data)
      : await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
          ...data,
          createdAt: new Date().toISOString(),
        });

    return this.mapToStoredPresentation(doc, data);
  }

  static async getUserPresentations(userId: string): Promise<StoredPresentation[]> {
    const { documents } = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('ownerId', userId),
      Query.orderDesc('$updatedAt'),
    ]);

    const presentations: StoredPresentation[] = [];

    for (const doc of documents) {
      const docData = doc as Record<string, unknown>;
      if (docData.ownerId !== userId) continue;

      const validationResult = validatePresentation(doc);

      if (!validationResult.isValid) {
        console.warn(`⚠️ Документ ${doc.$id} не прошел валидацию:`, {
          title: docData.title || 'Без названия',
          errors: validationResult.errors,
          formattedError: validationResult.formattedError,
        });

        console.log('Полные ошибки валидации:', validationResult.errors?.join('\n'));

        continue;
      }

      const slides = validationResult.parsedData?.slides as Slide[];
      const selectedSlideIds = (validationResult.parsedData?.selectedSlideIds as string[]) || [];

      let currentSlideId = (docData.currentSlideId as string) || '';
      if (!slides.some((s) => s.id === currentSlideId) && slides.length) {
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
        title: (docData.title as string) || 'Без названия',
        slides,
        currentSlideId,
        selectedSlideIds,
        ownerId: docData.ownerId as string,
        ownerName: docData.ownerName as string,
        createdAt: docData.createdAt as string,
        updatedAt: docData.updatedAt as string,
      });
    }

    return presentations.sort(
      (a, b) => new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime()
    );
  }

  static async getPresentation(id: string): Promise<StoredPresentation> {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const validationResult = validatePresentation(doc);

    if (!validationResult.isValid) {
      throw new Error(
        validationResult.formattedError ||
          validationResult.errors?.join('\n') ||
          'Ошибка валидации данных'
      );
    }

    const docData = doc as Record<string, unknown>;

    const slides = validationResult.parsedData?.slides as Slide[];
    const selectedSlideIds = (validationResult.parsedData?.selectedSlideIds as string[]) || [];

    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      id: doc.$id,
      title: (docData.title as string) || 'Без названия',
      slides,
      currentSlideId: (docData.currentSlideId as string) || '',
      selectedSlideIds,
      ownerId: docData.ownerId as string,
      ownerName: docData.ownerName as string,
      createdAt: docData.createdAt as string,
      updatedAt: docData.updatedAt as string,
    };
  }

  private static mapToStoredPresentation(
    doc: DatabaseDocument,
    data: Record<string, unknown>
  ): StoredPresentation {
    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      id: doc.$id,
      title: data.title as string,
      slides: JSON.parse(data.slides as string),
      currentSlideId: (data.currentSlideId as string) || '',
      selectedSlideIds: JSON.parse(data.selectedSlideIds as string),
      ownerId: data.ownerId as string,
      ownerName: data.ownerName as string,
      createdAt: data.createdAt as string,
      updatedAt: data.updatedAt as string,
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
