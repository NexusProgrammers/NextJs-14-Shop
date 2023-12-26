"use client"

import { CartContextProvider } from "@/hooks/useCart";
import React, { ReactNode } from "react";

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  return <CartContextProvider>{children}</CartContextProvider>;
};

export default CartProvider;
