"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { CommentList } from "@/components/comment-list"
import { BuzzerStats } from "@/components/buzzer-stats"
import { analyzeBuzzerActivity } from "@/lib/buzzer-detection"
import type { Comment, AnalysisResult } from "@/lib/types"

export function CommentAnalyzer() {
  const [inputText, setInputText] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
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
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    const parsedComments = parseComments(inputText)
    setComments(parsedComments)

    // Simulate processing time
    setTimeout(() => {
      const result = analyzeBuzzerActivity(parsedComments)
      setAnalysisResult(result)
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleClear = () => {
    setInputText("")
    setComments([])
    setAnalysisResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Masukkan Komentar
              </label>
              <Textarea
                id="comments"
                placeholder="Tempel komentar di sini (satu komentar per baris, format: 'Username: Komentar' atau hanya 'Komentar')"
                className="min-h-[200px]"
                value={inputText}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputText.trim()}>
                {isAnalyzing ? "Menganalisis..." : "Analisis Komentar"}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Bersihkan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <div className="space-y-6">
          <Alert
            variant={
              analysisResult.buzzerScore > 70 ? "destructive" : analysisResult.buzzerScore > 40 ? "default" : "success"
            }
          >
            {analysisResult.buzzerScore > 70 ? (
              <AlertCircle className="h-4 w-4" />
            ) : analysisResult.buzzerScore > 40 ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {analysisResult.buzzerScore > 70
                ? "Terdeteksi Aktivitas Buzzer Tinggi"
                : analysisResult.buzzerScore > 40
                  ? "Terdeteksi Kemungkinan Aktivitas Buzzer"
                  : "Aktivitas Buzzer Rendah"}
            </AlertTitle>
            <AlertDescription>
              Skor Buzzer: {analysisResult.buzzerScore}/100. {analysisResult.summary}
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="comments">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Komentar</TabsTrigger>
              <TabsTrigger value="analysis">Analisis Detail</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4">
              <CommentList comments={comments} suspiciousUsers={analysisResult.suspiciousUsers} />
            </TabsContent>
            <TabsContent value="analysis" className="mt-4">
              <BuzzerStats analysisResult={analysisResult} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

