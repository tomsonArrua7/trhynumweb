import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Downloads } from "@/components/downloads"
import { Wiki } from "@/components/wiki"
import { Staff } from "@/components/staff"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Downloads />
      <Wiki />
      <Staff />
      <Footer />
    </main>
  )
}
