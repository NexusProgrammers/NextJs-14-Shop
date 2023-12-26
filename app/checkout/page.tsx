import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import CheckoutClient from "./CheckoutClient";

const Checkout = async () => {

  const currentUser = await getCurrentUser()

  return <div className="p-8">
    <Container>
      <FormWrap>
        <CheckoutClient currentUser={currentUser} />
      </FormWrap>
    </Container>
  </div>;
};

export default Checkout;
