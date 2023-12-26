"use client";

import { CartProductType } from "@/app/product/[productId]/ProductDetails";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const btnStyles = "border[1.2px] border border-slate-300 px-2 rounded"

const SetQuantity: React.FC<SetQtyProps> = ({
  cartProduct,
  cartCounter,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : <div className="font-semibold">QUANTIFY:</div>}
      <div className="flex gap-4 items-center text-base">
        <button className={btnStyles} onClick={handleQtyDecrease}>-</button>
        <div>{cartProduct.quantity}</div>
        <button className={btnStyles} onClick={handleQtyIncrease}>+</button>
      </div>
    </div>
  );
};

export default SetQuantity;
