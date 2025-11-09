"use client";

import LandingHeader from "./components/LandingHeader";
import LandingNavbar from "./components/LandingNavbar";
import LandingBody from "./components/Landingbody";
import LandingFooter from "./components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <LandingNavbar />
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </div>
  );
}
