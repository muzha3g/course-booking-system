"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { subscribeToAuthChanges } from "@/app/api/user";
import { useEffect, useState } from "react";
import React from "react";

interface paramsProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function Page({ params }: paramsProps) {
  const resolvedParams = React.use(params);
  const userIdSlug = resolvedParams.slug;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      console.log("onAuthStateChanged callback:", currentUser.displayName);
      setUser(currentUser.displayName);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <p>{userIdSlug}</p>

      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Hi {user}</CardTitle>
          <CardDescription>Below is your booking record.</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Booking Record</p>
        </CardContent>
      </Card>
    </div>
  );
}
