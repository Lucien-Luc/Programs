import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Program, InsertProgram, Activity, InsertActivity } from "@shared/schema";

export function usePrograms() {
  return useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
}

export function useProgram(id: number) {
  return useQuery<Program>({
    queryKey: ["/api/programs", id],
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (program: InsertProgram) => {
      const response = await apiRequest("POST", "/api/programs", program);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, program }: { id: number; program: Partial<InsertProgram> }) => {
      const response = await apiRequest("PUT", `/api/programs/${id}`, program);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs", id] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/programs/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
  });
}

export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
}

export function useProgramActivities(programId: number) {
  return useQuery<Activity[]>({
    queryKey: ["/api/programs", programId, "activities"],
    enabled: !!programId,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: InsertActivity) => {
      const response = await apiRequest("POST", "/api/activities", activity);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });
}
