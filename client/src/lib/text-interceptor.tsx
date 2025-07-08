import React, { ReactNode, useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';

// Enhanced translation dictionary with comprehensive coverage
const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  fr: {
    // Navigation & UI
    "Dashboard": "Tableau de bord",
    "Analytics": "Analytique",
    "Calendar": "Calendrier",
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
    "Admin": "Admin",
    "Profile": "Profil",
    "Logout": "Déconnexion",
    "Login": "Connexion",
    
    // Actions & Buttons
    "Edit": "Modifier",
    "Delete": "Supprimer",
    "Remove": "Retirer",
    "Save": "Enregistrer",
    "Cancel": "Annuler",
    "Create": "Créer",
    "Add": "Ajouter",
    "Search": "Rechercher",
    "Filter": "Filtrer",
    "Sort": "Trier",
    "Export": "Exporter",
    "Import": "Importer",
    "Download": "Télécharger",
    "Upload": "Téléverser",
    "Share": "Partager",
    "View": "Voir",
    "Show": "Afficher",
    "Hide": "Masquer",
    "Open": "Ouvrir",
    "Close": "Fermer",
    "Submit": "Soumettre",
    "Send": "Envoyer",
    "Refresh": "Actualiser",
    "Update": "Mettre à jour",
    "Sync": "Synchroniser",
    "Load": "Charger",
    "Next": "Suivant",
    "Previous": "Précédent",
    "Back": "Retour",
    "Continue": "Continuer",
    "Finish": "Terminer",
    "Complete": "Compléter",
    
    // Status Values
    "Active": "Actif",
    "Inactive": "Inactif",
    "Paused": "En pause",
    "Completed": "Terminé",
    "Cancelled": "Annulé",
    "Pending": "En attente",
    "Draft": "Brouillon",
    "Published": "Publié",
    "Archived": "Archivé",
    "New": "Nouveau",
    "Updated": "Mis à jour",
    "Running": "En cours",
    "Stopped": "Arrêté",
    "Failed": "Échoué",
    "Success": "Succès",
    "Error": "Erreur",
    "Warning": "Avertissement",
    "Info": "Information",
    "Loading": "Chargement",
    "Saving": "Sauvegarde",
    
    // Time & Dates
    "Last updated": "Dernière mise à jour",
    "Created": "Créé",
    "Modified": "Modifié",
    "Start Date": "Date de début",
    "End Date": "Date de fin",
    "Due Date": "Date d'échéance",
    "Date": "Date",
    "Time": "Heure",
    "Today": "Aujourd'hui",
    "Yesterday": "Hier",
    "Tomorrow": "Demain",
    "This week": "Cette semaine",
    "Last week": "La semaine dernière",
    "Next week": "La semaine prochaine",
    "This month": "Ce mois",
    "Last month": "Le mois dernier",
    "Next month": "Le mois prochain",
    "This year": "Cette année",
    "Last year": "L'année dernière",
    
    // Numbers & Metrics
    "Total": "Total",
    "Count": "Nombre",
    "Amount": "Montant",
    "Percentage": "Pourcentage",
    "Rate": "Taux",
    "Average": "Moyenne",
    "Maximum": "Maximum",
    "Minimum": "Minimum",
    "Sum": "Somme",
    "Total Programs": "Total des programmes",
    "Active Programs": "Programmes actifs",
    "Completed Programs": "Programmes terminés",
    "Total Participants": "Total des participants",
    "Budget Utilized": "Budget utilisé",
    "Budget Allocated": "Budget alloué",
    "Budget Remaining": "Budget restant",
    "Timeline Progress": "Progrès chronologique",
    "Success Rate": "Taux de réussite",
    "Completion Rate": "Taux d'achèvement",
    
    // Form Fields
    "Name": "Nom",
    "Title": "Titre",
    "Description": "Description",
    "Type": "Type",
    "Category": "Catégorie",
    "Priority": "Priorité",
    "Tags": "Étiquettes",
    "Location": "Emplacement",
    "Address": "Adresse",
    "Email": "E-mail",
    "Phone": "Téléphone",
    "Website": "Site web",
    "Username": "Nom d'utilisateur",
    "Password": "Mot de passe",
    "Confirm Password": "Confirmer le mot de passe",
    "First Name": "Prénom",
    "Last Name": "Nom de famille",
    "Full Name": "Nom complet",
    "Company": "Entreprise",
    "Organization": "Organisation",
    "Department": "Département",
    "Position": "Poste",
    "Role": "Rôle",
    
    // Messages & Notifications
    "Welcome": "Bienvenue",
    "Good morning": "Bonjour",
    "Good afternoon": "Bon après-midi",
    "Good evening": "Bonsoir",
    "Hello": "Bonjour",
    "Thank you": "Merci",
    "Please": "S'il vous plaît",
    "Sorry": "Désolé",
    "Excuse me": "Excusez-moi",
    "Congratulations": "Félicitations",
    "Well done": "Bien joué",
    "Please wait": "Veuillez patienter",
    "Try again": "Réessayer",
    "Contact support": "Contacter le support",
    "No data available": "Aucune donnée disponible",
    "No results found": "Aucun résultat trouvé",
    "No description available": "Aucune description disponible",
    "Coming soon": "Bientôt disponible",
    "Under construction": "En construction",
    "Page not found": "Page non trouvée",
    "Access denied": "Accès refusé",
    "Permission denied": "Permission refusée",
    "Invalid input": "Entrée invalide",
    "Required field": "Champ obligatoire",
    "Optional": "Optionnel",
    "Recommended": "Recommandé",
    
    // Program Types & Categories
    "CORE": "CORE",
    "RIN": "RIN",
    "AGUKA": "AGUKA",
    "i-ACC": "i-ACC",
    "MCF": "MCF",
    "Education": "Éducation",
    "Health": "Santé",
    "Environment": "Environnement",
    "Technology": "Technologie",
    "Community": "Communauté",
    "Development": "Développement",
    "Research": "Recherche",
    "Training": "Formation",
    "Capacity Building": "Renforcement des capacités",
    
    // Priority Levels
    "High": "Élevé",
    "Medium": "Moyen",
    "Low": "Faible",
    "Critical": "Critique",
    "Urgent": "Urgent",
    "Normal": "Normal",
    
    // Common Phrases
    "BPN Program Management": "Gestion des programmes BPN",
    "Here's your program management overview": "Voici votre aperçu de gestion des programmes",
    "Comprehensive program analysis": "Analyse complète des programmes",
    "Program management dashboard": "Tableau de bord de gestion des programmes",
    "View all programs": "Voir tous les programmes",
    "Create new program": "Créer un nouveau programme",
    "Edit program details": "Modifier les détails du programme",
    "Program successfully created": "Programme créé avec succès",
    "Program successfully updated": "Programme mis à jour avec succès",
    "Program successfully deleted": "Programme supprimé avec succès",
    "Are you sure": "Êtes-vous sûr",
    "This action cannot be undone": "Cette action ne peut pas être annulée",
    "Confirm deletion": "Confirmer la suppression",
    "Operation completed successfully": "Opération terminée avec succès",
    "An error occurred": "Une erreur s'est produite",
  },
  
  rw: {
    // Navigation & UI
    "Dashboard": "Ikibaho",
    "Analytics": "Isesengura",
    "Calendar": "Kalendari",
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
    "Admin": "Umuyobozi",
    "Profile": "Umwirondoro",
    "Logout": "Gusohoka",
    "Login": "Kwinjira",
    
    // Actions & Buttons
    "Edit": "Hindura",
    "Delete": "Siba",
    "Remove": "Kurenga",
    "Save": "Bika",
    "Cancel": "Kuraguza",
    "Create": "Kurema",
    "Add": "Ongeraho",
    "Search": "Shakisha",
    "Filter": "Shungura",
    "Sort": "Gutondeka",
    "Export": "Kohereza",
    "Import": "Kwinjiza",
    "Download": "Pakurura",
    "Upload": "Kohereza",
    "Share": "Sangira",
    "View": "Reba",
    "Show": "Erekana",
    "Hide": "Hisha",
    "Open": "Fungura",
    "Close": "Funga",
    "Submit": "Kohereza",
    "Send": "Kohereza",
    "Refresh": "Vugurura",
    "Update": "Vugurura",
    "Sync": "Huza",
    "Load": "Shakira",
    "Next": "Ikurikira",
    "Previous": "Ibanjirije",
    "Back": "Subira inyuma",
    "Continue": "Komeza",
    "Finish": "Rangiza",
    "Complete": "Uzuza",
    
    // Status Values
    "Active": "Bikora",
    "Inactive": "Ntibikora",
    "Paused": "Byahagaritswe",
    "Completed": "Byarangiye",
    "Cancelled": "Byahavanyweho",
    "Pending": "Bitegereje",
    "Draft": "Igitabo",
    "Published": "Byatangajwe",
    "Archived": "Byabitswe",
    "New": "Gishya",
    "Updated": "Byavuguruwe",
    "Running": "Bikora",
    "Stopped": "Byahagaritswe",
    "Failed": "Byanze",
    "Success": "Intsinzi",
    "Error": "Ikosa",
    "Warning": "Iburira",
    "Info": "Amakuru",
    "Loading": "Bipakira",
    "Saving": "Bibikwa",
    
    // Time & Dates
    "Last updated": "Ivugururwa rya nyuma",
    "Created": "Byakozwe",
    "Modified": "Byahinduwe",
    "Start Date": "Itariki yo gutangira",
    "End Date": "Itariki yo kurangiza",
    "Due Date": "Itariki ngombwa",
    "Date": "Itariki",
    "Time": "Igihe",
    "Today": "Uyu munsi",
    "Yesterday": "Ejo hashize",
    "Tomorrow": "Ejo hazaza",
    "This week": "Iri cyumweru",
    "Last week": "Icyumweru gishize",
    "Next week": "Icyumweru gitaha",
    "This month": "Uku kwezi",
    "Last month": "Ukwezi gushize",
    "Next month": "Ukwezi gutaha",
    "This year": "Uyu mwaka",
    "Last year": "Umwaka ushize",
    
    // Common terms
    "Name": "Izina",
    "Description": "Ibisobanuro",
    "Type": "Ubwoko",
    "Total": "Byose",
    "No description available": "Nta bisobanuro biboneka",
  },
  
  de: {
    // Navigation & UI
    "Dashboard": "Dashboard",
    "Analytics": "Analytik",
    "Calendar": "Kalender",
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
    "Admin": "Admin",
    "Profile": "Profil",
    "Logout": "Abmelden",
    "Login": "Anmelden",
    
    // Actions & Buttons
    "Edit": "Bearbeiten",
    "Delete": "Löschen",
    "Remove": "Entfernen",
    "Save": "Speichern",
    "Cancel": "Abbrechen",
    "Create": "Erstellen",
    "Add": "Hinzufügen",
    "Search": "Suchen",
    "Filter": "Filtern",
    "Sort": "Sortieren",
    "Export": "Exportieren",
    "Import": "Importieren",
    "Download": "Herunterladen",
    "Upload": "Hochladen",
    "Share": "Teilen",
    "View": "Ansehen",
    "Show": "Zeigen",
    "Hide": "Verstecken",
    "Open": "Öffnen",
    "Close": "Schließen",
    "Submit": "Einreichen",
    "Send": "Senden",
    "Refresh": "Aktualisieren",
    "Update": "Aktualisieren",
    "Sync": "Synchronisieren",
    "Load": "Laden",
    "Next": "Weiter",
    "Previous": "Zurück",
    "Back": "Zurück",
    "Continue": "Fortfahren",
    "Finish": "Beenden",
    "Complete": "Vervollständigen",
    
    // Status Values
    "Active": "Aktiv",
    "Inactive": "Inaktiv",
    "Paused": "Pausiert",
    "Completed": "Abgeschlossen",
    "Cancelled": "Abgebrochen",
    "Pending": "Ausstehend",
    "Draft": "Entwurf",
    "Published": "Veröffentlicht",
    "Archived": "Archiviert",
    "New": "Neu",
    "Updated": "Aktualisiert",
    "Running": "Läuft",
    "Stopped": "Gestoppt",
    "Failed": "Fehlgeschlagen",
    "Success": "Erfolg",
    "Error": "Fehler",
    "Warning": "Warnung",
    "Info": "Information",
    "Loading": "Laden",
    "Saving": "Speichern",
    
    // Time & Dates
    "Last updated": "Zuletzt aktualisiert",
    "Created": "Erstellt",
    "Modified": "Geändert",
    "Start Date": "Startdatum",
    "End Date": "Enddatum",
    "Due Date": "Fälligkeitsdatum",
    "Date": "Datum",
    "Time": "Zeit",
    "Today": "Heute",
    "Yesterday": "Gestern",
    "Tomorrow": "Morgen",
    "This week": "Diese Woche",
    "Last week": "Letzte Woche",
    "Next week": "Nächste Woche",
    "This month": "Diesen Monat",
    "Last month": "Letzten Monat",
    "Next month": "Nächsten Monat",
    "This year": "Dieses Jahr",
    "Last year": "Letztes Jahr",
    
    // Common terms
    "Name": "Name",
    "Description": "Beschreibung",
    "Type": "Typ",
    "Total": "Gesamt",
    "No description available": "Keine Beschreibung verfügbar",
  }
};

// Simple but comprehensive translation function
function translateText(text: string, targetLanguage: string): string {
  if (!text || targetLanguage === 'en') return text;
  
  const translations = TRANSLATION_DICTIONARY[targetLanguage];
  if (!translations) return text;
  
  // Direct translation
  if (translations[text]) {
    return translations[text];
  }
  
  // Try to translate individual words for phrases
  const words = text.split(' ');
  if (words.length > 1) {
    const translatedWords = words.map(word => {
      // Remove punctuation for matching
      const cleanWord = word.replace(/[.,!?;:]$/, '');
      const punctuation = word.slice(cleanWord.length);
      return (translations[cleanWord] || cleanWord) + punctuation;
    });
    return translatedWords.join(' ');
  }
  
  return text;
}

// Component that automatically translates text content
export function TranslatedText({ children, ...props }: { children: ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  const { language, isAdminRoute } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState(children);

  useEffect(() => {
    if (isAdminRoute || language === 'en') {
      setTranslatedContent(children);
      return;
    }

    // Handle string content
    if (typeof children === 'string') {
      const translated = translateText(children, language);
      setTranslatedContent(translated);
    } else {
      setTranslatedContent(children);
    }
  }, [children, language, isAdminRoute]);

  if (typeof translatedContent === 'string') {
    return <span {...props}>{translatedContent}</span>;
  }

  return <>{translatedContent}</>;
}

// Hook to translate any text
export function useTextTranslation() {
  const { language, isAdminRoute } = useLanguage();

  return {
    t: (text: string) => {
      if (isAdminRoute || language === 'en') return text;
      return translateText(text, language);
    },
    language,
    isAdminRoute
  };
}

// Function to translate text directly
export function t(text: string, targetLanguage: string): string {
  return translateText(text, targetLanguage);
}