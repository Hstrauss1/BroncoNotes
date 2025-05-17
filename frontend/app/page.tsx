import Link from "next/link";

export default async function Home() {
  return (
    <div className="w-full h-full">
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <hgroup className="text-center">
          <h1 className="text-2xl font-medium mb-4">Notex</h1>
          <p className="text-lg text-neutral-600">
            A platform to share and discover notes.
          </p>
        </hgroup>
        <Link href={`/signin`} className="link">
          Get Started
        </Link>
      </div>
    </div>
  );
}
