import { AlertTriangle } from "lucide-react"
import { Container } from "@/components/ui/container"

export function HeroSection() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 xl:py-20">
      <Container>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 p-2 dark:bg-primary/20">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Analisis Pola Komentar Buzzer
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Menganalisis pola linguistik dan struktur komentar untuk mendeteksi aktivitas buzzer terkoordinasi di media
            sosial
          </p>
        </div>
      </Container>
    </section>
  )
}

