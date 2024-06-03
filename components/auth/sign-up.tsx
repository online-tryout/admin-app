"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import GoogleLogo from "./google-logo";
import { FC } from "react";
import useAuthStore from "@/store/useAuthStore";
import { google, signin, signup } from "@/app/auth/action";
import { useGoogleLogin } from "@react-oauth/google";
import { User } from "@/models/model";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

interface SignupForm {
  email: string;
  name: string;
  password: string;
}

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("email is not valid").required("email is required"),
  name: Yup.string().required("name is required"),
  password: Yup.string()
    .min(8, "password should have at least 8 character length")
    .matches(/[a-z]/, "password must include lowercase characters")
    .matches(/[A-Z]/, "password must include uppercase characters")
    .matches(/[0-9]/, "password must include a number")
    .required("password is required"),
});

const SignUp: FC = () => {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();

  const signupWithCredentialHandler = async (
    values: SignupForm,
    { setSubmitting }: FormikHelpers<SignupForm>
  ) => {
    setSubmitting(true);
    try {
      const { accessToken, user } = await signup(
        values.email,
        values.name,
        values.password
      );
      toast({
        title: "Success",
        description: "Admin " + values.email + " successfully registered.",
        variant: "default",
      });
    } catch (err: any) {
      errorLoginHandler()
    }
    setSubmitting(false);
  };

  const errorLoginHandler = () => {
    toast({
      title: "Error",
      description: "failed to sign in",
      variant: "destructive",
    });
  };

  const signupWithGoogleHandler = useGoogleLogin({
    onSuccess: async ({ access_token: googleToken }) => {
      try {
        const { accessToken, user } = await google(googleToken);
        successfullyLoginHandler(user, accessToken);
      } catch (err: any) {}
    },
    onError: () => {},
    flow: "implicit",
  });

  const successfullyLoginHandler = (user: User, accessToken: string) => {
    setUser({
      name: user.name,
      id: user.uid,
      email: user.email,
      image: user.avatar,
    });
    // setAccessToken(accessToken);
    toast({
      title: "Success",
      description: "success to sign in",
      variant: "default",
    });
    router.push("/");
  };

  return (
    <Card className="flex flex-col grow h-full">
      {/* Header */}
      <CardHeader>
        <div className="mt-5 flex flex-col space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Register new admin account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Fill the form bellow to regiter a new admin account
          </CardDescription>
        </div>
      </CardHeader>

      {/* Body */}
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="grid gap-6">
          <Formik
            initialValues={{
              email: "",
              name: "",
              password: "",
            }}
            onSubmit={signupWithCredentialHandler}
            validationSchema={SignupSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label
                      className="sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Field
                      name="email"
                      id="email"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="name@example.com"
                      type="email"
                    />
                    <div className="px-4 text-xs text-red-500">
                      <ErrorMessage name="email" />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label
                      className="sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <Field
                      name="name"
                      id="name"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="name"
                      type="text"
                    />
                    <div className="px-4 text-xs text-red-500">
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label
                      className="sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Field
                      name="password"
                      id="password"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="password"
                      type="password"
                    />
                    <div className="px-4 text-xs text-red-500">
                      <ErrorMessage name="password" />
                    </div>
                  </div>
                  <Button
                    disabled={isSubmitting}
                    className="disable:cursor-not-allowed inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        />
                        <span>Loading...</span>
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          
        </div>
      </div>

      
    </Card>
  );
};

SignUp.displayName = "Sign In";
export default SignUp;
