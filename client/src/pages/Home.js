import React from "react";
import HeroSection from "../components/HeroSection";
import BackgroundAnimations from "../components/BackgroundAnimations";
import CTAButtons from "../components/CTAButtons";
import SocialLinks from "../components/SocialLinks";
import ScrollIndicator from "../components/ScrollIndicator";

export default function Home() {
  const roles = [
    "Full Stack Developer",
    "React Enthusiast",
    "Go Developer",
    "Problem Solver",
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/ritikvaidyasen",
      icon: "🐙",
      color: "hover:text-gray-800 dark:hover:text-gray-200",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/ritikvaidyasen",
      icon: "💼",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <BackgroundAnimations />

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <HeroSection roles={roles} />
        <CTAButtons />
        <SocialLinks links={socialLinks} />
        <ScrollIndicator />
      </div>
    </div>
  );
}
