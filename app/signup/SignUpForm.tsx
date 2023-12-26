"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface SignUpFormProps {
  currentUser: SafeUser | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  }, [currentUser, router]);

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await axios.post("/api/signup", data);

      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInResponse?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Sign Up Successfully");
      } else {
        toast.error(signInResponse?.error || "Sign In failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return <p className="text-center">Sign Up Already. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign Up for E-shop" />
      <Button
        outline
        label="Sign Up With Google"
        icon={AiOutlineGoogle}
        onClick={() => {signIn("google")}}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isLoading ? "Loading" : "Sign Up"}
        onClick={handleSubmit(onsubmit)}
      />
      <p className="text-sm flex items-center gap-1">
        Already have an account ?
        <Link className="underline" href={"/signin"}>
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUpForm;
