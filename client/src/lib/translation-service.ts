// Translation service using Google Translate API
interface TranslationCache {
  [key: string]: string;
}

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

class TranslationService {
  private cache: Map<string, TranslationCache> = new Map();
  private apiEndpoint = '/api/translate';

  // Generate cache key
  private getCacheKey(text: string, targetLang: string, sourceLang: string = 'en'): string {
    return `${sourceLang}-${targetLang}-${text}`;
  }

  // Translate text using our backend API
  async translateText(request: TranslationRequest): Promise<string> {
    const { text, targetLanguage, sourceLanguage = 'en' } = request;
    
    // Don't translate if target language is English or same as source
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage);
    const langCache = this.cache.get(targetLanguage) || {};
    
    if (langCache[cacheKey]) {
      return langCache[cacheKey];
    }

    try {
      // Call our backend translation API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
        }),
      });

      if (!response.ok) {
        console.warn('Translation failed, using original text');
        return text;
      }

      const result = await response.json();
      const translatedText = result.translatedText || text;

      // Cache the result
      if (!this.cache.has(targetLanguage)) {
        this.cache.set(targetLanguage, {});
      }
      const currentCache = this.cache.get(targetLanguage)!;
      currentCache[cacheKey] = translatedText;

      return translatedText;
    } catch (error) {
      console.warn('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  // Translate multiple texts at once
  async translateTexts(texts: string[], targetLanguage: string, sourceLanguage: string = 'en'): Promise<string[]> {
    const promises = texts.map(text => this.translateText({ text, targetLanguage, sourceLanguage }));
    return Promise.all(promises);
  }

  // Clear cache for a specific language
  clearCache(language?: string): void {
    if (language) {
      this.cache.delete(language);
    } else {
      this.cache.clear();
    }
  }

  // Get supported languages
  getSupportedLanguages(): Array<{ code: string; name: string; flag: string }> {
    return [
      { code: "en", name: "English", flag: "🇬🇧" },
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
      { code: "de", name: "Deutsch", flag: "🇩🇪" },
    ];
  }
}

export const translationService = new TranslationService();
export default translationService;