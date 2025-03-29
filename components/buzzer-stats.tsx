import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface BuzzerStatsProps {
  analysisResult: AnalysisResult
}

export function BuzzerStats({ analysisResult }: BuzzerStatsProps) {
  const { buzzerScore, patternScore, contentScore, timingScore, suspiciousUsers, commonPhrases, detectionReasons } =
    analysisResult

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skor Buzzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Skor Total</span>
                <span className="text-sm font-medium">{buzzerScore}/100</span>
              </div>
              <Progress value={buzzerScore} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Pola Komentar</span>
                  <span className="text-sm font-medium">{patternScore}/100</span>
                </div>
                <Progress value={patternScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Konten Komentar</span>
                  <span className="text-sm font-medium">{contentScore}/100</span>
                </div>
                <Progress value={contentScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Waktu Komentar</span>
                  <span className="text-sm font-medium">{timingScore}/100</span>
                </div>
                <Progress value={timingScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Akun Mencurigakan</CardTitle>
          </CardHeader>
          <CardContent>
            {suspiciousUsers.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {suspiciousUsers.map((user, index) => (
                  <li key={index}>{user}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Tidak ada akun mencurigakan terdeteksi</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frasa Umum</CardTitle>
          </CardHeader>
          <CardContent>
            {commonPhrases.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {commonPhrases.map((phrase, index) => (
                  <li key={index}>"{phrase}"</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Tidak ada frasa umum terdeteksi</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alasan Deteksi</CardTitle>
        </CardHeader>
        <CardContent>
          {detectionReasons.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {detectionReasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Tidak ada alasan deteksi yang signifikan</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

