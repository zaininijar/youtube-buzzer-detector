import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Comment, PhraseGroup } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface PhraseAnalysisProps {
  phraseGroups: PhraseGroup[]
  comments: Comment[]
}

export function PhraseAnalysis({ phraseGroups, comments }: PhraseAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Frasa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phraseGroups.length > 0 ? (
            phraseGroups.map((group, index) => (
              <div key={index} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-medium">Kelompok Frasa {index + 1}</h3>
                  <Badge variant="outline">{group.frequency} kemunculan</Badge>
                </div>

                <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                  <p className="font-medium break-words">{group.phrase}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Komentar yang mengandung frasa ini:</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {group.commentIds.map((id) => {
                      const comment = comments.find((c) => c.id === id)
                      if (!comment) return null

                      // Highlight the phrase in the comment
                      const parts = comment.content.split(new RegExp(`(${group.phrase})`, "i"))

                      return (
                        <div key={id} className="p-3 bg-muted rounded-md text-sm">
                          <div className="font-medium mb-1 break-words">{comment.username}:</div>
                          <div className="break-words">
                            {parts.map((part, i) => {
                              if (part.toLowerCase() === group.phrase.toLowerCase()) {
                                return (
                                  <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
                                    {part}
                                  </span>
                                )
                              }
                              return part
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    Frasa ini muncul di {Math.round((group.frequency / comments.length) * 100)}% dari total komentar.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada kelompok frasa signifikan yang terdeteksi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

