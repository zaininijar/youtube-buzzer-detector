import { NextResponse } from "next/server"
import { scrapeYouTubeComments } from "@/lib/youtube-scraper"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")
  const maxResults = searchParams.get("maxResults") ? Number.parseInt(searchParams.get("maxResults")!) : 500
  const apiKey = searchParams.get("apiKey")

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId parameter" }, { status: 400 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: "Missing apiKey parameter" }, { status: 400 })
  }

  try {
    const comments = await scrapeYouTubeComments(videoId, maxResults, apiKey)

    return NextResponse.json({ comments })
  } catch (error: any) {
    console.error("Error fetching YouTube comments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch YouTube comments" }, { status: 500 })
  }
}

