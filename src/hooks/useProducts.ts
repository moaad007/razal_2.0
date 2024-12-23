import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      return data;
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error("Error adding product:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    data: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    addProduct: addProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
  };
};