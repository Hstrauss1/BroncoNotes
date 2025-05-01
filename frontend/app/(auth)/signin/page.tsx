"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import Logo from "../../../public/Notex_Logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, isPending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      try {
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));

        if (!email.trim().toLowerCase().endsWith(".edu")) {
          toast("Email is not a .edu address");
          return;
        }

        // Sign up user using Supabase Auth
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) {
          toast(`Sign-in error: ${authError.message}`);
          return;
        }

        toast("Sign-in successful!");

        toast("User details successfully stored!");
        router.push(`/${authData.user.id}`);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast("Unexpected error occurred.");
      }
    },
    null,
  );

  return (
    <section className="min-w-80 grid gap-6">
      <hgroup className="flex items-center justify-center flex-col gap-3">
        <Image src={Logo} width={120} height={120} alt="Notex Logo" />
        <h1>Notex</h1>
        <p>Sign in to Notex</p>
      </hgroup>
      <form action={action} className="grid gap-12">
        <div className="grid gap-2">
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
          {isPending ? "Creating Account..." : "Sign In"}
        </Button>
      </form>

      <Link href={"/signup"} className="text-center text-blue-500 text-sm">
        Sign Up Here
      </Link>
    </section>
  );
}
