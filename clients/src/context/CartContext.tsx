import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types";
import { useAuth } from "./authContext";
import toast from "react-hot-toast";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth(); // 2. Get the current logged-in user
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Dynamic storage key based on user ID
    const cartStorageKey = user ? `app_cart_${user.id}` : null;

    // 3. Initialize state lazily based on user status
    const [items, setItems] = useState<CartItem[]>(() => {
        if (!user) return [];
        const saved = localStorage.getItem(`app_cart_${user.id}`);
        return saved ? JSON.parse(saved) : [];
    });

    // 4. Synchronize cart state when user logs in, logs out, or switches accounts
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`app_cart_${user.id}`);
            setItems(saved ? JSON.parse(saved) : []);
        } else {
            setItems([]); // Clear the state immediately if no one is logged in
        }
    }, [user]);

    // 5. Save items to localStorage whenever items or the active user changes
    useEffect(() => {
        if (cartStorageKey) {
            localStorage.setItem(cartStorageKey, JSON.stringify(items));
        }
    }, [items, cartStorageKey]);

    const addToCart = (product: Product, quantity = 1) => {
        // Guard clause: Prevent adding items if user isn't logged in
        if (!user) {
            toast.error("Please login to add items to your cart"); // If toast is available
            return;
        }

        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        setIsCartOpen(false);
    };

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}