"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Comment, PatternGroup } from "@/lib/types"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Skeleton } from "@/components/ui/skeleton"

interface PatternVisualizerProps {
  comments: Comment[]
  patternGroups: PatternGroup[]
}

export function PatternVisualizer({ comments, patternGroups }: PatternVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !mounted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = isMobile ? 400 : 500

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw pattern visualization
    const isDarkMode = resolvedTheme === "dark"
    drawPatternVisualization(ctx, canvas.width, canvas.height, comments, patternGroups, isDarkMode)
  }, [comments, patternGroups, resolvedTheme, mounted, isMobile])

  const drawPatternVisualization = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    comments: Comment[],
    patternGroups: PatternGroup[],
    isDarkMode: boolean,
  ) => {
    // Background
    ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = isDarkMode ? "#333333" : "#e2e8f0"
    ctx.lineWidth = 1

    // Horizontal lines
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Vertical lines
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }

    if (comments.length === 0) return

    // Map comments to positions
    const commentPositions = new Map<string, { x: number; y: number }>()
    const commentRadius = isMobile ? 8 : 10
    const padding = isMobile ? 30 : 40

    // Assign positions in a grid layout
    const cols = Math.ceil(Math.sqrt(comments.length))
    const cellWidth = (width - padding * 2) / cols
    const cellHeight = (height - padding * 2) / Math.ceil(comments.length / cols)

    comments.forEach((comment, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      commentPositions.set(comment.id, {
        x: padding + col * cellWidth + cellWidth / 2,
        y: padding + row * cellHeight + cellHeight / 2,
      })
    })

    // Draw connections between similar comments
    patternGroups.forEach((group, groupIndex) => {
      // Generate a color for this pattern group
      const hue = (groupIndex * 137) % 360 // Golden angle to distribute colors
      const color = `hsl(${hue}, 70%, 60%)`

      ctx.strokeStyle = color
      ctx.lineWidth = 2

      // Draw lines between comments in the same pattern group
      for (let i = 0; i < group.commentIds.length; i++) {
        for (let j = i + 1; j < group.commentIds.length; j++) {
          const pos1 = commentPositions.get(group.commentIds[i])
          const pos2 = commentPositions.get(group.commentIds[j])

          if (pos1 && pos2) {
            ctx.beginPath()
            ctx.moveTo(pos1.x, pos1.y)
            ctx.lineTo(pos2.x, pos2.y)
            ctx.stroke()
          }
        }
      }
    })

    // Draw comment nodes
    comments.forEach((comment) => {
      const pos = commentPositions.get(comment.id)
      if (!pos) return

      // Find which pattern groups this comment belongs to
      const belongsToGroups = patternGroups.filter((group) => group.commentIds.includes(comment.id))

      if (belongsToGroups.length > 0) {
        // Use the color of the first group it belongs to
        const groupIndex = patternGroups.indexOf(belongsToGroups[0])
        const hue = (groupIndex * 137) % 360
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      } else {
        // No pattern group
        ctx.fillStyle = isDarkMode ? "#666666" : "#94a3b8"
      }

      // Draw circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, commentRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = isDarkMode ? "#333333" : "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw username
      ctx.fillStyle = isDarkMode ? "#ffffff" : "#1e293b"
      ctx.font = isMobile ? "8px sans-serif" : "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        comment.username.length > 10 ? comment.username.substring(0, 10) + "..." : comment.username,
        pos.x,
        pos.y + commentRadius + 12,
      )
    })

    // Draw legend
    const legendX = width - (isMobile ? 150 : 200)
    const legendY = 30

    ctx.fillStyle = isDarkMode ? "#ffffff" : "#1e293b"
    ctx.font = `bold ${isMobile ? 10 : 12}px sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("Kelompok Pola:", legendX, legendY)

    patternGroups.forEach((group, index) => {
      const hue = (index * 137) % 360
      const color = `hsl(${hue}, 70%, 60%)`

      const y = legendY + 20 + index * (isMobile ? 16 : 20)

      // Color box
      ctx.fillStyle = color
      ctx.fillRect(legendX, y - (isMobile ? 8 : 10), isMobile ? 8 : 10, isMobile ? 8 : 10)

      // Group name
      ctx.fillStyle = isDarkMode ? "#ffffff" : "#1e293b"
      ctx.font = `${isMobile ? 8 : 12}px sans-serif`
      ctx.fillText(`Pola ${index + 1} (${group.commentIds.length})`, legendX + (isMobile ? 16 : 20), y)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualisasi Pola Komentar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md overflow-hidden">
            {!mounted ? (
              <Skeleton className="w-full" style={{ height: isMobile ? "400px" : "500px" }} />
            ) : (
              <canvas ref={canvasRef} className="w-full" style={{ height: isMobile ? "400px" : "500px" }} />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Visualisasi menunjukkan hubungan antar komentar berdasarkan kesamaan pola. Komentar yang terhubung
              memiliki struktur atau frasa yang serupa.
            </p>
          </div>
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Pola Terdeteksi</h3>
            {patternGroups.length > 0 ? (
              <div className="space-y-4">
                {patternGroups.map((group, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">
                      Pola {index + 1} ({group.commentIds.length} komentar)
                    </h4>
                    <p className="text-sm mb-2">{group.patternDescription}</p>
                    <div className="bg-muted p-2 rounded text-sm">
                      <code>{group.patternTemplate}</code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada pola signifikan yang terdeteksi</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

