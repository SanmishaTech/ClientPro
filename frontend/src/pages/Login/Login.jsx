import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import background from "../../images/doitBackground.avif";
import background from "../../images/angel.jpeg";
// import templeImage from '../../images/ganesh.jpeg';
// import templeImage from "../../images/temple-4.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const defaultValues = {
    email: "",
    password: "",
  };

  const formSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data.data));
      toast.success("Login successful! Welcome back.");
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        toast.error("Login failed: " + error.response.data.message); // Customize error message
        setIsLoading(false);
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
        setIsLoading(false);
      } else {
        toast.error("An error occurred while making the request.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        {/* <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "640px",
            // width: "650px",
          }}
          className="absolute inset-0 "
        /> */}
        {/* <img src={templeImage} className="absolute inset-0"  alt="" /> */}
        {/* <img
          src={background}
          className="absolute inset-0"
          style={{
            height: "640px", // Set the fixed width
            width: "700px", // Set the fixed height
            // objectFit: "contain", // Ensures the whole image is visible without stretching or cropping
          }}
        /> */}
        {/* <div className="relative h-full w-full">
          <img
            src={background}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
          />
        </div> */}
        <div className="relative pr-14 h-full w-full flex justify-center items-center">
          <img
            src={background}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="relative z-20 flex items-center text-lg font-medium text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6 text-white"
          >
            <path
              className="text-white"
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
            />
          </svg>
          {/* <img
            src={AgnelImage}
            style={{
              height: "80px", // Set the fixed width
              width: "80px", // Set the fixed height
              // objectFit: "contain", // Ensures the whole image is visible without stretching or cropping
            }}
            alt=""
          /> */}

          {/* Logo */}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            {/* <p className="text-lg text-white font-bold">Welcome To Website</p> */}
            <footer className="text-lg text-white">ClientPro</footer>
          </blockquote>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-full items-center p-4 lg:p-8 drop-shadow-md">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a> */}
              </div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter password"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm ">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Login"}
            </Button>
            {/* end */}
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
