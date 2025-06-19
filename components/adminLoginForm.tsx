"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { handleAdminLogin } from "@/app/api/auth";
import { z } from "zod";

export function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

  const handleLogin = async (event: SyntheticEvent) => {
    event.preventDefault();

    const InputSchema = z.object({
      email: z.string().email({ message: "Invalid email address." }),
      password: z.string().min(1, { message: "Password is required." }),
    });

    const validationResult = InputSchema.safeParse({ email, password });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        if (err.path[0] === "email") {
          setEmailErrorMessage(err.message);
        } else if (err.path[0] === "password") {
          setPasswordErrorMessage(err.message);
        }
      });
      return;
    }

    try {
      const userCredential = await handleAdminLogin(email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      setCookie("firebase_token", token);
      router.push("/admin/dashboard");
    } catch {
      setPasswordErrorMessage("Invalid credentials. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => handleLogin(event)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailErrorMessage("");
                  }}
                  className={emailErrorMessage && "border-red-500"}
                />
                {emailErrorMessage && (
                  <p className="text-red-500 text-sm">{emailErrorMessage}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordErrorMessage("");
                  }}
                  className={passwordErrorMessage && "border-red-500"}
                />
                {passwordErrorMessage && (
                  <p className="text-red-500 text-sm">{passwordErrorMessage}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
