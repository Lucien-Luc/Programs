import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema } from "@shared/schema";
import { useCreateProgram, useUpdateProgram } from "@/hooks/use-programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Upload, X, Plus, Lightbulb, Check, ChevronsUpDown } from "lucide-react";
import type { Program, InsertProgram, ProgramSuggestion } from "@shared/schema";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Enhanced form schema with proper validation (removed budget, category, priority fields)
const formSchema = insertProgramSchema.omit({
  budgetAllocated: true,
  budgetUsed: true,
  category: true,
  priority: true,
}).extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  partner: z.string().optional(),
  documentUrl: z.string().optional(),
  documentName: z.string().optional(),
  documentType: z.string().optional(),
  name: z.string().min(1, "Program name is required"),
  color: z.string().min(1, "Color is required"),
  status: z.string().min(1, "Status is required"),
  progress: z.number().min(0).max(100),
  participants: z.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

// Program types removed - each program is now independent

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];



const colorOptions = [
  { value: "#4A90A4", label: "Ocean Breeze" },
  { value: "#E67E22", label: "Sunset Orange" },
  { value: "#27AE60", label: "Forest Green" },
  { value: "#8E44AD", label: "Royal Purple" },
  { value: "#3498DB", label: "Sky Blue" },
  { value: "#F39C12", label: "Golden Yellow" },
  { value: "#E74C3C", label: "Crimson Red" },
  { value: "#95A5A6", label: "Storm Gray" },
  { value: "#2ECC71", label: "Emerald Green" },
  { value: "#E91E63", label: "Rose Pink" },
];

// Icon options removed - focusing on image uploads for visual representation

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
}

export function ProgramForm({ program, onClose }: ProgramFormProps) {
  const { toast } = useToast();
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  
  const [suggestions, setSuggestions] = useState<ProgramSuggestion[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      progress: 0,
      participants: 0,
      partner: "",
      color: "#4A90A4",
      icon: "bullseye", // Default icon for compatibility
      startDate: "",
      endDate: "",
      image: "",
      imageUrl: "",
      documentUrl: "",
      documentName: "",
      documentType: "",
      tags: [],
      metadata: {},
    },
  });

  // Fetch suggestions based on keyword
  const { data: keywordSuggestions } = useQuery({
    queryKey: ['/api/program-suggestions', searchKeyword],
    queryFn: async () => {
      if (!searchKeyword || searchKeyword.length < 2) return [];
      const response = await fetch(`/api/program-suggestions?keyword=${encodeURIComponent(searchKeyword)}`);
      if (response.ok) {
        return response.json();
      }
      return [];
    },
    enabled: searchKeyword.length >= 2,
  });

  useEffect(() => {
    if (program) {
      const resetData = {
        name: program.name || "",
        description: program.description || "",
        status: program.status || "active",
        progress: program.progress || 0,
        participants: program.participants || 0,
        budgetAllocated: program.budgetAllocated || 0,
        budgetUsed: program.budgetUsed || 0,
        color: program.color || "#4A90A4",
        icon: program.icon || "bullseye",
        startDate: program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : "",
        endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : "",
        image: program.image || "",
        imageUrl: program.imageUrl || "",
        tags: program.tags || [],
        category: program.category || "",
        priority: (program.priority as "low" | "medium" | "high") || "medium",
        metadata: program.metadata || {},
      };
      form.reset(resetData);
      setImageUrl(program.imageUrl || "");
      setTags(program.tags || []);
    }
  }, [program, form]);

  // Watch name field for intelligent suggestions
  const watchedName = form.watch("name");
  useEffect(() => {
    if (watchedName && watchedName.length >= 2) {
      setSearchKeyword(watchedName);
    }
  }, [watchedName]);

  const handleSuggestionSelect = (suggestion: ProgramSuggestion) => {
    form.setValue("name", suggestion.name);
    form.setValue("description", suggestion.description || "");
    form.setValue("category", suggestion.category || "");
    form.setValue("priority", (suggestion.priority as "low" | "medium" | "high") || "medium");
    form.setValue("color", suggestion.defaultColor || "#4A90A4");
    // Icon removed - using default for compatibility
    if (suggestion.tags) {
      setTags(suggestion.tags);
      form.setValue("tags", suggestion.tags);
    }
    setShowSuggestions(false);
    toast({ description: "Program template applied successfully" });
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      const newTags = [...tags, currentTag];
      setTags(newTags);
      form.setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        setUploadProgress(10);
        
        // Import image utilities
        const { fileToBase64, validateImageFile, compressImage, base64ToDataUrl } = await import('@/lib/imageUtils');
        
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        setUploadProgress(30);
        
        // Compress image if needed
        const processedFile = await compressImage(file);
        setUploadProgress(50);
        
        // Convert to base64
        const imageData = await fileToBase64(processedFile);
        setUploadProgress(80);
        
        // Create data URL for preview
        const dataUrl = base64ToDataUrl(imageData.data, imageData.type);
        
        // Update form with image data
        setSelectedImage(dataUrl);
        form.setValue("imageData", imageData.data);
        form.setValue("imageName", imageData.name);
        form.setValue("imageType", imageData.type);
        form.setValue("imageUrl", dataUrl); // For immediate preview
        
        setUploadProgress(100);
        toast({ description: "Image processed and ready to save! Will be stored in database." });
      } catch (error) {
        console.error('Image processing error:', error);
        toast({ 
          variant: "destructive", 
          description: error instanceof Error ? error.message : "Failed to process image. Please try again." 
        });
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setIsUploadingDocument(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setDocumentUrl(result.documentUrl);
        form.setValue("documentUrl", result.documentUrl);
        form.setValue("documentName", result.documentName);
        form.setValue("documentType", result.documentType);
        
        toast({
          title: "Document uploaded successfully",
          description: `${result.documentName} has been uploaded.`,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting form data:", data);
      
      const programData: InsertProgram = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        tags: tags,
        imageUrl: imageUrl,
      };

      // Remove undefined fields to avoid validation issues
      Object.keys(programData).forEach(key => {
        if (programData[key as keyof InsertProgram] === undefined) {
          delete programData[key as keyof InsertProgram];
        }
      });

      if (program) {
        await updateProgram.mutateAsync({ id: program.id, program: programData });
        toast({ description: "Program updated successfully" });
      } else {
        await createProgram.mutateAsync(programData);
        toast({ description: "Program created successfully" });
      }

      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ 
        variant: "destructive",
        description: "Failed to save program. Please check all required fields." 
      });
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-1">
          {/* Intelligent Suggestions */}
          {keywordSuggestions && keywordSuggestions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Suggestions based on your input:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((suggestion: ProgramSuggestion) => (
                  <Button
                    key={suggestion.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="text-xs"
                  >
                    {suggestion.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Program Information</h3>
            
            {/* Basic Information Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter program name" 
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Partner Organization</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter partner organization name"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Describe the program objectives and activities"
                        className="min-h-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Program Details Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Program Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        min="0"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Timeline & Dates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Visual Identity Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">Visual Identity</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Color *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Image</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="text-center">
                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Uploading... {Math.round(uploadProgress)}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : selectedImage || imageUrl ? (
                      <div className="space-y-2">
                        <img 
                          src={selectedImage || imageUrl} 
                          alt="Program preview" 
                          className="w-24 h-16 object-cover rounded-lg mx-auto"
                        />
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Image ready
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-3xl">📸</div>
                        <div className="text-sm text-muted-foreground">
                          Upload program image
                        </div>
                      </div>
                    )}
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="mt-3 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="partner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Organization</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter partner organization name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tags and Documentation Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Additional Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tags Management */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag} 
                    variant="outline"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X
                        className="h-3 w-3 ml-1"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Documentation</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload supporting documents, proposals, or guidelines. Maximum file size: 10MB.</p>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="text-center">
                    {isUploadingDocument ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Uploading document...</div>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : documentUrl ? (
                      <div className="space-y-2">
                        <div className="text-2xl">✅</div>
                        <div className="text-sm text-green-600 font-medium">Document uploaded</div>
                        <div className="text-xs text-gray-500">{form.getValues("documentName")}</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-2xl">📄</div>
                        <div className="text-sm text-muted-foreground">Upload document</div>
                      </div>
                    )}
                    
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedDocument(file);
                          handleDocumentUpload(file);
                        }
                      }}
                      disabled={isUploadingDocument}
                      className="mt-3 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createProgram.isPending || updateProgram.isPending}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {createProgram.isPending || updateProgram.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : program ? (
                "Update Program"
              ) : (
                "Create Program"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}