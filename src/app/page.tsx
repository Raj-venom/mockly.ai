"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";


export default function Home() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()


  const handleSignIn = async () => {
    setIsLoading(true);
    try {

      const { } = await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: (e) => {
          alert("Sign in successful!");
          console.log("Sign in successful:", e);
          refetch(); // Refetch the session to update the UI
        }
      })

    } catch (error: any) {
      console.error("Error during sign in:", error);
      alert("Sign in failed: " + error.message);

    } finally {
      setIsLoading(false);
    }

  }



  const onSignUp = async () => {
    setIsLoading(true);

    try {

      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      },
        {
          onSuccess: (e) => {
            alert("Sign up successful!");
            console.log("Sign up successful:", e);
          }
        }

      )

      if (error) {
        console.error("Sign up error:", error);
        alert("Sign up failed: " + error.message);
        return;
      }

      console.log("Sign up data:", data);

    } catch (error) {
      console.error("Error during sign up:", error);

    } finally {
      setIsLoading(false);
    }


  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h1>
        <p className="mb-4">You are logged in with email: {session.user.email}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <div>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />

        <Button
          onClick={onSignUp}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </div>
      <div>
        <h1>Sign In</h1>
        <Input placeholder="Email" className="mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" className="mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="mb-4"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </div>
    </div>
  );
}
