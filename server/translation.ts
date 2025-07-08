import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize Google Translate client
let translate: Translate | null = null;

try {
  // Try to initialize with service account (if available)
  // Removed reference to './firebase-service-account.json' for public repo. Please provide your own credentials via environment variables.
  translate = new Translate({
    projectId: 'programs-tracker', // Your Firebase project ID
    // keyFilename: './firebase-service-account.json', // Path to your service account key
  });
} catch (error) {
  console.warn('Google Translate service account not found, falling back to API key method');
  
  // Fallback to API key method (if available)
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (apiKey) {
    translate = new Translate({
      projectId: 'programs-tracker',
      key: apiKey,
    });
  } else {
    console.warn('No Google Translate credentials found. Translation will use fallback method.');
  }
}

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLanguage?: string;
}

// Language mapping for Google Translate API
const languageMap: { [key: string]: string } = {
  'en': 'en',
  'fr': 'fr', 
  'de': 'de',
  'rw': 'rw', // Kinyarwanda
};

export class TranslationService {
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, targetLanguage, sourceLanguage = 'en' } = request;
    
    // Return original text if target is English or same as source
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return { translatedText: text, sourceLanguage };
    }

    // Map language codes
    const targetLang = languageMap[targetLanguage] || targetLanguage;
    const sourceLang = languageMap[sourceLanguage] || sourceLanguage;

    try {
      if (translate) {
        // Use Google Translate API
        const [translation] = await translate.translate(text, {
          from: sourceLang,
          to: targetLang,
        });
        
        return {
          translatedText: translation,
          sourceLanguage: sourceLang,
        };
      } else {
        // Fallback: Use a simple mock translation or return original
        console.warn('Google Translate not available, using fallback');
        
        // Simple fallback translations for common phrases
        const fallbackTranslations = this.getFallbackTranslations(text, targetLanguage);
        
        return {
          translatedText: fallbackTranslations || text,
          sourceLanguage: sourceLang,
        };
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback to simple translations
      const fallbackTranslations = this.getFallbackTranslations(text, targetLanguage);
      
      return {
        translatedText: fallbackTranslations || text,
        sourceLanguage: sourceLang,
      };
    }
  }

  private getFallbackTranslations(text: string, targetLanguage: string): string | null {
    // Basic fallback translations for common UI terms
    const translations: { [key: string]: { [key: string]: string } } = {
      'fr': {
        'Dashboard': 'Tableau de bord',
        'Analytics': 'Analytique',
        'Programs': 'Programmes',
        'Activities': 'Activités',
        'Progress': 'Progrès',
        'Status': 'Statut',
        'Budget': 'Budget',
        'Participants': 'Participants',
        'Active': 'Actif',
        'Completed': 'Terminé',
        'Pending': 'En attente',
        'Scheduled': 'Programmé',
      },
      'de': {
        'Dashboard': 'Dashboard',
        'Analytics': 'Analytik',
        'Programs': 'Programme',
        'Activities': 'Aktivitäten',
        'Progress': 'Fortschritt',
        'Status': 'Status',
        'Budget': 'Budget',
        'Participants': 'Teilnehmer',
        'Active': 'Aktiv',
        'Completed': 'Abgeschlossen',
        'Pending': 'Ausstehend',
        'Scheduled': 'Geplant',
      },
      'rw': {
        'Dashboard': 'Imbuga',
        'Analytics': 'Isesengura',
        'Programs': 'Gahunda',
        'Activities': 'Ibikorwa',
        'Progress': 'Iterambere',
        'Status': 'Uko bimeze',
        'Budget': 'Ingengo y\'imari',
        'Participants': 'Abitabiriye',
        'Active': 'Birakora',
        'Completed': 'Byarangiye',
        'Pending': 'Bitegereje',
        'Scheduled': 'Byateganyijwe',
      }
    };

    const langTranslations = translations[targetLanguage];
    return langTranslations ? langTranslations[text] : null;
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage: string = 'en'): Promise<string[]> {
    const promises = texts.map(text => this.translateText({ text, targetLanguage, sourceLanguage }));
    const results = await Promise.all(promises);
    return results.map(result => result.translatedText);
  }
}

export const translationService = new TranslationService();