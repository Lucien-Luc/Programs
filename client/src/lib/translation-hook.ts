import { useState, useEffect } from 'react';
import { translationService } from './translation-service';
import { useLanguage } from './LanguageProvider';

interface UseTranslationOptions {
  enabled?: boolean;
  fallback?: string;
}

export function useTranslation(text: string, options: UseTranslationOptions = {}) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const { enabled = true, fallback = text } = options;

  useEffect(() => {
    // Skip translation if disabled, text is empty, or language is English
    if (!enabled || !text || language === 'en') {
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      setIsLoading(true);
      try {
        const result = await translationService.translateText({
          text,
          targetLanguage: language,
          sourceLanguage: 'en'
        });
        setTranslatedText(result);
      } catch (error) {
        console.warn('Translation failed:', error);
        setTranslatedText(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, language, enabled, fallback]);

  return {
    text: translatedText,
    isLoading,
    originalText: text
  };
}

export function useTranslationArray(texts: string[], options: UseTranslationOptions = {}) {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState(texts);
  const [isLoading, setIsLoading] = useState(false);
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || !texts.length || language === 'en') {
      setTranslatedTexts(texts);
      return;
    }

    const translateTexts = async () => {
      setIsLoading(true);
      try {
        const results = await translationService.translateTexts(texts, language, 'en');
        setTranslatedTexts(results);
      } catch (error) {
        console.warn('Translation failed:', error);
        setTranslatedTexts(texts);
      } finally {
        setIsLoading(false);
      }
    };

    translateTexts();
  }, [texts, language, enabled]);

  return {
    texts: translatedTexts,
    isLoading,
    originalTexts: texts
  };
}