import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLanguage } from './LanguageProvider';

// Simple translation service without Google Cloud dependencies
class SimpleTranslationService {
  private cache = new Map<string, string>();
  
  // Basic translations for common words/phrases
  private translations: Record<string, Record<string, string>> = {
    fr: {
      // Navigation & Common
      "Dashboard": "Tableau de bord",
      "Analytics": "Analytique",
      "Programs": "Programmes",
      "Program": "Programme",
      "Activities": "Activités",
      "Activity": "Activité",
      "Status": "Statut",
      "Progress": "Progrès",
      "Budget": "Budget",
      "Timeline": "Chronologie",
      "Participants": "Participants",
      "Overview": "Aperçu",
      "Notes": "Notes",
      "Settings": "Paramètres",
      "Documents": "Documents",
      "Team": "Équipe",
      "Resources": "Ressources",
      "Impact": "Impact",
      
      // Actions
      "Edit": "Modifier",
      "Delete": "Supprimer",
      "Save": "Enregistrer",
      "Cancel": "Annuler",
      "Create": "Créer",
      "Add": "Ajouter",
      "Search": "Rechercher",
      "Export": "Exporter",
      "Import": "Importer",
      "Download": "Télécharger",
      "Upload": "Téléverser",
      "Share": "Partager",
      "View": "Voir",
      "Close": "Fermer",
      
      // Status values
      "Active": "Actif",
      "Paused": "En pause",
      "Completed": "Terminé",
      "Cancelled": "Annulé",
      "Pending": "En attente",
      "Draft": "Brouillon",
      
      // Time & Dates
      "Last updated": "Dernière mise à jour",
      "Start Date": "Date de début",
      "End Date": "Date de fin",
      "Created": "Créé",
      "Modified": "Modifié",
      "Today": "Aujourd'hui",
      "Yesterday": "Hier",
      "Tomorrow": "Demain",
      
      // Metrics
      "Total Programs": "Total des programmes",
      "Active Programs": "Programmes actifs",
      "Completed Programs": "Programmes terminés",
      "Total Participants": "Total des participants",
      "Budget Utilized": "Budget utilisé",
      "Timeline Progress": "Progrès chronologique",
      "Success Rate": "Taux de réussite",
      
      // Descriptions
      "Description": "Description",
      "No description available": "Aucune description disponible",
      "Loading": "Chargement",
      "Error": "Erreur",
      "Success": "Succès",
      "Warning": "Avertissement",
      "Information": "Information",
      
      // Program Types
      "CORE": "CORE",
      "RIN": "RIN",
      "AGUKA": "AGUKA",
      "i-ACC": "i-ACC",
      "MCF": "MCF",
      
      // Messages
      "Good morning": "Bonjour",
      "Welcome": "Bienvenue",
      "Thank you": "Merci",
      "Please wait": "Veuillez patienter",
      "Try again": "Réessayer",
      "Contact support": "Contacter le support",
    },
    
    rw: {
      // Navigation & Common
      "Dashboard": "Ikibaho",
      "Analytics": "Isesengura",
      "Programs": "Porogaramu",
      "Program": "Porogaramu",
      "Activities": "Ibikorwa",
      "Activity": "Igikorwa",
      "Status": "Uko bimeze",
      "Progress": "Iterambere",
      "Budget": "Ingengo y'imari",
      "Timeline": "Igihe",
      "Participants": "Abitabiriye",
      "Overview": "Incamake",
      "Notes": "Inyandiko",
      "Settings": "Amagenamiterere",
      "Documents": "Inyandiko",
      "Team": "Itsinda",
      "Resources": "Ibikoresho",
      "Impact": "Ingaruka",
      
      // Actions
      "Edit": "Hindura",
      "Delete": "Siba",
      "Save": "Bika",
      "Cancel": "Kuraguza",
      "Create": "Kurema",
      "Add": "Ongeraho",
      "Search": "Shakisha",
      "Export": "Kohereza",
      "Import": "Kwinjiza",
      "Download": "Pakurura",
      "Upload": "Kohereza",
      "Share": "Sangira",
      "View": "Reba",
      "Close": "Funga",
      
      // Status values
      "Active": "Bikora",
      "Paused": "Byahagaritswe",
      "Completed": "Byarangiye",
      "Cancelled": "Byahavanyweho",
      "Pending": "Bitegereje",
      "Draft": "Igitabo",
      
      // Time & Dates
      "Last updated": "Ivugururwa rya nyuma",
      "Start Date": "Itariki yo gutangira",
      "End Date": "Itariki yo kurangiza",
      "Created": "Byakozwe",
      "Modified": "Byahinduwe",
      "Today": "Uyu munsi",
      "Yesterday": "Ejo hashize",
      "Tomorrow": "Ejo hazaza",
      
      // Metrics
      "Total Programs": "Porogaramu zose",
      "Active Programs": "Porogaramu zikora",
      "Completed Programs": "Porogaramu zarangiye",
      "Total Participants": "Abitabiriye bose",
      "Budget Utilized": "Ingengo y'imari yakoreshejwe",
      "Timeline Progress": "Iterambere ry'igihe",
      "Success Rate": "Igipimo cy'intsinzi",
      
      // Descriptions
      "Description": "Ibisobanuro",
      "No description available": "Nta bisobanuro biboneka",
      "Loading": "Bipakira",
      "Error": "Ikosa",
      "Success": "Intsinzi",
      "Warning": "Iburira",
      "Information": "Amakuru",
    },
    
    de: {
      // Navigation & Common
      "Dashboard": "Dashboard",
      "Analytics": "Analytik",
      "Programs": "Programme",
      "Program": "Programm",
      "Activities": "Aktivitäten",
      "Activity": "Aktivität",
      "Status": "Status",
      "Progress": "Fortschritt",
      "Budget": "Budget",
      "Timeline": "Zeitplan",
      "Participants": "Teilnehmer",
      "Overview": "Übersicht",
      "Notes": "Notizen",
      "Settings": "Einstellungen",
      "Documents": "Dokumente",
      "Team": "Team",
      "Resources": "Ressourcen",
      "Impact": "Auswirkung",
      
      // Actions
      "Edit": "Bearbeiten",
      "Delete": "Löschen",
      "Save": "Speichern",
      "Cancel": "Abbrechen",
      "Create": "Erstellen",
      "Add": "Hinzufügen",
      "Search": "Suchen",
      "Export": "Exportieren",
      "Import": "Importieren",
      "Download": "Herunterladen",
      "Upload": "Hochladen",
      "Share": "Teilen",
      "View": "Ansehen",
      "Close": "Schließen",
      
      // Status values
      "Active": "Aktiv",
      "Paused": "Pausiert",
      "Completed": "Abgeschlossen",
      "Cancelled": "Abgebrochen",
      "Pending": "Ausstehend",
      "Draft": "Entwurf",
      
      // Time & Dates
      "Last updated": "Zuletzt aktualisiert",
      "Start Date": "Startdatum",
      "End Date": "Enddatum",
      "Created": "Erstellt",
      "Modified": "Geändert",
      "Today": "Heute",
      "Yesterday": "Gestern",
      "Tomorrow": "Morgen",
      
      // Metrics
      "Total Programs": "Gesamtprogramme",
      "Active Programs": "Aktive Programme",
      "Completed Programs": "Abgeschlossene Programme",
      "Total Participants": "Gesamtteilnehmer",
      "Budget Utilized": "Budget verwendet",
      "Timeline Progress": "Zeitplan-Fortschritt",
      "Success Rate": "Erfolgsrate",
      
      // Descriptions
      "Description": "Beschreibung",
      "No description available": "Keine Beschreibung verfügbar",
      "Loading": "Laden",
      "Error": "Fehler",
      "Success": "Erfolg",
      "Warning": "Warnung",
      "Information": "Information",
    }
  };

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!text || targetLanguage === 'en') return text;
    
    const cacheKey = `${text}:${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Try direct translation from dictionary
    const langTranslations = this.translations[targetLanguage];
    if (langTranslations && langTranslations[text]) {
      const translation = langTranslations[text];
      this.cache.set(cacheKey, translation);
      return translation;
    }

    // For phrases not in dictionary, try to find partial matches
    const words = text.split(' ');
    if (words.length > 1 && langTranslations) {
      const translatedWords = words.map(word => {
        return langTranslations[word] || word;
      });
      const translation = translatedWords.join(' ');
      this.cache.set(cacheKey, translation);
      return translation;
    }

    // Fallback: return original text
    this.cache.set(cacheKey, text);
    return text;
  }
}

const translationService = new SimpleTranslationService();

// Context for managing translation state
interface AutoTranslateContextType {
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const AutoTranslateContext = createContext<AutoTranslateContextType | null>(null);

// Provider component
export function AutoTranslateProvider({ children }: { children: ReactNode }) {
  const { language, isAdminRoute } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text: string): Promise<string> => {
    if (isAdminRoute || language === 'en' || !text.trim()) {
      return text;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateText(text, language);
      return translated;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <AutoTranslateContext.Provider value={{ translateText, isTranslating }}>
      {children}
    </AutoTranslateContext.Provider>
  );
}

// Hook to use auto-translation
export function useAutoTranslate() {
  const context = useContext(AutoTranslateContext);
  if (!context) {
    throw new Error('useAutoTranslate must be used within AutoTranslateProvider');
  }
  return context;
}

// Component that automatically translates its text content
export function AutoTranslateText({ children, className }: { children: string; className?: string }) {
  const { translateText } = useAutoTranslate();
  const { language, isAdminRoute } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (isAdminRoute || language === 'en') {
      setTranslatedText(children);
      return;
    }

    translateText(children).then(setTranslatedText);
  }, [children, language, isAdminRoute, translateText]);

  return <span className={className}>{translatedText}</span>;
}

// Higher-order component that wraps text nodes for automatic translation
export function withAutoTranslate<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return function AutoTranslatedComponent(props: P) {
    const { language, isAdminRoute } = useLanguage();
    
    if (isAdminRoute || language === 'en') {
      return <WrappedComponent {...props} />;
    }

    return (
      <AutoTranslateProvider>
        <WrappedComponent {...props} />
      </AutoTranslateProvider>
    );
  };
}