"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatternVisualizer } from "@/components/pattern-visualizer"
import { PhraseAnalysis } from "@/components/phrase-analysis"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { UserClusterAnalysis } from "@/components/user-cluster-analysis"
import { YouTubeCommentScraper } from "@/components/youtube-comment-scraper"
import { analyzeCommentPatterns } from "@/lib/pattern-analysis"
import type { Comment, PatternAnalysisResult } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/ui/container"
import { ApiKeyManager } from "@/components/api-key-manager"

export function CommentPatternAnalyzer() {
  const [inputText, setInputText] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [analysisResult, setAnalysisResult] = useState<PatternAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    setError(null)
  }

  const parseComments = (text: string): Comment[] => {
    // Simple parsing: each line is a comment
    // Format expected: "Username: Comment text" or just "Comment text"
    return text
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => {
        const parts = line.split(":")
        if (parts.length > 1) {
          const username = parts[0].trim()
          const content = parts.slice(1).join(":").trim()
          return { id: index.toString(), username, content, timestamp: new Date().toISOString() }
        } else {
          return {
            id: index.toString(),
            username: `User${index + 1}`,
            content: line.trim(),
            timestamp: new Date().toISOString(),
          }
        }
      })
  }

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError("Silakan masukkan komentar terlebih dahulu")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const parsedComments = parseComments(inputText)

      if (parsedComments.length < 3) {
        setError("Minimal diperlukan 3 komentar untuk analisis yang akurat")
        setIsAnalyzing(false)
        return
      }

      setComments(parsedComments)

      // Simulate processing time for complex analysis
      setTimeout(() => {
        const result = analyzeCommentPatterns(parsedComments)
        setAnalysisResult(result)
        setIsAnalyzing(false)
      }, 1500)
    } catch (err) {
      setError("Terjadi kesalahan saat menganalisis komentar")
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setInputText("")
    setComments([])
    setAnalysisResult(null)
    setError(null)
  }

  const stripHtml = (html: string): string => {
    // Create a temporary div element
    const temp = document.createElement("div")
    // Set the HTML content
    temp.innerHTML = html
    // Return the text content
    return temp.textContent || temp.innerText || ""
  }

  const handleYouTubeComments = (scrapedComments: Comment[]) => {
    if (scrapedComments.length === 0) {
      setError("Tidak ada komentar yang berhasil diambil dari video YouTube")
      return
    }

    const formattedComments = scrapedComments
      .map((comment) => `${comment.username}: ${stripHtml(comment.content)}`)
      .join("\n")

    setInputText(formattedComments)
  }

  return (
    <section id="analyzer" className="w-full py-6">
      <Container>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl">Analisis Komentar</CardTitle>
            <ApiKeyManager />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Input Manual</TabsTrigger>
                <TabsTrigger value="youtube">Scrape YouTube</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium mb-1">
                      Masukkan Komentar untuk Analisis Pola
                    </label>
                    <Textarea
                      id="comments"
                      placeholder="Tempel komentar di sini (satu komentar per baris, format: 'Username: Komentar' atau hanya 'Komentar')"
                      className="min-h-[200px]"
                      value={inputText}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !inputText.trim()}
                      className="flex-1 sm:flex-none"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menganalisis...
                        </>
                      ) : (
                        "Analisis Pola Komentar"
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleClear} className="flex-1 sm:flex-none">
                      Bersihkan
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="youtube" className="mt-4">
                <YouTubeCommentScraper onCommentsScraped={handleYouTubeComments} />
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isAnalyzing && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center space-x-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <div className="font-medium">Menganalisis pola komentar...</div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[100px] rounded-lg" />
                    <Skeleton className="h-[100px] rounded-lg" />
                    <Skeleton className="h-[100px] rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6 mt-8">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Ringkasan Analisis Pola</h3>
                      <p>{analysisResult.summary}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-card p-4 rounded-lg border">
                          <div className="text-2xl font-bold">{analysisResult.patternScore}/100</div>
                          <div className="text-sm text-muted-foreground">Skor Kesamaan Pola</div>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <div className="text-2xl font-bold">{analysisResult.phraseGroups.length}</div>
                          <div className="text-sm text-muted-foreground">Kelompok Frasa Terdeteksi</div>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <div className="text-2xl font-bold">{analysisResult.userClusters.length}</div>
                          <div className="text-sm text-muted-foreground">Kluster Pengguna</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="visualizer">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="visualizer">Visualisasi Pola</TabsTrigger>
                    <TabsTrigger value="phrases">Analisis Frasa</TabsTrigger>
                    <TabsTrigger value="sentiment">Analisis Sentimen</TabsTrigger>
                    <TabsTrigger value="clusters">Kluster Pengguna</TabsTrigger>
                  </TabsList>
                  <TabsContent value="visualizer" className="mt-4">
                    <PatternVisualizer comments={comments} patternGroups={analysisResult.patternGroups} />
                  </TabsContent>
                  <TabsContent value="phrases" className="mt-4">
                    <PhraseAnalysis phraseGroups={analysisResult.phraseGroups} comments={comments} />
                  </TabsContent>
                  <TabsContent value="sentiment" className="mt-4">
                    <SentimentAnalysis sentimentData={analysisResult.sentimentAnalysis} comments={comments} />
                  </TabsContent>
                  <TabsContent value="clusters" className="mt-4">
                    <UserClusterAnalysis userClusters={analysisResult.userClusters} comments={comments} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}

