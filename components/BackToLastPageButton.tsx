"use client";

import { Button } from "@/components/ui/button";
export default function BackToLastPageButton() {
  const handleBackButtonClick = () => {
    window.history.back();
  };
  return (
    <Button onClick={handleBackButtonClick} variant={"secondary"}>
      Back
    </Button>
  );
}
