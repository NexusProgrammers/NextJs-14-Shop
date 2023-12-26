import Container from "@/app/components/Container";
import getProducts from "@/actions/getProduct";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrders from "@/actions/getOrders";
import OrderClient from "./OrderClient";
import getOrdersByUserId from "@/actions/getOrderByUserId";

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }

  const orders = await getOrdersByUserId(currentUser.id);

  if (!orders) {
    return <NullData title="No Orders Yet" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <OrderClient orders={orders} />
      </Container>
    </div>
  );
};

export default Orders;
