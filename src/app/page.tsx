"use client";
import { useUser } from "@clerk/nextjs";
import AnimatedBackground from "./Animatedbg/AnimatedBackground";
import MainPage from "./main/page";

import SidenavBar from "./main/SidenavBar";
export default function Home() {
  const { user } = useUser();
  return (
  <div className="flex min-h-screen">
  {/* Navbar — зүүн тал */}
 <SidenavBar/>
  {/* Main content */}
  <div className="flex flex-1  justify-center pt-12 bg-zinc-50 font-sans">
    {user ? <MainPage /> : <AnimatedBackground />}
  </div>
</div>

  );
}
