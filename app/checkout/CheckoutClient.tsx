"use client";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";
import { SafeUser } from "@/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface CheckoutClientProps {
  currentUser: SafeUser | null;
}

const CheckoutClient:React.FC<CheckoutClientProps> = ({ currentUser }) => {
  const router = useRouter();
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
      router.refresh();
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (cartProducts) {
        setLoading(true);
        setError(false);
      }
    
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartProducts,
            payment_intent_id: paymentIntent,
          }),
        });
    
        setLoading(false);
    
        if (!response.ok) {
          console.error(`Server returned status: ${response.status}`);
          return;
        }
    
        const data = await response.json();
    
        if (!data.paymentIntent || !data.paymentIntent.client_secret || !data.paymentIntent.id) {
          console.error("Invalid JSON response structure:", data);
          toast.error("Unexpected response from the server");
          return;
        }
    
        setClientSecret(data.paymentIntent.client_secret);
        handleSetPaymentIntent(data.paymentIntent.id);
      } catch (err) {
        setError(true);
        console.error("Error during fetch:", err);
        toast.error("Something went wrong");
      }
    };
    

    fetchData();
  }, [cartProducts, paymentIntent, router, handleSetPaymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const hanldeSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            hanldeSetPaymentSuccess={hanldeSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-500">Something Went Wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500 text-center">Payment Success</div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
