"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      // Generate a unique user ID
      const userId = uuidv4();

      // Sign up user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setMessage(`Sign-up error: ${authError.message}`);
        return;
      }

      setMessage("Sign-up successful!");

      // Store user details in the custom table
      const { data: insertData, error: insertError } = await supabase
        .from("Account")
        .insert([
          {
            user_id: userId,
            email: email,
            username: username,
            password: password, // For security, store hashed passwords instead of plaintext
            points_tot: 0,
            total_uploaded: 0,
          },
        ]);

      if (insertError) {
        setMessage(`Error storing user details: ${insertError.message}`);
        return;
      }

      setMessage("User details successfully stored!");
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("Unexpected error occurred.");
    }
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-medium mb-4">App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
        className="mb-4"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          Sign Up
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
