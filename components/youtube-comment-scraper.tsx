"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Youtube } from "lucide-react"
import type { Comment } from "@/lib/types"

interface YouTubeCommentScraperProps {
  onCommentsScraped: (comments: Comment[]) => void
}

export function YouTubeCommentScraper({ onCommentsScraped }: YouTubeCommentScraperProps) {
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commentCount, setCommentCount] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value)
    setError(null)
  }

  const extractVideoId = (url: string): string | null => {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/
    const match = url.match(regExp)

    if (match && match[2].length === 11) {
      return match[2]
    } else if (url.length === 11) {
      // If the input is just the video ID
      return url
    }

    return null
  }

  const handleScrape = async () => {
    setError(null)
    setIsLoading(true)
    setCommentCount(null)

    try {
      const videoId = extractVideoId(videoUrl)

      if (!videoId) {
        setError("URL video YouTube tidak valid. Pastikan format URL benar.")
        setIsLoading(false)
        return
      }

      // Call our API route to fetch comments with maxResults=500
      const response = await fetch(`/api/youtube-comments?videoId=${videoId}&maxResults=500`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch comments")
      }

      const data = await response.json()
      const comments: Comment[] = data.comments

      if (comments.length === 0) {
        setError("Tidak ada komentar yang ditemukan atau komentar dinonaktifkan untuk video ini.")
        setIsLoading(false)
        return
      }

      setCommentCount(comments.length)
      onCommentsScraped(comments)
    } catch (err: any) {
      console.error("Error scraping comments:", err)
      setError(err.message || "Terjadi kesalahan saat mengambil komentar. Pastikan URL valid dan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="youtube-url" className="block text-sm font-medium">
          URL Video YouTube
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={handleInputChange}
              disabled={isLoading}
              className="pl-10"
            />
          </div>
          <Button onClick={handleScrape} disabled={isLoading || !videoUrl.trim()} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengambil...
              </>
            ) : (
              "Ambil Komentar"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {commentCount && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>
            Berhasil mengambil {commentCount} komentar dari video YouTube. Komentar telah ditambahkan ke area input.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Catatan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Masukkan URL video YouTube lengkap (contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ)</li>
              <li>Scraper akan mengambil hingga 500 komentar teratas dari video</li>
              <li>Komentar yang diambil akan otomatis dimasukkan ke area input untuk dianalisis</li>
              <li>Proses ini mungkin memakan waktu lebih lama untuk video dengan banyak komentar</li>
              <li>Perhatikan bahwa pengambilan banyak komentar akan menggunakan lebih banyak kuota API YouTube</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

