export interface Comment {
  id: string
  username: string
  content: string
  timestamp: string
}

export interface AnalysisResult {
  buzzerScore: number
  patternScore: number
  contentScore: number
  timingScore: number
  suspiciousUsers: string[]
  commonPhrases: string[]
  detectionReasons: string[]
  summary: string
}

export interface PatternGroup {
  commentIds: string[]
  patternTemplate: string
  patternDescription: string
  similarity: number
}

export interface PhraseGroup {
  phrase: string
  commentIds: string[]
  frequency: number
}

export interface SentimentAnalysis {
  distribution: {
    positive: number
    neutral: number
    negative: number
  }
  anomalies: {
    commentId: string
    reason: string
  }[]
}

export interface UserCluster {
  usernames: string[]
  characteristics: string[]
  sampleCommentIds: string[]
  coordinationProbability: number
}

export interface PatternAnalysisResult {
  patternScore: number
  patternGroups: PatternGroup[]
  phraseGroups: PhraseGroup[]
  sentimentAnalysis: SentimentAnalysis
  userClusters: UserCluster[]
  summary: string
}

