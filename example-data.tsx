"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExampleData() {
  const exampleComments = `Budi123: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Siti_Fans: Keren banget! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Ahmad45: Hebat! Pemimpin terbaik sepanjang masa. Teruskan perjuangan!
Joko_Real: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Dewi_Cantik: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Rudi87: Saya sangat setuju dengan kebijakan ini, akan membawa perubahan positif
Mawar22: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Anita_Lover: Keren banget! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Tono_Asli: Saya kurang setuju dengan kebijakan ini, masih banyak aspek yang perlu dipertimbangkan
Bambang99: Hebat! Pemimpin terbaik sepanjang masa. Teruskan perjuangan!
Dina_Real: Menurut saya ini perlu dikaji lebih dalam, ada beberapa dampak yang belum dipertimbangkan
Faisal_01: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Ratna45: Keren banget! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Gunawan_88: Saya punya pendapat berbeda, kebijakan ini bisa berdampak negatif untuk beberapa sektor
Hasan_True: Hebat! Pemimpin terbaik sepanjang masa. Teruskan perjuangan!
Indah_Pretty: Mantap sekali! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Joko_Santoso: Ini adalah langkah yang tepat untuk kemajuan bangsa, tapi perlu pengawasan ketat dalam implementasinya
Kartini_Modern: Keren banget! Pemimpin terbaik sepanjang masa. Lanjutkan pak!
Lukman_Wise: Saya mengapresiasi upaya ini, semoga bisa dijalankan dengan baik dan transparan
Maya_Sweet: Hebat! Pemimpin terbaik sepanjang masa. Teruskan perjuangan!`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleComments)
    alert("Contoh komentar telah disalin ke clipboard!")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contoh Data Komentar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[300px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{exampleComments}</pre>
          </div>
          <Button onClick={copyToClipboard}>Salin Contoh Komentar</Button>
          <div className="text-sm text-muted-foreground">
            <p>Salin komentar di atas dan tempel di area input aplikasi untuk melihat hasil deteksi buzzer.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

