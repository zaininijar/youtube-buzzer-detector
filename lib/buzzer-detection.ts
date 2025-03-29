import type { Comment, AnalysisResult } from "./types"

export function analyzeBuzzerActivity(comments: Comment[]): AnalysisResult {
  if (comments.length === 0) {
    return createEmptyResult()
  }

  // Initialize scores
  let patternScore = 0
  let contentScore = 0
  let timingScore = 0
  const suspiciousUsers: string[] = []
  const commonPhrases: string[] = []
  const detectionReasons: string[] = []

  // 1. Analyze comment patterns
  const patternAnalysis = analyzePatterns(comments)
  patternScore = patternAnalysis.score
  if (patternAnalysis.suspiciousUsers.length > 0) {
    suspiciousUsers.push(...patternAnalysis.suspiciousUsers)
    detectionReasons.push(patternAnalysis.reason)
  }

  // 2. Analyze comment content
  const contentAnalysis = analyzeContent(comments)
  contentScore = contentAnalysis.score
  if (contentAnalysis.commonPhrases.length > 0) {
    commonPhrases.push(...contentAnalysis.commonPhrases)
    detectionReasons.push(contentAnalysis.reason)
  }

  // 3. Analyze timing patterns
  const timingAnalysis = analyzeTiming(comments)
  timingScore = timingAnalysis.score
  if (timingAnalysis.suspiciousUsers.length > 0) {
    // Add unique users only
    timingAnalysis.suspiciousUsers.forEach((user) => {
      if (!suspiciousUsers.includes(user)) {
        suspiciousUsers.push(user)
      }
    })
    detectionReasons.push(timingAnalysis.reason)
  }

  // Calculate overall buzzer score (weighted average)
  const buzzerScore = Math.round(patternScore * 0.4 + contentScore * 0.4 + timingScore * 0.2)

  // Generate summary
  const summary = generateSummary(buzzerScore, suspiciousUsers.length, comments.length)

  return {
    buzzerScore,
    patternScore,
    contentScore,
    timingScore,
    suspiciousUsers: [...new Set(suspiciousUsers)], // Remove duplicates
    commonPhrases,
    detectionReasons,
    summary,
  }
}

function analyzePatterns(comments: Comment[]) {
  const result = {
    score: 0,
    suspiciousUsers: [] as string[],
    reason: "",
  }

  // Count comments per user
  const userCommentCount: Record<string, number> = {}
  comments.forEach((comment) => {
    userCommentCount[comment.username] = (userCommentCount[comment.username] || 0) + 1
  })

  // Check for users with multiple similar comments
  const userComments: Record<string, string[]> = {}
  comments.forEach((comment) => {
    if (!userComments[comment.username]) {
      userComments[comment.username] = []
    }
    userComments[comment.username].push(comment.content)
  })

  // Identify suspicious users (those with multiple similar comments)
  Object.entries(userComments).forEach(([username, contents]) => {
    if (contents.length > 1) {
      // Check for similarity between comments
      const similarityScore = calculateSimilarityScore(contents)
      if (similarityScore > 70) {
        result.suspiciousUsers.push(username)
      }
    }
  })

  // Calculate pattern score based on suspicious users ratio
  const suspiciousRatio = result.suspiciousUsers.length / Object.keys(userCommentCount).length
  result.score = Math.min(100, Math.round(suspiciousRatio * 100) + (result.suspiciousUsers.length > 0 ? 30 : 0))

  if (result.suspiciousUsers.length > 0) {
    result.reason = `Terdeteksi ${result.suspiciousUsers.length} akun dengan pola komentar yang mencurigakan`
  }

  return result
}

function analyzeContent(comments: Comment[]) {
  const result = {
    score: 0,
    commonPhrases: [] as string[],
    reason: "",
  }

  // Extract phrases (3-5 words) from comments
  const phrases: Record<string, number> = {}
  const buzzwords = [
    "mantap",
    "keren",
    "hebat",
    "luar biasa",
    "top",
    "sukses",
    "bravo",
    "salut",
    "the best",
    "nomor satu",
    "terbaik",
    "joss",
    "jos",
    "oke",
    "setuju",
    "benar",
    "betul",
    "bagus",
  ]

  comments.forEach((comment) => {
    const words = comment.content.toLowerCase().split(/\s+/)

    // Check for buzzwords
    const containsBuzzwords = buzzwords.some((word) => comment.content.toLowerCase().includes(word))

    if (containsBuzzwords) {
      // Extract 3-word phrases
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(" ")
        phrases[phrase] = (phrases[phrase] || 0) + 1
      }
    }
  })

  // Find common phrases
  Object.entries(phrases)
    .filter(([_, count]) => count > 1)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .slice(0, 5)
    .forEach(([phrase]) => {
      result.commonPhrases.push(phrase)
    })

  // Calculate content score based on common phrases
  const phraseRatio =
    result.commonPhrases.length > 0
      ? comments.filter((c) => result.commonPhrases.some((phrase) => c.content.toLowerCase().includes(phrase))).length /
        comments.length
      : 0

  result.score = Math.min(100, Math.round(phraseRatio * 100) + (result.commonPhrases.length > 2 ? 40 : 0))

  if (result.commonPhrases.length > 0) {
    result.reason = `Terdeteksi ${result.commonPhrases.length} frasa umum yang sering digunakan`
  }

  return result
}

function analyzeTiming(comments: Comment[]) {
  const result = {
    score: 0,
    suspiciousUsers: [] as string[],
    reason: "",
  }

  // For this simplified version, we'll just check if many comments were posted in a short timeframe
  // In a real implementation, we would use the actual timestamps

  // Simulate time clustering by using the order of comments as a proxy for time
  const clusters: Record<number, string[]> = {}
  const clusterSize = Math.max(2, Math.floor(comments.length / 10)) // Adaptive cluster size

  comments.forEach((comment, index) => {
    const clusterIndex = Math.floor(index / clusterSize)
    if (!clusters[clusterIndex]) {
      clusters[clusterIndex] = []
    }
    clusters[clusterIndex].push(comment.username)
  })

  // Find clusters with high activity
  let suspiciousClusterCount = 0
  Object.values(clusters).forEach((usernames) => {
    const uniqueUsers = new Set(usernames)
    // If many comments in a cluster are from few unique users
    if (usernames.length > 3 && uniqueUsers.size < usernames.length * 0.7) {
      suspiciousClusterCount++
      usernames.forEach((username) => {
        if (!result.suspiciousUsers.includes(username)) {
          result.suspiciousUsers.push(username)
        }
      })
    }
  })

  // Calculate timing score
  result.score = Math.min(100, suspiciousClusterCount * 25)

  if (suspiciousClusterCount > 0) {
    result.reason = `Terdeteksi ${suspiciousClusterCount} kelompok komentar yang mencurigakan berdasarkan pola waktu`
  }

  return result
}

function calculateSimilarityScore(texts: string[]): number {
  if (texts.length <= 1) return 0

  // Simple similarity check: count how many texts contain the same words
  const wordCounts: Record<string, number> = {}

  texts.forEach((text) => {
    const words = text.toLowerCase().split(/\s+/)
    const uniqueWords = [...new Set(words)]

    uniqueWords.forEach((word) => {
      if (word.length > 3) {
        // Only count meaningful words
        wordCounts[word] = (wordCounts[word] || 0) + 1
      }
    })
  })

  // Count words that appear in multiple texts
  const repeatedWords = Object.values(wordCounts).filter((count) => count > 1).length
  const totalUniqueWords = Object.keys(wordCounts).length

  if (totalUniqueWords === 0) return 0
  return Math.round((repeatedWords / totalUniqueWords) * 100)
}

function generateSummary(score: number, suspiciousCount: number, totalCount: number): string {
  if (score > 70) {
    return `Terdeteksi aktivitas buzzer yang tinggi dengan ${suspiciousCount} dari ${totalCount} akun mencurigakan.`
  } else if (score > 40) {
    return `Terdeteksi kemungkinan aktivitas buzzer dengan beberapa pola mencurigakan.`
  } else {
    return `Tidak terdeteksi aktivitas buzzer yang signifikan.`
  }
}

function createEmptyResult(): AnalysisResult {
  return {
    buzzerScore: 0,
    patternScore: 0,
    contentScore: 0,
    timingScore: 0,
    suspiciousUsers: [],
    commonPhrases: [],
    detectionReasons: [],
    summary: "Tidak ada komentar untuk dianalisis.",
  }
}

