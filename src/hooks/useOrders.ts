import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('status', 'active');
      
      if (ordersError) throw ordersError;

      // Transform the data to match the existing structure
      const transformedOrders = orders.reduce((acc: Record<number, any>, order) => {
        acc[order.room_number] = {
          roomNumber: order.room_number,
          totalAmount: order.total_amount,
          items: order.order_items.map((item: any) => ({
            productId: item.product_id,
            quantity: item.quantity,
            product: item.product
          }))
        };
        return acc;
      }, {});

      return transformedOrders;
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ roomNumber, product }: { roomNumber: number, product: Product }) => {
      // First, find or create an active order for this room
      let { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("room_number", roomNumber)
        .eq("status", "active")
        .single();

      if (!existingOrder) {
        const { data: newOrder, error: createOrderError } = await supabase
          .from("orders")
          .insert({ room_number: roomNumber, total_amount: 0 })
          .select()
          .single();
        
        if (createOrderError) throw createOrderError;
        existingOrder = newOrder;
      }

      // Add the item to order_items
      const { error: addItemError } = await supabase
        .from("order_items")
        .insert({
          order_id: existingOrder.id,
          product_id: product.id,
          quantity: 1,
          price_at_time: product.price
        });

      if (addItemError) throw addItemError;

      // Update the order total
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("price_at_time, quantity")
        .eq("order_id", existingOrder.id);

      const newTotal = (orderItems || []).reduce((sum, item) => 
        sum + (item.price_at_time * item.quantity), 0);

      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({ total_amount: newTotal })
        .eq("id", existingOrder.id);

      if (updateOrderError) throw updateOrderError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async ({ roomNumber, productId }: { roomNumber: number, productId: number }) => {
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("room_number", roomNumber)
        .eq("status", "active")
        .single();

      if (!order) return;

      const { error: deleteError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", order.id)
        .eq("product_id", productId);

      if (deleteError) throw deleteError;

      // Update the order total
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("price_at_time, quantity")
        .eq("order_id", order.id);

      const newTotal = (orderItems || []).reduce((sum, item) => 
        sum + (item.price_at_time * item.quantity), 0);

      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({ total_amount: newTotal })
        .eq("id", order.id);

      if (updateOrderError) throw updateOrderError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const clearRoomMutation = useMutation({
    mutationFn: async (roomNumber: number) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: 'completed' })
        .eq("room_number", roomNumber)
        .eq("status", "active");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders: ordersQuery.data || {},
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    addItemToRoom: addItemMutation.mutate,
    removeItemFromRoom: removeItemMutation.mutate,
    clearRoom: clearRoomMutation.mutate,
  };
};