import type { Metadata } from "next";
import "./autosend.css";
import { MicroworksNav } from "@/components/landing/microworks-nav";
import { MicroworksHero } from "@/components/landing/microworks-hero";
import { MicroworksFeatures } from "@/components/landing/microworks-features";
import { MicroworksSkills } from "@/components/landing/microworks-skills";
import { MicroworksShowcase } from "@/components/landing/microworks-showcase";
import { MicroworksMultiCampaign } from "@/components/landing/microworks-multi-campaign";
import { MicroworksSocialFaq } from "@/components/landing/microworks-social-faq";
import { MicroworksFooter } from "@/components/landing/microworks-footer";

export const metadata: Metadata = {
  title: "Microworks: Micro-tasks, Micro-wins · Monad",
  description:
    "Kill dead time. Settle micro-wins in under 2 seconds. Programmatic HTTP 402 micro-tasks, parallel consensus & instant Monad payouts.",
};

export default function HomePage() {
  return (
    <div className="font-sans bg-stone-50 min-h-screen text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      <div>
        <div className="w-full flex flex-col items-center bg-stone-50 h-full">
          {/* Sticky Header Nav */}
          <MicroworksNav />

          {/* Page Container */}
          <div className="max-w-6xl w-full">
            <div className="w-full px-4 md:px-6 pb-10">
              <div className="flex flex-col">
                <MicroworksHero />
                <MicroworksFeatures />
                <MicroworksSkills />
                <MicroworksShowcase />
                <MicroworksMultiCampaign />
                <MicroworksSocialFaq />
                <MicroworksFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}