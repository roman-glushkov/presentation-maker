import { databases, DATABASE_ID, COLLECTION_ID, ID, DatabaseDocument } from './client';
import { Query } from 'appwrite';
import { Presentation } from '../store/types/presentation';
import { Slide } from '../store/types/presentation';
import validatePresentation from './schemas/validator';

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
    try {
      console.log('=== СОХРАНЕНИЕ ПРЕЗЕНТАЦИИ ===');
      console.log('User ID:', userId);
      console.log('User Name:', userName);
      console.log('Presentation ID:', presentationId || 'НОВАЯ');
      console.log('Title:', presentation.title);
      console.log('Slides count:', presentation.slides?.length || 0);

      const slidesJson = JSON.stringify(presentation.slides || []);
      const selectedSlideIdsJson = JSON.stringify(presentation.selectedSlideIds || []);

      console.log('Размер данных:', {
        slidesLength: slidesJson.length,
        selectedSlideIdsLength: selectedSlideIdsJson.length,
        total: slidesJson.length + selectedSlideIdsJson.length,
      });

      const data: Record<string, unknown> = {
        title: presentation.title || 'Без названия',
        slides: slidesJson,
        currentSlideId: presentation.currentSlideId || '',
        selectedSlideIds: selectedSlideIdsJson,
        ownerId: userId,
        ownerName: userName,
        updatedAt: new Date().toISOString(),
      };

      console.log('Данные для сохранения:', {
        title: data.title,
        ownerId: data.ownerId,
        ownerName: data.ownerName,
      });

      if (presentationId) {
        console.log('🔄 Обновляем существующую презентацию:', presentationId);
        const result = await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          presentationId,
          data
        );

        console.log('✅ Презентация обновлена:', result.$id);
        return this.mapToStoredPresentation(result, data);
      } else {
        const docId = ID.unique();
        console.log('🆕 Создаем новую презентацию с ID:', docId);

        data.createdAt = new Date().toISOString();

        const result = await databases.createDocument(DATABASE_ID, COLLECTION_ID, docId, data);

        console.log('✅ Новая презентация создана:', result.$id);
        return this.mapToStoredPresentation(result, data);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ Ошибка сохранения презентации:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
      throw error;
    }
  }

  static async getUserPresentations(userId: string): Promise<StoredPresentation[]> {
    try {
      console.log('🔍 Ищем презентации пользователя:', userId);

      const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('ownerId', userId),
        Query.orderDesc('$updatedAt'),
      ]);

      console.log(`✅ Найдено документов пользователя: ${result.documents.length}`);

      const presentations: StoredPresentation[] = [];

      for (const doc of result.documents) {
        const docData = doc as Record<string, unknown>;

        if (!docData.ownerId || docData.ownerId !== userId) {
          console.warn(`⚠️ Пропускаем документ ${doc.$id}: не совпадает ownerId`);
          continue;
        }

        console.log(`📋 Документ ${doc.$id}:`, {
          title: docData.title,
          slides: docData.slides,
          slidesType: typeof docData.slides,
          slidesIsArray: Array.isArray(docData.slides),
          selectedSlideIds: docData.selectedSlideIds,
          selectedSlideIdsType: typeof docData.selectedSlideIds,
          selectedSlideIdsIsArray: Array.isArray(docData.selectedSlideIds),
        });
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
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown parsing error';
          console.error(`Ошибка парсинга slides для документа ${doc.$id}:`, errorMessage);
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
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown parsing error';
          console.error(`Ошибка парсинга selectedSlideIds для документа ${doc.$id}:`, errorMessage);
          selectedSlideIds = [];
        }

        let currentSlideId =
          typeof docData.currentSlideId === 'string' ? docData.currentSlideId : '';

        if (currentSlideId && slides.length > 0) {
          const slideExists = slides.some((slide) => slide.id === currentSlideId);
          if (!slideExists && slides.length > 0) {
            currentSlideId = slides[0].id;
            console.log(`🔄 Исправлен currentSlideId для документа ${doc.$id}`);
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
        console.log(
          `✅ Добавлена валидная презентация: "${presentation.title}" (${slides.length} слайдов)`
        );
      }

      console.log(`🎯 Возвращаем ${presentations.length} валидных презентаций пользователя`);

      presentations.sort((a, b) => {
        const dateA = new Date(a.$updatedAt || a.updatedAt || 0);
        const dateB = new Date(b.$updatedAt || b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      return presentations;
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ Ошибка загрузки презентаций:', {
        message: err.message,
        userId: userId,
      });
      return [];
    }
  }

  static async getPresentation(id: string): Promise<StoredPresentation> {
    try {
      console.log(`📥 Загружаем презентацию ${id} с валидацией`);

      const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);

      console.log('📄 Документ загружен:', {
        id: doc.$id,
        title: (doc as Record<string, unknown>).title,
        hasSlides: !!(doc as Record<string, unknown>).slides,
      });

      const validationResult = validatePresentation(doc);

      if (!validationResult.isValid) {
        console.error('❌ ВАЛИДАЦИЯ НЕ ПРОЙДЕНА:', {
          errors: validationResult.errors,
          formattedError: validationResult.formattedError,
        });

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

      console.log('✅ Валидация пройдена успешно');

      const docData = doc as Record<string, unknown>;

      let slides: Slide[] = [];
      let selectedSlideIds: string[] = [];

      try {
        if (docData.slides && typeof docData.slides === 'string') {
          const parsedSlides = validationResult.parsedData?.slides || [];
          slides = (parsedSlides as Slide[]) || [];
          console.log(`📊 Распарсено слайдов: ${slides.length}`);
        }
      } catch (e: unknown) {
        const err = e as Error;
        console.error('❌ Критическая ошибка парсинга slides после валидации:', err.message);
        slides = [];
      }

      try {
        if (docData.selectedSlideIds && typeof docData.selectedSlideIds === 'string') {
          const parsedIds = validationResult.parsedData?.selectedSlideIds || [];
          selectedSlideIds = (parsedIds as string[]) || [];
          console.log(`🎯 Выбранных слайдов: ${selectedSlideIds.length}`);
        }
      } catch (e: unknown) {
        const err = e as Error;
        console.error('❌ Критическая ошибка парсинга selectedSlideIds:', err.message);
        selectedSlideIds = [];
      }

      const currentSlideId =
        typeof docData.currentSlideId === 'string' ? docData.currentSlideId : '';

      if (currentSlideId && slides.length > 0) {
        const slideExists = slides.some((slide) => slide.id === currentSlideId);
        if (!slideExists) {
          console.warn(`⚠️ currentSlideId "${currentSlideId}" не найден среди слайдов`);
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

      console.log('✅ Презентация успешно загружена:', {
        id: result.id,
        title: result.title,
        slidesCount: result.slides.length,
        valid: true,
      });

      return result;
    } catch (error: unknown) {
      const err = error as Error;

      console.error('❌ Ошибка загрузки презентации:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });

      throw error;
    }
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
    } catch (e: unknown) {
      console.error('Ошибка парсинга slides в mapToStoredPresentation:', e);
      slides = [];
    }

    try {
      selectedSlideIds =
        typeof data.selectedSlideIds === 'string'
          ? JSON.parse(data.selectedSlideIds)
          : Array.isArray(data.selectedSlideIds)
            ? data.selectedSlideIds
            : [];
    } catch (e: unknown) {
      console.error('Ошибка парсинга selectedSlideIds в mapToStoredPresentation:', e);
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
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ Ошибка удаления презентации:', err.message);
      throw error;
    }
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
