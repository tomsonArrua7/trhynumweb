import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { VideoShowcase } from "@/components/video-showcase"
import { ScreenshotGallery } from "@/components/screenshot-gallery"
import { Gallery } from "@/components/gallery"
import { Downloads } from "@/components/downloads"
import { Wiki } from "@/components/wiki"
import { Staff } from "@/components/staff"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <ScreenshotGallery />
      <Gallery />
      <Downloads />
      <Wiki />
      <Staff />
      <Footer />
    </main>
  )
}
