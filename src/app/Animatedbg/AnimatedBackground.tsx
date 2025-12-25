"use client";
import Lottie from "lottie-react";
import animationData from "../../assets/animated-bg.json";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full h-full"
      />
    </div>
  );
}
