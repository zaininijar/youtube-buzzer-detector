import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Comment, UserCluster } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface UserClusterAnalysisProps {
  userClusters: UserCluster[]
  comments: Comment[]
}

export function UserClusterAnalysis({ userClusters, comments }: UserClusterAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Kluster Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {userClusters.length > 0 ? (
            userClusters.map((cluster, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Kluster {index + 1}</h3>
                  <Badge variant="outline">{cluster.usernames.length} pengguna</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cluster.usernames.map((username) => (
                    <Badge key={username} variant="secondary">
                      {username}
                    </Badge>
                  ))}
                </div>

                <div className="p-3 rounded-md bg-muted">
                  <h4 className="text-sm font-medium mb-1">Karakteristik Kluster:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {cluster.characteristics.map((characteristic, i) => (
                      <li key={i}>{characteristic}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contoh Komentar:</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {cluster.sampleCommentIds.map((id) => {
                      const comment = comments.find((c) => c.id === id)
                      if (!comment) return null

                      return (
                        <div key={id} className="p-3 bg-primary/5 rounded-md text-sm">
                          <div className="font-medium mb-1">{comment.username}:</div>
                          <div>{comment.content}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    Kemungkinan koordinasi: <span className="font-medium">{cluster.coordinationProbability}%</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada kluster pengguna yang terdeteksi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

