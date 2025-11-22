"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { TypeAnimation } from "react-type-animation"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-md box-glow">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          SYSTEM_ONLINE v2.0.4
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-glow block mb-2">FULL_STACK</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">
            DEVELOPER
          </span>
        </h1>

        <div className="mb-8 h-12 text-xl text-muted-foreground md:text-2xl">
          <TypeAnimation
            sequence={[
              "Buduję nowoczesne aplikacje webowe",
              1000,
              "Integruję systemy bazodanowe",
              1000,
              "Tworzę bezpieczne rozwiązania",
              1000,
              "Koduję przyszłość",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Number.POSITIVE_INFINITY}
            className="font-mono"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background hover:shadow-[0_0_30px_var(--primary)] transition-all duration-300"
          >
            <Link href="/legit-checks">
              <span className="relative z-10 flex items-center gap-2">
                SPRAWDŹ LEGITKI <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-secondary text-secondary hover:bg-secondary hover:text-background box-glow bg-transparent"
          >
            <Link href="#projects">ZOBACZ PROJEKTY</Link>
          </Button>
        </div>
      </div>

      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(circle at center, black, transparent 80%)",
        }}
      ></div>
    </section>
  )
}
