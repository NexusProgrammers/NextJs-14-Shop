"use client";

import { CartContextProvider } from "@/hooks/useCart";

interface CartProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

const CartProvider: React.FC<CartProviderProps> = ({ children, ...rest }) => {
  return <CartContextProvider {...rest}>{children}</CartContextProvider>;
};

export default CartProvider;
