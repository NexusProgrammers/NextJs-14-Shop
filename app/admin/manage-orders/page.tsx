import Container from "@/app/components/Container";
import getProducts from "@/actions/getProduct";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import ManageOrderClient from "./ManageOrderClient";
import getOrders from "@/actions/getOrders";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if(!currentUser || currentUser.role !== "ADMIN"){
    return <NullData title="Oops! Access Denied" />
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageOrderClient  orders={orders}/>
      </Container>
    </div>
  );
};

export default ManageOrders;
