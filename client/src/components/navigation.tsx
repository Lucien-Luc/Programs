import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
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

const languages = [
  { code: "en", label: "🇬🇧 English" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "rw", label: "🇷🇼 Kinyarwanda" },
  { code: "de", label: "🇨🇭 Deutsch" },
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
  const [language, setLanguage] = useState("en");

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BPN</h1>
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
              <span>Dashboard</span>
            </Button>
          </Link>
          <Button variant="ghost" className="space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </Button>
          <Button variant="ghost" className="space-x-2">
            <ChartBar className="w-4 h-4" />
            <span>Analytics</span>
          </Button>
          <Button variant="ghost" className="space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Button>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
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

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
