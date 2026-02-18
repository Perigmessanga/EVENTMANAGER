import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, TicketType, Event } from '@/types';
import { CURRENCY } from '@/config/api';

interface CartState {
  items: CartItem[];
  total: number;
  currency: string;
  isOpen: boolean;
}

interface CartActions {
  addItem: (event: Event, ticketType: TicketType, quantity: number) => void;
  removeItem: (ticketTypeId: string) => void;
  updateQuantity: (ticketTypeId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getItemCount: () => number;
  getItemByTicketType: (ticketTypeId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      total: 0,
      currency: CURRENCY.code,
      isOpen: false,

      // Actions
      addItem: (event: Event, ticketType: TicketType, quantity: number) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          item => item.ticketTypeId === ticketType.id
        );

        let newItems: CartItem[];

        if (existingIndex > -1) {
          // Update existing item
          newItems = items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: Math.min(item.quantity + quantity, ticketType.maxPerOrder) }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            ticketTypeId: ticketType.id,
            ticketTypeName: ticketType.name,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            quantity: Math.min(quantity, ticketType.maxPerOrder),
            unitPrice: ticketType.price,
            currency: ticketType.currency,
          };
          newItems = [...items, newItem];
        }

        set({
          items: newItems,
          total: calculateTotal(newItems),
        });
      },

      removeItem: (ticketTypeId: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.ticketTypeId !== ticketTypeId);
        
        set({
          items: newItems,
          total: calculateTotal(newItems),
        });
      },

      updateQuantity: (ticketTypeId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(ticketTypeId);
          return;
        }

        const { items } = get();
        const newItems = items.map(item =>
          item.ticketTypeId === ticketTypeId
            ? { ...item, quantity }
            : item
        );

        set({
          items: newItems,
          total: calculateTotal(newItems),
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemByTicketType: (ticketTypeId: string) => {
        return get().items.find(item => item.ticketTypeId === ticketTypeId);
      },
    }),
    {
      name: 'tikerama-cart',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        currency: state.currency,
      }),
    }
  )
);
