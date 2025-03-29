import type { Comment } from "./types"

export async function scrapeYouTubeComments(videoId: string, maxResults = 500): Promise<Comment[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    let comments: Comment[] = []
    let nextPageToken: string | undefined = undefined

    // YouTube API only returns max 100 results per page, so we need to paginate
    // to get up to 500 comments
    while (comments.length < maxResults) {
      // Build the API URL with pagination token if available
      let apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${apiKey}`
      if (nextPageToken) {
        apiUrl += `&pageToken=${nextPageToken}`
      }

      // Fetch comments from the API
      const response = await fetch(apiUrl)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("YouTube API error:", errorData)
        throw new Error(`YouTube API error: ${errorData.error?.message || "Unknown error"}`)
      }

      const data = await response.json()

      // Transform the YouTube API response into our Comment format
      const pageComments: Comment[] = data.items.map((item: any, index: number) => {
        const snippet = item.snippet.topLevelComment.snippet

        return {
          id: item.id || `comment-${comments.length + index}`,
          username: snippet.authorDisplayName || "Anonymous",
          content: snippet.textDisplay || snippet.textOriginal || "",
          timestamp: snippet.publishedAt || new Date().toISOString(),
        }
      })

      // Add the comments from this page to our collection
      comments = [...comments, ...pageComments]

      // Check if there are more pages
      nextPageToken = data.nextPageToken

      // If no more pages or we've reached our limit, break the loop
      if (!nextPageToken || pageComments.length === 0 || comments.length >= maxResults) {
        break
      }
    }

    // Trim to the requested maximum
    return comments.slice(0, maxResults)
  } catch (error) {
    console.error("Error scraping YouTube comments:", error)
    throw error
  }
}

