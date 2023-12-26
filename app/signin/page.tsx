import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import SignInForm from "./SignForm";

const SignIn = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <FormWrap>
        <SignInForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default SignIn;
