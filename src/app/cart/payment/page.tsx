import React from "react";
import CartMenu from "@/components/Sections/Cart/CartMenu";
import { CartProvider } from "@/components/Sections/Game/CartHandler";
import PaymentContent from "@/components/Sections/Cart/PaymentContent";

const Payment = () => {
  return (
    <CartProvider>
      <CartMenu activeItem="payment" />
      <PaymentContent />
    </CartProvider>
  );
};

export default Payment;
