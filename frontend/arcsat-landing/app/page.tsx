import Hero from "../components/Hero"
import Features from "../components/Features"
import Infrastructure from "../components/Infrastructure"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F17] text-white">
      <Hero />
      <Features />
      <Infrastructure />
      <Footer />
    </main>
  )
}
