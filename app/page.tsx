import { CommentPatternAnalyzer } from "@/components/comment-pattern-analyzer"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { GuideSection } from "@/components/sections/guide-section"
import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-12">
        <HeroSection />
        <CommentPatternAnalyzer />
        <AboutSection />
        <GuideSection />
      </div>
    </MainLayout>
  )
}

