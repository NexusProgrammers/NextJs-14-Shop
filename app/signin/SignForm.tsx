/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";

interface SignFormProps {
  currentUser: SafeUser | null;
}

const SignInForm: React.FC<SignFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
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
    const signInResponse = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (signInResponse?.ok) {
      router.push("/cart");
      router.refresh();
      toast.success("Sign In Successfully");
    } else {
      toast.error(signInResponse?.error || "Sign In failed");
    }
  };

  if (currentUser) {
    return <p className="text-center">Sign In Already. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign Up to E-shop" />
      <Button
        outline
        label="Sign In With Google"
        icon={AiOutlineGoogle}
        onClick={() => {signIn("google")}}
      />
      <hr className="bg-slate-300 w-full h-px" />
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
        label={isLoading ? "Loading" : "Sign In"}
        onClick={handleSubmit(onsubmit)}
      />
      <p className="text-sm flex items-center gap-1">
        Don't have an account ?<Link href={"/signup"}>Sign Up</Link>
      </p>
    </>
  );
};

export default SignInForm;
