"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import Logo from "../../public/Notex_Logo.svg";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, isPending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      try {
        // Generate a unique user ID
        // const userId = uuidv4();
        const email = String(formData.get("email"));
        const username = String(formData.get("username"));
        const password = String(formData.get("password"));

        if (!email.trim().toLowerCase().endsWith(".edu")) {
          toast("Email is not a .edu address");
          return;
        }

        // Sign up user using Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
          },
        );

        if (authError) {
          toast(`Sign-up error: ${authError.message}`);
          return;
        }

        toast("Sign-up successful!");
        const userId = authData.user?.id;
        // Store user details in the custom table
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          toast(`Error storing user details: ${insertError.message}`);
          return;
        }

        toast("User details successfully stored!");
        router.push(`/${userId}`);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast("Unexpected error occurred.");
      }
    },
    null,
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="min-w-80 grid gap-8">
        <hgroup className="flex items-center justify-center flex-col gap-3">
          <Image src={Logo} width={120} height={120} alt="Notex Logo" />
          <h1>Notex</h1>
          <p>Create an account on Notex</p>
        </hgroup>
        <form action={action} className="grid gap-12">
          <div className="grid gap-2">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <Input type="email" name="email" placeholder="Email" required />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            <LogIn />
            {isPending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </section>
    </div>
  );
}
