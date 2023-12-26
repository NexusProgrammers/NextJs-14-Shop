import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

const MAX_QUANTITY = 99;

export type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (productId: string) => void;
  handleCartQtyIncrease: (productId: string) => void;
  handleCartQtyDecrease: (productId: string) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider: React.FC = (props) => {
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const cartItems: any = localStorage.getItem("e-shop-items");
    const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    const eShopPaymentIntent: any = localStorage.getItem("eShopPaymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);
    setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart: CartProductType[] | null;

      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

      localStorage.setItem("e-shop-items", JSON.stringify(updatedCart));
      return updatedCart;
    });

    setCartTotalQty((prev) => prev + product.quantity);
    setShowToast(true);
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (productId: string) => {
      if (cartProducts) {
        const removedProduct = cartProducts.find(
          (item) => item.id === productId
        );
        const filterProducts = cartProducts.filter(
          (item) => item.id !== productId
        );
        setCartProducts(filterProducts);
        localStorage.setItem("e-shop-items", JSON.stringify(filterProducts));

        if (removedProduct) {
          toast.success("Product Removed From Cart");
        }
      }
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback(
    (productId: string) => {
      if (cartProducts) {
        const updatedCart = cartProducts.map((item) =>
          item.id === productId && item.quantity < MAX_QUANTITY
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        setCartProducts(updatedCart);
        localStorage.setItem("e-shop-items", JSON.stringify(updatedCart));

        if (
          updatedCart.find((item) => item.id === productId)?.quantity ===
          MAX_QUANTITY
        ) {
          toast.error(
            `Oops! Maximum quantity reached for ${
              updatedCart.find((item) => item.id === productId)?.name
            }`
          );
        }
      }
    },
    [cartProducts]
  );

  const handleCartQtyDecrease = useCallback(
    (productId: string) => {
      if (cartProducts) {
        const updatedCart = cartProducts.map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        if (JSON.stringify(updatedCart) === JSON.stringify(cartProducts)) {
          toast.error("Quantity cannot be less than 1");
        } else {
          setCartProducts(updatedCart);
          localStorage.setItem("e-shop-items", JSON.stringify(updatedCart));
        }
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartTotalQty(0);
    setCartProducts(null);
    localStorage.removeItem("e-shop-items");
    toast.success("Cart Cleared Successfully");
  }, []);

  useEffect(() => {
    if (showToast) {
      toast.success("Product Added To Cart");
      setShowToast(false);
    }
  }, [showToast]);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem("eShopPaymentIntent", JSON.stringify(val));
  }, []);

  const value: CartContextType = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
