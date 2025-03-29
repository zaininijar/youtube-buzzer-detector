import type { Comment, PatternAnalysisResult, PatternGroup, PhraseGroup, UserCluster } from "./types"

export function analyzeCommentPatterns(comments: Comment[]): PatternAnalysisResult {
  if (comments.length === 0) {
    return createEmptyResult()
  }

  // 1. Analyze structural patterns in comments
  const patternGroups = identifyPatternGroups(comments)

  // 2. Identify common phrases
  const phraseGroups = identifyPhraseGroups(comments)

  // 3. Analyze sentiment distribution
  const sentimentAnalysis = analyzeSentiment(comments)

  // 4. Identify user clusters
  const userClusters = identifyUserClusters(comments, patternGroups, phraseGroups)

  // Calculate overall pattern score
  const patternScore = calculatePatternScore(patternGroups, phraseGroups, userClusters, comments.length)

  // Generate summary
  const summary = generateSummary(patternScore, patternGroups, phraseGroups, userClusters, comments.length)

  return {
    patternScore,
    patternGroups,
    phraseGroups,
    sentimentAnalysis,
    userClusters,
    summary,
  }
}

function identifyPatternGroups(comments: Comment[]): PatternGroup[] {
  const patternGroups: PatternGroup[] = []
  const processedComments = new Set<string>()

  // For each comment, try to find similar comments
  comments.forEach((comment, index) => {
    if (processedComments.has(comment.id)) return

    const similarComments = findSimilarComments(comment, comments.slice(index + 1))
    if (similarComments.length > 0) {
      // Add the original comment to the group
      similarComments.unshift(comment)

      // Extract pattern template
      const patternTemplate = extractPatternTemplate(similarComments)

      // Create pattern group
      const patternGroup: PatternGroup = {
        commentIds: similarComments.map((c) => c.id),
        patternTemplate,
        patternDescription: generatePatternDescription(patternTemplate),
        similarity: calculateSimilarityScore(similarComments.map((c) => c.content)),
      }

      patternGroups.push(patternGroup)

      // Mark these comments as processed
      similarComments.forEach((c) => processedComments.add(c.id))
    }
  })

  return patternGroups
}

function findSimilarComments(comment: Comment, otherComments: Comment[]): Comment[] {
  const similarComments: Comment[] = []
  const commentWords = comment.content.toLowerCase().split(/\s+/)

  otherComments.forEach((otherComment) => {
    const otherWords = otherComment.content.toLowerCase().split(/\s+/)

    // Calculate similarity based on word overlap and structure
    const similarity = calculateSimilarity(commentWords, otherWords)

    // If similarity is above threshold, consider it similar
    if (similarity > 0.7) {
      similarComments.push(otherComment)
    }
  })

  return similarComments
}

function calculateSimilarity(words1: string[], words2: string[]): number {
  // Simple Jaccard similarity
  const set1 = new Set(words1)
  const set2 = new Set(words2)

  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  // Length similarity factor
  const lengthSimilarity = 1 - Math.abs(words1.length - words2.length) / Math.max(words1.length, words2.length)

  // Word order similarity (simplified)
  let orderSimilarity = 0
  if (words1.length > 3 && words2.length > 3) {
    // Check if first and last few words are similar
    const firstWordsSimilar = words1[0] === words2[0] || words1[1] === words2[1]
    const lastWordsSimilar =
      words1[words1.length - 1] === words2[words2.length - 1] || words1[words1.length - 2] === words2[words2.length - 2]

    orderSimilarity = firstWordsSimilar && lastWordsSimilar ? 1 : 0.5
  }

  // Combined similarity score
  const jaccardSimilarity = intersection.size / union.size
  return jaccardSimilarity * 0.5 + lengthSimilarity * 0.3 + orderSimilarity * 0.2
}

function extractPatternTemplate(comments: Comment[]): string {
  if (comments.length === 0) return ""

  // Use the first comment as base
  const baseWords = comments[0].content.split(/\s+/)
  const template: string[] = [...baseWords]

  // Compare with other comments to find common structure
  for (let i = 1; i < comments.length; i++) {
    const currentWords = comments[i].content.split(/\s+/)

    // Update template - replace non-matching words with placeholders
    for (let j = 0; j < Math.min(template.length, currentWords.length); j++) {
      if (template[j] !== currentWords[j]) {
        // Check if it's a name, number, or specific entity
        if (isSpecificEntity(template[j]) && isSpecificEntity(currentWords[j])) {
          template[j] = "[ENTITY]"
        } else {
          template[j] = "[WORD]"
        }
      }
    }

    // Truncate template if current comment is shorter
    if (currentWords.length < template.length) {
      template.length = currentWords.length
    }
  }

  return template.join(" ")
}

function isSpecificEntity(word: string): boolean {
  // Check if word is likely a name, number, or specific entity
  return (
    /^[A-Z]/.test(word) || // Starts with capital letter
    /\d/.test(word) || // Contains a number
    word.length <= 2
  ) // Very short words like "di", "ke", etc.
}

function generatePatternDescription(template: string): string {
  // Count placeholders
  const wordPlaceholders = (template.match(/\[WORD\]/g) || []).length
  const entityPlaceholders = (template.match(/\[ENTITY\]/g) || []).length

  if (wordPlaceholders === 0 && entityPlaceholders === 0) {
    return "Komentar identik"
  } else if (wordPlaceholders === 0 && entityPlaceholders > 0) {
    return `Komentar dengan struktur identik, hanya berbeda pada ${entityPlaceholders} entitas`
  } else if (entityPlaceholders === 0) {
    return `Komentar dengan ${wordPlaceholders} variasi kata, namun struktur serupa`
  } else {
    return `Komentar dengan struktur serupa, terdapat ${wordPlaceholders + entityPlaceholders} variasi`
  }
}

function identifyPhraseGroups(comments: Comment[]): PhraseGroup[] {
  const phraseGroups: PhraseGroup[] = []
  const minPhraseLength = 3 // Minimum words in a phrase
  const maxPhraseLength = 6 // Maximum words in a phrase

  // Extract all possible phrases
  const phraseMap: Map<string, Set<string>> = new Map()

  comments.forEach((comment) => {
    const words = comment.content.toLowerCase().split(/\s+/)

    // Extract phrases of different lengths
    for (let length = minPhraseLength; length <= Math.min(maxPhraseLength, words.length); length++) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(" ")

        // Skip very short phrases or those with only common words
        if (isCommonPhrase(phrase)) continue

        if (!phraseMap.has(phrase)) {
          phraseMap.set(phrase, new Set())
        }
        phraseMap.get(phrase)?.add(comment.id)
      }
    }
  })

  // Filter phrases that appear in multiple comments
  Array.from(phraseMap.entries())
    .filter(([_, commentIds]) => commentIds.size >= 2)
    .sort(([_, idsA], [__, idsB]) => idsB.size - idsA.size)
    .slice(0, 10) // Take top 10 most frequent phrases
    .forEach(([phrase, commentIds]) => {
      phraseGroups.push({
        phrase,
        commentIds: Array.from(commentIds),
        frequency: commentIds.size,
      })
    })

  return phraseGroups
}

function isCommonPhrase(phrase: string): boolean {
  // List of common phrases to ignore
  const commonPhrases = [
    "saya rasa",
    "menurut saya",
    "saya pikir",
    "saya kira",
    "yang sangat",
    "yang tidak",
    "yang akan",
    "yang sudah",
    "dan juga",
    "tetapi juga",
    "karena itu",
    "oleh karena",
  ]

  return commonPhrases.some((common) => phrase.includes(common)) || phrase.length < 10 // Very short phrases
}

function analyzeSentiment(comments: Comment[]) {
  // Simple sentiment analysis based on keyword matching
  const positiveWords = [
    "bagus",
    "baik",
    "hebat",
    "keren",
    "mantap",
    "sukses",
    "berhasil",
    "luar biasa",
    "terbaik",
    "setuju",
    "mendukung",
    "bravo",
    "salut",
  ]

  const negativeWords = [
    "buruk",
    "jelek",
    "gagal",
    "hancur",
    "kecewa",
    "rugi",
    "bodoh",
    "payah",
    "tidak setuju",
    "menolak",
    "protes",
    "bohong",
    "tipu",
  ]

  let positive = 0
  let negative = 0
  let neutral = 0
  const anomalies = []

  comments.forEach((comment) => {
    const content = comment.content.toLowerCase()
    let posCount = 0
    let negCount = 0

    // Count positive and negative words
    positiveWords.forEach((word) => {
      if (content.includes(word)) posCount++
    })

    negativeWords.forEach((word) => {
      if (content.includes(word)) negCount++
    })

    // Determine sentiment
    if (posCount > negCount && posCount > 0) {
      positive++

      // Check for anomalies (extremely positive)
      if (posCount >= 3) {
        anomalies.push({
          commentId: comment.id,
          reason: "Komentar terlalu positif dengan banyak kata kunci positif",
        })
      }
    } else if (negCount > posCount && negCount > 0) {
      negative++

      // Check for anomalies (extremely negative)
      if (negCount >= 3) {
        anomalies.push({
          commentId: comment.id,
          reason: "Komentar terlalu negatif dengan banyak kata kunci negatif",
        })
      }
    } else {
      neutral++
    }
  })

  return {
    distribution: { positive, neutral, negative },
    anomalies,
  }
}

function identifyUserClusters(
  comments: Comment[],
  patternGroups: PatternGroup[],
  phraseGroups: PhraseGroup[],
): UserCluster[] {
  const userClusters: UserCluster[] = []

  // Map users to their comments
  const userComments: Record<string, Comment[]> = {}
  comments.forEach((comment) => {
    if (!userComments[comment.username]) {
      userComments[comment.username] = []
    }
    userComments[comment.username].push(comment)
  })

  // Map users to pattern groups they belong to
  const userPatterns: Record<string, Set<number>> = {}
  patternGroups.forEach((group, index) => {
    group.commentIds.forEach((commentId) => {
      const comment = comments.find((c) => c.id === commentId)
      if (comment) {
        if (!userPatterns[comment.username]) {
          userPatterns[comment.username] = new Set()
        }
        userPatterns[comment.username].add(index)
      }
    })
  })

  // Map users to phrase groups they use
  const userPhrases: Record<string, Set<number>> = {}
  phraseGroups.forEach((group, index) => {
    group.commentIds.forEach((commentId) => {
      const comment = comments.find((c) => c.id === commentId)
      if (comment) {
        if (!userPhrases[comment.username]) {
          userPhrases[comment.username] = new Set()
        }
        userPhrases[comment.username].add(index)
      }
    })
  })

  // Group users by pattern and phrase similarity
  const processedUsers = new Set<string>()

  Object.keys(userPatterns).forEach((username) => {
    if (processedUsers.has(username)) return

    const similarUsers = findSimilarUsers(
      username,
      Object.keys(userPatterns).filter((u) => u !== username && !processedUsers.has(u)),
      userPatterns,
      userPhrases,
    )

    if (similarUsers.length > 0) {
      // Add the original user to the cluster
      similarUsers.unshift(username)

      // Get sample comments from this cluster
      const sampleCommentIds = getSampleComments(similarUsers, userComments)

      // Create user cluster
      const userCluster: UserCluster = {
        usernames: similarUsers,
        characteristics: generateClusterCharacteristics(
          similarUsers,
          userPatterns,
          userPhrases,
          patternGroups,
          phraseGroups,
        ),
        sampleCommentIds,
        coordinationProbability: calculateCoordinationProbability(similarUsers, userPatterns, userPhrases),
      }

      userClusters.push(userCluster)

      // Mark these users as processed
      similarUsers.forEach((u) => processedUsers.add(u))
    }
  })

  return userClusters
}

function findSimilarUsers(
  username: string,
  otherUsers: string[],
  userPatterns: Record<string, Set<number>>,
  userPhrases: Record<string, Set<number>>,
): string[] {
  const similarUsers: string[] = []

  const userPatternSet = userPatterns[username] || new Set()
  const userPhraseSet = userPhrases[username] || new Set()

  otherUsers.forEach((otherUser) => {
    const otherPatternSet = userPatterns[otherUser] || new Set()
    const otherPhraseSet = userPhrases[otherUser] || new Set()

    // Calculate similarity based on shared patterns and phrases
    let similarity = 0

    // Pattern similarity
    if (userPatternSet.size > 0 && otherPatternSet.size > 0) {
      const patternIntersection = new Set([...userPatternSet].filter((x) => otherPatternSet.has(x)))
      const patternUnion = new Set([...userPatternSet, ...otherPatternSet])
      similarity += (patternIntersection.size / patternUnion.size) * 0.7
    }

    // Phrase similarity
    if (userPhraseSet.size > 0 && otherPhraseSet.size > 0) {
      const phraseIntersection = new Set([...userPhraseSet].filter((x) => otherPhraseSet.has(x)))
      const phraseUnion = new Set([...userPhraseSet, ...otherPhraseSet])
      similarity += (phraseIntersection.size / phraseUnion.size) * 0.3
    }

    // If similarity is above threshold, consider it similar
    if (similarity > 0.3) {
      similarUsers.push(otherUser)
    }
  })

  return similarUsers
}

function getSampleComments(usernames: string[], userComments: Record<string, Comment[]>): string[] {
  const sampleCommentIds: string[] = []

  // Get one comment from each user in the cluster
  usernames.forEach((username) => {
    const comments = userComments[username] || []
    if (comments.length > 0) {
      sampleCommentIds.push(comments[0].id)
    }
  })

  return sampleCommentIds
}

function generateClusterCharacteristics(
  usernames: string[],
  userPatterns: Record<string, Set<number>>,
  userPhrases: Record<string, Set<number>>,
  patternGroups: PatternGroup[],
  phraseGroups: PhraseGroup[],
): string[] {
  const characteristics: string[] = []

  // Find common patterns
  const commonPatternIndices = findCommonElements(usernames.map((u) => Array.from(userPatterns[u] || new Set())))
  if (commonPatternIndices.length > 0) {
    commonPatternIndices.forEach((index) => {
      if (patternGroups[index]) {
        characteristics.push(`Menggunakan pola komentar serupa: "${patternGroups[index].patternTemplate}"`)
      }
    })
  }

  // Find common phrases
  const commonPhraseIndices = findCommonElements(usernames.map((u) => Array.from(userPhrases[u] || new Set())))
  if (commonPhraseIndices.length > 0) {
    commonPhraseIndices.forEach((index) => {
      if (phraseGroups[index]) {
        characteristics.push(`Menggunakan frasa yang sama: "${phraseGroups[index].phrase}"`)
      }
    })
  }

  // Add general characteristics
  if (usernames.length >= 3) {
    characteristics.push(`Kelompok terdiri dari ${usernames.length} pengguna dengan pola komentar serupa`)
  }

  return characteristics
}

function findCommonElements<T>(arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return arrays[0]

  let result = [...arrays[0]]

  for (let i = 1; i < arrays.length; i++) {
    result = result.filter((item) => arrays[i].includes(item))
  }

  return result
}

function calculateCoordinationProbability(
  usernames: string[],
  userPatterns: Record<string, Set<number>>,
  userPhrases: Record<string, Set<number>>,
): number {
  // Base probability based on cluster size
  let probability = Math.min(80, usernames.length * 10)

  // Increase based on pattern sharing
  const commonPatternIndices = findCommonElements(usernames.map((u) => Array.from(userPatterns[u] || new Set())))
  probability += commonPatternIndices.length * 5

  // Increase based on phrase sharing
  const commonPhraseIndices = findCommonElements(usernames.map((u) => Array.from(userPhrases[u] || new Set())))
  probability += commonPhraseIndices.length * 3

  return Math.min(99, probability)
}

function calculatePatternScore(
  patternGroups: PatternGroup[],
  phraseGroups: PhraseGroup[],
  userClusters: UserCluster[],
  totalComments: number,
): number {
  // Calculate percentage of comments in pattern groups
  const commentsInPatterns = new Set<string>()
  patternGroups.forEach((group) => {
    group.commentIds.forEach((id) => commentsInPatterns.add(id))
  })

  const patternCoverage = commentsInPatterns.size / totalComments

  // Calculate phrase coverage
  const commentsWithPhrases = new Set<string>()
  phraseGroups.forEach((group) => {
    group.commentIds.forEach((id) => commentsWithPhrases.add(id))
  })

  const phraseCoverage = commentsWithPhrases.size / totalComments

  // Calculate user clustering score
  const usersInClusters = new Set<string>()
  userClusters.forEach((cluster) => {
    cluster.usernames.forEach((username) => usersInClusters.add(username))
  })

  const userClusterScore = userClusters.length > 0 ? (usersInClusters.size / Math.min(20, totalComments)) * 100 : 0

  // Combined score
  return Math.round(patternCoverage * 40 + phraseCoverage * 30 + userClusterScore * 0.3)
}

function generateSummary(
  patternScore: number,
  patternGroups: PatternGroup[],
  phraseGroups: PhraseGroup[],
  userClusters: UserCluster[],
  totalComments: number,
): string {
  if (patternScore > 70) {
    return `Terdeteksi pola komentar yang sangat mencurigakan. Terdapat ${patternGroups.length} kelompok pola, ${phraseGroups.length} frasa umum, dan ${userClusters.length} kluster pengguna yang menunjukkan kemungkinan aktivitas buzzer terkoordinasi.`
  } else if (patternScore > 40) {
    return `Terdeteksi beberapa pola komentar yang mencurigakan. Terdapat ${patternGroups.length} kelompok pola dan ${phraseGroups.length} frasa umum yang menunjukkan kemungkinan aktivitas buzzer.`
  } else {
    return `Tidak terdeteksi pola komentar yang signifikan. Komentar-komentar menunjukkan variasi yang wajar dan kemungkinan besar merupakan interaksi organik.`
  }
}

function calculateSimilarityScore(texts: string[]): number {
  if (texts.length <= 1) return 0

  let totalSimilarity = 0
  let comparisons = 0

  // Compare each text with every other text
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const words1 = texts[i].toLowerCase().split(/\s+/)
      const words2 = texts[j].toLowerCase().split(/\s+/)

      totalSimilarity += calculateSimilarity(words1, words2)
      comparisons++
    }
  }

  return comparisons > 0 ? Math.round((totalSimilarity / comparisons) * 100) : 0
}

function createEmptyResult(): PatternAnalysisResult {
  return {
    patternScore: 0,
    patternGroups: [],
    phraseGroups: [],
    sentimentAnalysis: {
      distribution: { positive: 0, neutral: 0, negative: 0 },
      anomalies: [],
    },
    userClusters: [],
    summary: "Tidak ada komentar untuk dianalisis.",
  }
}

