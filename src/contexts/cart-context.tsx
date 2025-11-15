"use client";

import {
  addToCart as addToCartAction,
  Cart,
  createCart,
  getCart,
  removeFromCart as removeFromCartAction,
  updateCartLine,
} from "@/lib/cart";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartId = localStorage.getItem("shopify_cart_id");
      if (cartId) {
        loadCart(cartId);
      }
    }
  }, []);

  const loadCart = async (cartId: string) => {
    try {
      setIsLoading(true);
      const cartData = await getCart(cartId);
      if (cartData) {
        setCart(cartData);
      } else {
        localStorage.removeItem("shopify_cart_id");
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      let currentCart = cart;

      if (!currentCart) {
        const newCart = await createCart();
        if (!newCart) {
          throw new Error("Failed to create cart");
        }
        currentCart = newCart;
        localStorage.setItem("shopify_cart_id", newCart.id);
        setCart(newCart);
      }

      const updatedCart = await addToCartAction(
        currentCart.id,
        variantId,
        quantity
      );

      if (updatedCart) {
        setCart(updatedCart);
        setIsOpen(true); // Ouvrir le panier après ajout
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeLine = async (lineId: string) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const updatedCart = await removeFromCartAction(cart.id, lineId);

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeLine,
        openCart,
        closeCart,
        isOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
