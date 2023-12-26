import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import getOrdersById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";

interface IParams {
  orderId?: string;
}

const Order = async ({ params }: { params: IParams }) => {
  const order = await getOrdersById(params);

  if (!order) {
    return <NullData title="No order" />;
  }

  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
