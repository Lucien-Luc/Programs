import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppSettings {
  notifications: boolean;
  emailAlerts: boolean;
  compactView: boolean;
  showWelcomeMessage: boolean;
  backupEnabled: boolean;
  profileName: string;
  profileEmail: string;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  notifications: true,
  emailAlerts: false,
  compactView: false,
  showWelcomeMessage: true,
  backupEnabled: true,
  profileName: "Admin User",
  profileEmail: "admin@example.com",
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}