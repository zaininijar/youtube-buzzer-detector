import type { Comment } from "./types"

// In a real implementation, this would use the YouTube Data API
// For this demo, we're simulating the API response

export async function fetchYouTubeComments(videoId: string, maxResults = 100): Promise<Comment[]> {
  try {
    // This would be a real API call in a production application
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}`);
    // const data = await response.json();

    // For this demo, we'll simulate the API response
    const comments = await simulateYouTubeComments(videoId, maxResults)

    return comments
  } catch (error) {
    console.error("Error fetching YouTube comments:", error)
    throw new Error("Failed to fetch YouTube comments")
  }
}

async function simulateYouTubeComments(videoId: string, maxResults: number): Promise<Comment[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate fake comments based on the video ID
  const commentCount = Math.min(maxResults, Math.floor(Math.random() * 50) + 20)
  const comments: Comment[] = []

  // Generate usernames
  const usernames = [
    "YouTubeFan",
    "VideoEnthusiast",
    "ContentLover",
    "MediaWatcher",
    "StreamViewer",
    "DigitalNomad",
    "TechGuru",
    "InternetUser",
    "OnlineViewer",
    "WebSurfer",
    "ChannelSubscriber",
    "CommentSection",
  ]

  // Generate comment templates
  const commentTemplates = [
    "Great video! I really enjoyed the part about [TOPIC].",
    "I've been following this channel for years. This is [QUALITY] content!",
    "Can't believe [TOPIC] is still relevant in [YEAR].",
    "First time watching, but definitely subscribing after this [QUALITY] video!",
    "[CREATOR] always makes the best content about [TOPIC].",
    "I disagree with the point about [TOPIC], but overall great video.",
    "This is exactly what I needed to learn about [TOPIC]!",
    "Watching this at [TIME] and it's still [QUALITY]!",
    "Who else is here after the [EVENT] happened?",
    "The editing in this video is [QUALITY]!",
  ]

  // Generate some fake topics based on the video ID
  const topics = [
    "technology",
    "programming",
    "web development",
    "AI",
    "machine learning",
    "data science",
    "blockchain",
    "cryptocurrency",
    "gaming",
    "reviews",
    "tutorials",
    "how-to guides",
    "explanations",
    "analysis",
    "news",
  ]

  // Generate some fake quality adjectives
  const qualities = [
    "amazing",
    "excellent",
    "outstanding",
    "incredible",
    "superb",
    "fantastic",
    "wonderful",
    "brilliant",
    "exceptional",
    "top-notch",
  ]

  // Generate some fake years
  const years = ["2023", "2024", "2025"]

  // Generate some fake times
  const times = ["3 AM", "midnight", "lunch break", "work", "school", "2 AM", "during class", "during a meeting"]

  // Generate some fake events
  const events = [
    "announcement",
    "controversy",
    "update",
    "release",
    "launch",
    "interview",
    "podcast",
    "livestream",
    "conference",
    "meetup",
  ]

  // Generate some fake creator names
  const creators = [
    "the creator",
    "the host",
    "the presenter",
    "the YouTuber",
    "the channel owner",
    "this channel",
    "this creator",
    "this team",
    "these guys",
    "this person",
  ]

  // Generate some buzzer-like comments (similar patterns)
  const buzzerTemplates = [
    "This is the best content I've seen! [CREATOR] deserves more subscribers!",
    "Absolutely amazing video! [CREATOR] is the best at explaining [TOPIC]!",
    "Incredible content as always! [CREATOR] never disappoints with [TOPIC] videos!",
    "This channel deserves millions of subscribers! Best [TOPIC] content out there!",
    "I always learn so much from [CREATOR]'s videos about [TOPIC]! Subscribed!",
  ]

  // Add some normal comments
  for (let i = 0; i < commentCount * 0.7; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000)
    let commentTemplate = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]

    // Replace placeholders
    commentTemplate = commentTemplate
      .replace("[TOPIC]", topics[Math.floor(Math.random() * topics.length)])
      .replace("[QUALITY]", qualities[Math.floor(Math.random() * qualities.length)])
      .replace("[YEAR]", years[Math.floor(Math.random() * years.length)])
      .replace("[TIME]", times[Math.floor(Math.random() * times.length)])
      .replace("[EVENT]", events[Math.floor(Math.random() * events.length)])
      .replace("[CREATOR]", creators[Math.floor(Math.random() * creators.length)])

    comments.push({
      id: `comment-${i}`,
      username,
      content: commentTemplate,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random timestamp within last 30 days
    })
  }

  // Add some buzzer-like comments (similar patterns from different users)
  const buzzerCount = Math.floor(commentCount * 0.3) // 30% of comments are buzzer-like
  const buzzerTopic = topics[Math.floor(Math.random() * topics.length)]
  const buzzerCreator = creators[Math.floor(Math.random() * creators.length)]

  for (let i = 0; i < buzzerCount; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000)
    let commentTemplate = buzzerTemplates[Math.floor(Math.random() * buzzerTemplates.length)]

    // Replace placeholders but use the same topic and creator for all buzzer comments
    commentTemplate = commentTemplate.replace("[TOPIC]", buzzerTopic).replace("[CREATOR]", buzzerCreator)

    comments.push({
      id: `buzzer-${i}`,
      username,
      content: commentTemplate,
      timestamp: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(), // Buzzer comments are more recent (within 2 days)
    })
  }

  // Shuffle the comments
  return comments.sort(() => Math.random() - 0.5)
}

