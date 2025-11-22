import { HeroSection } from "@/components/home/hero-section"
import { AboutBio } from "@/components/home/about-bio"
import { LatestLegitChecks } from "@/components/home/latest-legit-checks"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-12">
      <HeroSection />
      <LatestLegitChecks />
      <AboutBio />
    </div>
  )
}
