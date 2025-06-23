export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    calendar: "Calendar",
    analytics: "Analytics",
    
    // Dashboard
    welcome_title: "BPN Program Management",
    welcome_message: "Good morning! Here's your program management overview.",
    refresh: "Refresh",
    
    // Programs
    programs: "Programs",
    program: "Program",
    total_programs: "Total Programs",
    active_programs: "Active Programs",
    completed_programs: "Completed Programs",
    paused_programs: "Paused Programs",
    
    // Analytics
    analytics_title: "Analytics Dashboard",
    analytics_subtitle: "Comprehensive program analysis and insights",
    total_participants: "Total Participants",
    total_budget: "Total Budget",
    export_report: "Export Report",
    add_chart: "Add Chart",
    
    // Common
    status: "Status",
    progress: "Progress",
    participants: "Participants",
    budget: "Budget",
    timeline: "Timeline",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    create: "Create",
    search: "Search",
    
    // Status values
    active: "Active",
    paused: "Paused",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    calendar: "Calendrier",
    analytics: "Analytique",
    
    // Dashboard
    welcome_title: "Gestion des programmes BPN",
    welcome_message: "Bonjour! Voici votre aperçu de la gestion des programmes.",
    refresh: "Actualiser",
    
    // Programs
    programs: "Programmes",
    program: "Programme",
    total_programs: "Total des programmes",
    active_programs: "Programmes actifs",
    completed_programs: "Programmes terminés",
    paused_programs: "Programmes en pause",
    
    // Analytics
    analytics_title: "Tableau de bord analytique",
    analytics_subtitle: "Analyse complète et aperçus des programmes",
    total_participants: "Total des participants",
    total_budget: "Budget total",
    export_report: "Exporter le rapport",
    add_chart: "Ajouter un graphique",
    
    // Common
    status: "Statut",
    progress: "Progrès",
    participants: "Participants",
    budget: "Budget",
    timeline: "Chronologie",
    actions: "Actions",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    create: "Créer",
    search: "Rechercher",
    
    // Status values
    active: "Actif",
    paused: "En pause",
    completed: "Terminé",
    cancelled: "Annulé",
  },
  
  rw: {
    // Navigation
    dashboard: "Ikibaho",
    calendar: "Kalendari",
    analytics: "Isesengura",
    
    // Dashboard
    welcome_title: "Imicungire ya Porogaramu za BPN",
    welcome_message: "Muramuke! Dore incamake y'imicungire ya porogaramu zawe.",
    refresh: "Kuvugurura",
    
    // Programs
    programs: "Porogaramu",
    program: "Porogaramu",
    total_programs: "Porogaramu zose",
    active_programs: "Porogaramu zikora",
    completed_programs: "Porogaramu zarangiye",
    paused_programs: "Porogaramu zahagaritswe",
    
    // Analytics
    analytics_title: "Ikibaho cy'Isesengura",
    analytics_subtitle: "Isesengura ryuzuye n'amakuru y'aho porogaramu zikiye",
    total_participants: "Abitabiriye bose",
    total_budget: "Ingengo y'imari yose",
    export_report: "Kohereza raporo",
    add_chart: "Ongeraho ishusho",
    
    // Common
    status: "Imiterere",
    progress: "Iterambere",
    participants: "Abitabiriye",
    budget: "Ingengo y'imari",
    timeline: "Igihe",
    actions: "Ibikorwa",
    edit: "Guhindura",
    delete: "Gusiba",
    save: "Kubika",
    cancel: "Kureka",
    create: "Kurema",
    search: "Gushakisha",
    
    // Status values
    active: "Bikora",
    paused: "Byahagaritswe",
    completed: "Byarangiye",
    cancelled: "Byahagaritswe burundu",
  },
  
  de: {
    // Navigation
    dashboard: "Dashboard",
    calendar: "Kalender",
    analytics: "Analytik",
    
    // Dashboard
    welcome_title: "BPN Programmverwaltung",
    welcome_message: "Guten Morgen! Hier ist Ihre Programmverwaltungsübersicht.",
    refresh: "Aktualisieren",
    
    // Programs
    programs: "Programme",
    program: "Programm",
    total_programs: "Gesamtprogramme",
    active_programs: "Aktive Programme",
    completed_programs: "Abgeschlossene Programme",
    paused_programs: "Pausierte Programme",
    
    // Analytics
    analytics_title: "Analyse-Dashboard",
    analytics_subtitle: "Umfassende Programmanalyse und Einblicke",
    total_participants: "Gesamtteilnehmer",
    total_budget: "Gesamtbudget",
    export_report: "Bericht exportieren",
    add_chart: "Diagramm hinzufügen",
    
    // Common
    status: "Status",
    progress: "Fortschritt",
    participants: "Teilnehmer",
    budget: "Budget",
    timeline: "Zeitplan",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    create: "Erstellen",
    search: "Suchen",
    
    // Status values
    active: "Aktiv",
    paused: "Pausiert",
    completed: "Abgeschlossen",
    cancelled: "Abgebrochen",
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function useTranslation(language: Language) {
  return {
    t: (key: TranslationKey): string => {
      return translations[language][key] || translations.en[key] || key;
    },
    language
  };
}