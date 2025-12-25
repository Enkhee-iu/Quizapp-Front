"use client";
import { useUser } from "@clerk/nextjs";
import AnimatedBackground from "./Animatedbg/AnimatedBackground";
import MainPage from "./main/page";
export default function Home() {
  const { user } = useUser();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      {user ? <MainPage /> : <AnimatedBackground />}
    </div>
  );
}
