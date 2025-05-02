import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Logo from "../../../public/Notex_Logo.svg";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const signIn = async () => {
    "use server";
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    // 2. Sign in with GitHub
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
    } else {
      return redirect(data.url);
    }
  };

  return (
    <section className="min-w-80 grid gap-6">
      <hgroup className="flex items-center justify-center flex-col gap-3">
        <Image src={Logo} width={120} height={120} alt="Notex Logo" />
        <h1>Notex</h1>
        <p>Sign in to Notex</p>
      </hgroup>
      <form action={signIn} className="grid gap-12">
        <Button type="submit">
          <LogIn />
          Sign In Using Google
        </Button>
      </form>
    </section>
  );
}
