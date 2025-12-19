import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Hook to fetch all content
export function useContent() {
  return useQuery({
    queryKey: [api.content.list.path],
    queryFn: async () => {
      const res = await fetch(api.content.list.path);
      if (!res.ok) throw new Error("Failed to fetch content");
      return api.content.list.responses[200].parse(await res.json());
    },
    // Keep data fresh but don't refetch constantly
    staleTime: 1000 * 60 * 5, 
  });
}

// Hook to update specific content block
export function useUpdateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const res = await fetch(api.content.update.path, {
        method: api.content.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.content.update.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to update content");
      }
      return api.content.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
    },
  });
}

// Hook to submit inquiry
export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (data: { name: string; phone: string }) => {
      const validated = api.inquiries.create.input.parse(data);
      const res = await fetch(api.inquiries.create.path, {
        method: api.inquiries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
           const error = api.inquiries.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to submit inquiry");
      }
      return api.inquiries.create.responses[201].parse(await res.json());
    },
  });
}

// Hook to fetch inquiries (admin)
export function useInquiries() {
  return useQuery({
    queryKey: [api.inquiries.list.path],
    queryFn: async () => {
      const res = await fetch(api.inquiries.list.path);
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return api.inquiries.list.responses[200].parse(await res.json());
    },
  });
}
