"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string | null;
};

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: string, size?: string | null) => void;
    updateQuantity: (id: string, quantity: number, size?: string | null) => void;
    clearCart: () => void;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Simpan ke local storage setiap kali ada perubahan pada cart
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (product: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.size === product.size);
            if (existing) {
                return prev.map((item) =>
                    (item.id === product.id && item.size === product.size)
                        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                        : item
                );
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string, size?: string | null) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string, quantity: number, size?: string | null) => {
        setCart((prev) =>
            prev.map((item) =>
                (item.id === id && item.size === size)
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, isCartOpen, setIsCartOpen, isInitialized }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};