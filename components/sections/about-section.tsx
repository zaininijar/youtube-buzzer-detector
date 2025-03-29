import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, BarChart2, Users, MessageSquare } from "lucide-react"
import { Container } from "@/components/ui/container"

export function AboutSection() {
  return (
    <section id="tentang" className="w-full py-12">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tentang Buzzer Detector</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Alat analisis canggih untuk mendeteksi aktivitas buzzer terkoordinasi di platform media sosial
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <AlertCircle className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>Deteksi Pola</CardTitle>
                <CardDescription>Mengidentifikasi pola komentar yang mencurigakan</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Algoritma kami menganalisis struktur komentar, frasa umum, dan pola linguistik untuk mendeteksi
                aktivitas buzzer yang terkoordinasi.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <BarChart2 className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>Visualisasi Data</CardTitle>
                <CardDescription>Melihat pola dengan visualisasi interaktif</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualisasi grafik interaktif membantu Anda memahami hubungan antar komentar dan mengidentifikasi
                kluster aktivitas yang mencurigakan.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>Analisis Pengguna</CardTitle>
                <CardDescription>Mengidentifikasi kluster pengguna mencurigakan</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistem kami mengelompokkan pengguna berdasarkan pola komentar mereka, membantu mengidentifikasi jaringan
                akun yang mungkin dikoordinasikan.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>Analisis Sentimen</CardTitle>
                <CardDescription>Mendeteksi anomali dalam sentimen komentar</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analisis sentimen membantu mengidentifikasi distribusi sentimen yang tidak wajar, yang sering menjadi
                indikator aktivitas buzzer.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  )
}

