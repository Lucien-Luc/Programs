import { useState, createContext, useContext } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { useTranslation, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  Calendar, 
  ChartBar, 
  User, 
  Settings, 
  Palette,
  ChevronDown,
  LogOut
} from "lucide-react";
import logo from "@assets/logo_1750430330014.png";

const languages = [
  { code: "en", label: "🇬🇧", name: "English" },
  { code: "fr", label: "🇫🇷", name: "Français" },
  { code: "rw", label: "🇷🇼", name: "Kinyarwanda" },
  { code: "de", label: "🇩🇪", name: "Deutsch" },
];

const themes = [
  { value: "default", label: "Default Theme", color: "bg-primary" },
  { value: "dark", label: "Dark Theme", color: "bg-gray-800" },
  { value: "blue", label: "Blue Professional", color: "bg-blue-600" },
  { value: "purple", label: "Custom Modern", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
];

// Language Context
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: "en",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <img src={logo} alt="BPN Logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-sm text-muted-foreground">PROGRAM MANAGEMENT</p>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              className="space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t("dashboard")}</span>
            </Button>
          </Link>
          <Button variant="ghost" className="space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{t("calendar")}</span>
          </Button>
          <Link href="/analytics">
            <Button
              variant={isActive("/analytics") ? "default" : "ghost"}
              className="space-x-2"
            >
              <ChartBar className="w-4 h-4" />
              <span>{t("analytics")}</span>
            </Button>
          </Link>

        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-12 h-12 border-none bg-transparent hover:bg-accent">
              <SelectValue>
                {languages.find(lang => lang.code === language)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{lang.label}</span>
                    <span className="text-sm">{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {themes.map((themeOption) => (
                <DropdownMenuItem
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value as any)}
                  className="flex items-center space-x-2"
                >
                  <div className={`w-4 h-4 rounded ${themeOption.color}`} />
                  <span>{themeOption.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Access */}
          <Link href="/admin">
            <Button variant="outline" className="space-x-2">
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Button>
          </Link>


        </div>
      </div>
    </nav>
  );
}
