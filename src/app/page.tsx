"use client";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      Hello World!
      <Button
      onClick={() => alert("Button clicked!")}
      className="mt-4">Click Me</Button>
    </div>
  );
}
