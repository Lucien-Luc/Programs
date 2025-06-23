import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation, useLanguage } from "@/components/navigation";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartBar,
  Plus,
  Edit,
  Trash2,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import type { Program } from "@shared/schema";

interface ChartConfig {
  id: string;
  title: string;
  type: "bar" | "line" | "pie" | "area";
  dataSource: string;
  xAxis?: string;
  yAxis?: string;
  color: string;
  description?: string;
  filters?: Record<string, any>;
  width: "full" | "half";
  height: "small" | "medium" | "large";
}

interface AnalyticsData {
  programs: Program[];
  totalParticipants: number;
  totalBudget: number;
  activePrograms: number;
  completionRate: number;
  monthlyProgress: Array<{ month: string; progress: number; budget: number; participants: number }>;
  programTypes: Array<{ type: string; count: number; budget: number }>;
  statusDistribution: Array<{ status: string; count: number; value: number }>;
}

const CHART_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", 
  "#ff00ff", "#00ffff", "#ff0000", "#0000ff", "#ffff00"
];

const CHART_TYPES = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "area", label: "Area Chart" },
];

const DATA_SOURCES = [
  { value: "programs", label: "Programs Overview" },
  { value: "progressAnalysis", label: "Progress Analysis" },
  { value: "budgetUtilization", label: "Budget Utilization" },
  { value: "participantGrowth", label: "Participant Growth" },
  { value: "programPerformance", label: "Program Performance" },
  { value: "statusDistribution", label: "Status Distribution" },
  { value: "typeComparison", label: "Type Comparison" },
];

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([]);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  // Fetch programs data
  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Load saved chart configurations
  const { data: savedConfigs } = useQuery<ChartConfig[]>({
    queryKey: ["/api/analytics/charts"],
    initialData: [],
  });

  // Load analytics data
  const { data: customData = [] } = useQuery({
    queryKey: ["/api/analytics/data"],
    initialData: [],
  });

  // Initialize with meaningful default charts if none exist
  useEffect(() => {
    if (savedConfigs && savedConfigs.length === 0) {
      const defaultCharts: ChartConfig[] = [
        {
          id: "progress-analysis",
          title: "Program Progress Analysis",
          type: "bar",
          dataSource: "progressAnalysis",
          xAxis: "name",
          yAxis: "progress",
          color: "#8884d8",
          width: "half",
          height: "medium",
          description: "Current progress of all programs"
        },
        {
          id: "budget-utilization",
          title: "Budget Utilization by Program",
          type: "line",
          dataSource: "budgetUtilization",
          xAxis: "name",
          yAxis: "utilization",
          color: "#82ca9d",
          width: "half",
          height: "medium",
          description: "Budget usage efficiency across programs"
        },
        {
          id: "status-distribution",
          title: "Program Status Distribution",
          type: "pie",
          dataSource: "statusDistribution",
          color: "#ffc658",
          width: "half",
          height: "medium",
          description: "Programs by current status"
        },
        {
          id: "performance-metrics",
          title: "Overall Program Performance",
          type: "area",
          dataSource: "programPerformance",
          xAxis: "name",
          yAxis: "score",
          color: "#ff7300",
          width: "full",
          height: "large",
          description: "Comprehensive performance scoring"
        }
      ];
      setChartConfigs(defaultCharts);
    } else {
      setChartConfigs(savedConfigs || []);
    }
  }, [savedConfigs]);

  // Calculate analytics data
  const analyticsData: AnalyticsData = {
    programs,
    totalParticipants: programs.reduce((sum, p) => sum + (p.participants || 0), 0),
    totalBudget: programs.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0),
    activePrograms: programs.filter(p => p.status === 'active').length,
    completionRate: programs.length > 0 ? 
      (programs.filter(p => p.status === 'completed').length / programs.length) * 100 : 0,
    
    monthlyProgress: [
      { month: "Jan", progress: 65, budget: 85000, participants: 120 },
      { month: "Feb", progress: 72, budget: 92000, participants: 145 },
      { month: "Mar", progress: 78, budget: 88000, participants: 160 },
      { month: "Apr", progress: 85, budget: 95000, participants: 180 },
      { month: "May", progress: 88, budget: 102000, participants: 195 },
      { month: "Jun", progress: 92, budget: 98000, participants: 210 },
    ],
    
    programTypes: [
      { type: "CORE", count: programs.filter(p => p.type === 'CORE').length, 
        budget: programs.filter(p => p.type === 'CORE').reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) },
      { type: "RIN", count: programs.filter(p => p.type === 'RIN').length,
        budget: programs.filter(p => p.type === 'RIN').reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) },
      { type: "AGUKA", count: programs.filter(p => p.type === 'AGUKA').length,
        budget: programs.filter(p => p.type === 'AGUKA').reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) },
      { type: "i-ACC", count: programs.filter(p => p.type === 'i-ACC').length,
        budget: programs.filter(p => p.type === 'i-ACC').reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) },
      { type: "MCF", count: programs.filter(p => p.type === 'MCF').length,
        budget: programs.filter(p => p.type === 'MCF').reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) },
    ].filter(item => item.count > 0),
    
    statusDistribution: [
      { status: "Active", count: programs.filter(p => p.status === 'active').length, value: 0 },
      { status: "Paused", count: programs.filter(p => p.status === 'paused').length, value: 0 },
      { status: "Completed", count: programs.filter(p => p.status === 'completed').length, value: 0 },
      { status: "Cancelled", count: programs.filter(p => p.status === 'cancelled').length, value: 0 },
    ].map(item => ({ ...item, value: item.count })).filter(item => item.count > 0),
  };



  // Load real-time data for different sources
  const { data: progressData } = useQuery({
    queryKey: ["/api/analytics/data/progressAnalysis"],
    enabled: chartConfigs.some(c => c.dataSource === "progressAnalysis")
  });

  const { data: budgetData } = useQuery({
    queryKey: ["/api/analytics/data/budgetUtilization"],
    enabled: chartConfigs.some(c => c.dataSource === "budgetUtilization")
  });

  const { data: participantData } = useQuery({
    queryKey: ["/api/analytics/data/participantGrowth"],
    enabled: chartConfigs.some(c => c.dataSource === "participantGrowth")
  });

  const { data: performanceData } = useQuery({
    queryKey: ["/api/analytics/data/programPerformance"],
    enabled: chartConfigs.some(c => c.dataSource === "programPerformance")
  });

  const { data: statusData } = useQuery({
    queryKey: ["/api/analytics/data/statusDistribution"],
    enabled: chartConfigs.some(c => c.dataSource === "statusDistribution")
  });

  const { data: typeData } = useQuery({
    queryKey: ["/api/analytics/data/typeComparison"],
    enabled: chartConfigs.some(c => c.dataSource === "typeComparison")
  });

  const getChartData = (dataSource: string) => {
    switch (dataSource) {
      case "programs": return analyticsData.programs;
      case "progressAnalysis": return progressData || [];
      case "budgetUtilization": return budgetData || [];
      case "participantGrowth": return participantData || [];
      case "programPerformance": return performanceData || [];
      case "statusDistribution": return statusData || analyticsData.statusDistribution;
      case "typeComparison": return typeData || analyticsData.programTypes;
      case "custom": return customData;
      default: return [];
    }
  };

  const renderChart = (config: ChartConfig) => {
    const data = getChartData(config.dataSource);
    const height = config.height === "small" ? 200 : config.height === "large" ? 400 : 300;

    switch (config.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.yAxis} fill={config.color} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={config.yAxis} stroke={config.color} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={config.yAxis} stroke={config.color} fill={config.color} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChartBar className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold mb-2">{t("analytics_title")}</h1>
                <p className="text-blue-100 text-lg">
                  {t("analytics_subtitle")}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white hover:text-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                {t ? t("export_report") : "Export Report"}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.location.href = '/admin'}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Charts
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("total_programs")}</p>
                  <p className="text-2xl font-bold">{analyticsData.programs.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("active_programs")}</p>
                  <p className="text-2xl font-bold">{analyticsData.activePrograms}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("total_participants")}</p>
                  <p className="text-2xl font-bold">{analyticsData.totalParticipants.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("total_budget")}</p>
                  <p className="text-2xl font-bold">${analyticsData.totalBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartConfigs.map((config) => (
            <div
              key={config.id}
              className={config.width === "full" ? "lg:col-span-2" : ""}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{config.title}</CardTitle>
                    {config.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {config.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Admin Only
                  </div>
                </CardHeader>
                <CardContent>
                  {renderChart(config)}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {chartConfigs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ChartBar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Charts Configured</h3>
              <p className="text-muted-foreground mb-4">
                Charts can only be configured by administrators. Please contact your admin to set up charts.
              </p>
              <Button onClick={() => window.location.href = '/admin'}>
                <Settings className="w-4 h-4 mr-2" />
                Go to Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function ChartConfigForm({ 
  initialConfig, 
  onSave, 
  onCancel 
}: { 
  initialConfig?: ChartConfig | null;
  onSave: (config: ChartConfig) => void;
  onCancel: () => void;
}) {
  const [config, setConfig] = useState<Partial<ChartConfig>>(
    initialConfig || {
      title: "",
      type: "bar",
      dataSource: "programs",
      xAxis: "",
      yAxis: "",
      color: "#8884d8",
      width: "half",
      height: "medium",
      description: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.title && config.type && config.dataSource) {
      onSave(config as ChartConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Chart Title</Label>
          <Input
            id="title"
            value={config.title || ""}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Enter chart title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Chart Type</Label>
          <Select
            value={config.type}
            onValueChange={(value: any) => setConfig({ ...config, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataSource">Data Source</Label>
          <Select
            value={config.dataSource}
            onValueChange={(value) => setConfig({ ...config, dataSource: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATA_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Chart Color</Label>
          <Input
            id="color"
            type="color"
            value={config.color || "#8884d8"}
            onChange={(e) => setConfig({ ...config, color: e.target.value })}
          />
        </div>
      </div>

      {config.type !== "pie" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="xAxis">X-Axis Field</Label>
            <Input
              id="xAxis"
              value={config.xAxis || ""}
              onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
              placeholder="e.g., month, type, status"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yAxis">Y-Axis Field</Label>
            <Input
              id="yAxis"
              value={config.yAxis || ""}
              onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
              placeholder="e.g., count, progress, budget"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Chart Width</Label>
          <Select
            value={config.width}
            onValueChange={(value: any) => setConfig({ ...config, width: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="half">Half Width</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Chart Height</Label>
          <Select
            value={config.height}
            onValueChange={(value: any) => setConfig({ ...config, height: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={config.description || ""}
          onChange={(e) => setConfig({ ...config, description: e.target.value })}
          placeholder="Brief description of what this chart shows"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialConfig ? "Update Chart" : "Create Chart"}
        </Button>
      </div>
    </form>
  );
}