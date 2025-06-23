import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { ProgramForm } from "@/components/admin/program-form";
import { EnhancedTableBuilder } from "@/components/admin/enhanced-table-builder";
import { ColumnHeaderManager } from "@/components/admin/column-header-manager";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrograms, useDeleteProgram } from "@/hooks/use-programs";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Archive,
  Users,
  Activity,
  FileText,
  Database,
  LogOut,
  RefreshCw,
  Image
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
  width: "full" | "half";
  height: "small" | "medium" | "large";
}

function AnalyticsAdminPanel() {
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([]);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load chart configurations
  const { data: savedConfigs, refetch } = useQuery<ChartConfig[]>({
    queryKey: ["/api/analytics/charts"],
    initialData: [],
  });

  useEffect(() => {
    if (savedConfigs) {
      setChartConfigs(savedConfigs);
    }
  }, [savedConfigs]);

  const saveChartMutation = useMutation({
    mutationFn: async (configs: ChartConfig[]) => {
      const response = await fetch("/api/analytics/charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charts: configs }),
      });
      if (!response.ok) throw new Error("Failed to save chart configuration");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({ description: "Chart configuration saved successfully" });
    },
    onError: () => {
      toast({ 
        variant: "destructive",
        description: "Failed to save chart configuration" 
      });
    }
  });

  const handleSaveChart = (chartConfig: ChartConfig) => {
    const updatedConfigs = editingChart
      ? chartConfigs.map(c => c.id === editingChart.id ? chartConfig : c)
      : [...chartConfigs, { ...chartConfig, id: Date.now().toString() }];
    
    setChartConfigs(updatedConfigs);
    saveChartMutation.mutate(updatedConfigs);
    setEditingChart(null);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteChart = (chartId: string) => {
    if (confirm("Are you sure you want to delete this chart?")) {
      const updatedConfigs = chartConfigs.filter(c => c.id !== chartId);
      setChartConfigs(updatedConfigs);
      saveChartMutation.mutate(updatedConfigs);
    }
  };

  const handleEditChart = (chart: ChartConfig) => {
    setEditingChart(chart);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Analytics Dashboard Control
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure charts, manage data sources, and control analytics visualization
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chart Configurations</h3>
            {chartConfigs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No charts configured. Create your first chart to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chartConfigs.map((chart) => (
                  <Card key={chart.id} className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {chart.type.toUpperCase()}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditChart(chart)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteChart(chart.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-sm">{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div>Source: {chart.dataSource}</div>
                        <div>Size: {chart.width} × {chart.height}</div>
                        {chart.description && (
                          <div className="truncate">{chart.description}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Data Source Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Source Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Program Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Programs:</span>
                      <Badge variant="outline">{programs?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Programs:</span>
                      <Badge variant="outline">
                        {programs?.filter(p => p.status === 'active').length || 0}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Chart Rendering</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Charts:</span>
                      <Badge variant="outline">{chartConfigs.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Sources:</span>
                      <Badge variant="outline">
                        {new Set(chartConfigs.map(c => c.dataSource)).size}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Database className="w-3 h-3 mr-1" />
                      Export Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Creation/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChart ? "Edit Chart" : "Create New Chart"}
            </DialogTitle>
          </DialogHeader>
          <ChartConfigForm
            initialConfig={editingChart}
            onSave={handleSaveChart}
            onCancel={() => {
              setEditingChart(null);
              setIsCreateDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
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

  const CHART_TYPES = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "area", label: "Area Chart" },
  ];

  const DATA_SOURCES = [
    { value: "programs", label: "Programs Overview" },
    { value: "monthlyProgress", label: "Monthly Progress" },
    { value: "programTypes", label: "Program Types" },
    { value: "statusDistribution", label: "Status Distribution" },
    { value: "budget", label: "Budget Analysis" },
    { value: "participants", label: "Participants Data" },
  ];

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

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  const { isAuthenticated, isAdmin, logout, isLoading: authLoading } = useAuth();
  const { data: programs, isLoading } = usePrograms();
  const deleteProgram = useDeleteProgram();
  const { toast } = useToast();

  const handleLoginSuccess = () => {
    // Component will re-render with authenticated state
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  const filteredPrograms = programs?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteProgram.mutateAsync(id);
        toast({ description: "Program deleted successfully" });
      } catch (error) {
        toast({ 
          variant: "destructive",
          description: "Failed to delete program" 
        });
      }
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProgram(null);
  };

  // Transform programs data for enhanced table
  const programTableData = programs?.map(program => ({
    id: program.id,
    name: program.name,
    type: program.type,
    description: program.description || "",
    status: program.status,
    progress: program.progress,
    participants: program.participants,
    budgetAllocated: program.budgetAllocated || 0,
    budgetUsed: program.budgetUsed || 0,
    color: program.color,
    image: program.imageUrl || program.image || "",
    category: program.category || "",
    priority: program.priority || "medium",
    startDate: program.startDate,
    endDate: program.endDate,
  })) || [];

  const customTableActions = [
    {
      label: "View",
      icon: Activity,
      onClick: (row: any) => {
        const program = programs?.find(p => p.id === row.id);
        if (program) handleEdit(program);
      },
      variant: "outline" as const,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage programs and system configurations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Program
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
                  <p className="text-2xl font-bold">{programs?.length || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Programs</p>
                  <p className="text-2xl font-bold">
                    {programs?.filter(p => p.status === 'active').length || 0}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold">
                    {programs?.reduce((sum, p) => sum + (p.participants || 0), 0) || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(programs?.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0) || 0)}
                  </p>
                </div>
                <Database className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Control</TabsTrigger>
            <TabsTrigger value="table-builder">Enhanced Table</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-6">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Programs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Program Management</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrograms.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {(program.imageUrl || program.image) ? (
                                <img 
                                  src={program.imageUrl || program.image || ""} 
                                  alt={program.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              ) : (
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: program.color }}
                                >
                                  <Image className="h-5 w-5 text-white" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{program.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {program.description ? program.description.substring(0, 50) + "..." : "No description"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{program.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={program.status === 'active' ? 'default' : 'secondary'}
                            >
                              {program.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${program.progress}%`,
                                    backgroundColor: program.color 
                                  }}
                                />
                              </div>
                              <span className="text-sm">{program.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {program.participants}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatCurrency(program.budgetUsed || 0)}</div>
                              <div className="text-muted-foreground">
                                of {formatCurrency(program.budgetAllocated || 0)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {program.startDate ? formatDate(program.startDate) : "TBD"} - 
                              {program.endDate ? formatDate(program.endDate) : "TBD"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(program)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(program.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Control Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsAdminPanel />
          </TabsContent>

          {/* Enhanced Table Builder Tab */}
          <TabsContent value="table-builder">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Enhanced Table Builder
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fully customizable table with sortable columns, inline editing, and advanced features
                </p>
              </CardHeader>
              <CardContent>
                <EnhancedTableBuilder
                  tableName="programs"
                  data={programTableData}
                  onEdit={(row) => {
                    const program = programs?.find(p => p.id === row.id);
                    if (program) handleEdit(program);
                  }}
                  onDelete={(id) => handleDelete(Number(id))}
                  customActions={customTableActions}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground">
                  User management interface will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <ColumnHeaderManager />
          </TabsContent>
        </Tabs>

        {/* Program Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedProgram ? (
                  <>
                    <Edit className="h-5 w-5" />
                    Edit Program: {selectedProgram.name}
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Create New Program
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <ProgramForm program={selectedProgram} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}