import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/lib/LanguageProvider";
import type { Language } from "@/lib/i18n";
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
  LogOut,
  Globe
} from "lucide-react";
import logo from "@assets/logo_1750430330014.png";

const languages = [
  { code: "en", label: "🇬🇧", name: "English" },
  { code: "es", label: "🇪🇸", name: "Español" },
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

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isAdminRoute } = useLanguage();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", icon: BarChart3, labelKey: "dashboard" },
    { path: "/analytics", icon: ChartBar, labelKey: "analytics" },
    { path: "/admin", icon: Settings, labelKey: "admin" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <img src={logo} alt="BPN Logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-sm text-muted-foreground">
                {isAdminRoute ? "PROGRAM MANAGEMENT" : t("welcome_title")}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>
                    {item.path === "/admin" ? "Admin" : t(item.labelKey as TranslationKey)}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side: Language Selector, Theme Selector, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Language Selector - Only show on non-admin routes */}
          {!isAdminRoute && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {languages.find(lang => lang.code === language)?.label}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`flex items-center space-x-3 ${
                      language === lang.code ? "bg-accent" : ""
                    }`}
                  >
                    <span className="text-lg">{lang.label}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themes.map((themeOption) => (
                <DropdownMenuItem
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value as any)}
                  className={`flex items-center space-x-3 ${
                    theme === themeOption.value ? "bg-accent" : ""
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${themeOption.color}`} />
                  <span>{themeOption.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}