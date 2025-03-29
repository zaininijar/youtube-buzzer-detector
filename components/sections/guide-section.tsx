import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, FileText, BarChart, AlertTriangle } from "lucide-react"

export function GuideSection() {
  return (
    <section id="panduan" className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cara Menggunakan</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Panduan langkah demi langkah untuk menggunakan Buzzer Detector
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Youtube className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>1. Ambil Komentar</CardTitle>
                <CardDescription>Scrape komentar dari video YouTube</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Masukkan URL video YouTube di tab "Scrape YouTube" dan klik "Ambil Komentar". Aplikasi akan mengambil
                hingga 500 komentar teratas dari video.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>2. Input Manual</CardTitle>
                <CardDescription>Atau masukkan komentar secara manual</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Jika Anda memiliki komentar dari sumber lain, Anda dapat menempelkannya di tab "Input Manual". Pastikan
                setiap komentar berada pada baris terpisah.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <BarChart className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>3. Analisis Pola</CardTitle>
                <CardDescription>Jalankan analisis pola komentar</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Klik "Analisis Pola Komentar" untuk memulai proses analisis. Sistem akan menganalisis pola linguistik,
                frasa umum, dan struktur komentar.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <div className="grid gap-1">
                <CardTitle>4. Interpretasi Hasil</CardTitle>
                <CardDescription>Pahami hasil analisis</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lihat hasil analisis di tab yang berbeda: Visualisasi Pola, Analisis Frasa, Analisis Sentimen, dan
                Kluster Pengguna. Skor tinggi menunjukkan kemungkinan aktivitas buzzer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

