// Simple cart store without external dependencies (for demo)
import { CartItem, Cart } from "@/types";

// Simple state management without zustand (for demo)
let cartState: Cart = {
  items: [],
  subtotal: 0,
  deliveryCharges: 0,
  discount: 0,
  total: 0,
};

let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const calculateTotals = () => {
  const subtotal = cartState.items.reduce((sum, item) => {
    const itemPrice = item.selectedWeight.price;
    const itemDiscount = item.menuItem.discount?.isActive
      ? item.menuItem.discount.type === "percentage"
        ? (itemPrice * item.menuItem.discount.value) / 100
        : item.menuItem.discount.value
      : 0;
    return sum + (itemPrice - itemDiscount) * item.quantity;
  }, 0);

  const total = subtotal + cartState.deliveryCharges - cartState.discount;

  cartState.subtotal = subtotal;
  cartState.total = total;
};

export const useCartStore = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    ...cartState,
    addItem: (newItem: CartItem) => {
      const existingItemIndex = cartState.items.findIndex(
        (item) =>
          item.menuItem.id === newItem.menuItem.id &&
          item.selectedWeight.weight === newItem.selectedWeight.weight
      );

      if (existingItemIndex > -1) {
        cartState.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        cartState.items.push(newItem);
      }

      calculateTotals();
      notifyListeners();
    },
    removeItem: (menuItemId: string, weight: string) => {
      cartState.items = cartState.items.filter(
        (item) =>
          !(item.menuItem.id === menuItemId && item.selectedWeight.weight === weight)
      );
      calculateTotals();
      notifyListeners();
    },
    updateQuantity: (menuItemId: string, weight: string, quantity: number) => {
      if (quantity <= 0) {
        cartState.items = cartState.items.filter(
          (item) =>
            !(item.menuItem.id === menuItemId && item.selectedWeight.weight === weight)
        );
      } else {
        const item = cartState.items.find(
          (item) =>
            item.menuItem.id === menuItemId && item.selectedWeight.weight === weight
        );
        if (item) {
          item.quantity = quantity;
        }
      }
      calculateTotals();
      notifyListeners();
    },
    updateInstructions: (menuItemId: string, weight: string, instructions: string) => {
      const item = cartState.items.find(
        (item) =>
          item.menuItem.id === menuItemId && item.selectedWeight.weight === weight
      );
      if (item) {
        item.specialInstructions = instructions;
      }
      notifyListeners();
    },
    clearCart: () => {
      cartState = {
        items: [],
        subtotal: 0,
        deliveryCharges: 0,
        discount: 0,
        total: 0,
      };
      notifyListeners();
    },
    setDeliveryCharges: (charges: number) => {
      cartState.deliveryCharges = charges;
      calculateTotals();
      notifyListeners();
    },
    calculateTotals,
  };
};

// Hook imports (for demo - these would normally come from React)
import { useState, useEffect } from "react";
