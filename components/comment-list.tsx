import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Comment } from "@/lib/types"
import { AlertCircle } from "lucide-react"

interface CommentListProps {
  comments: Comment[]
  suspiciousUsers: string[]
}

export function CommentList({ comments, suspiciousUsers }: CommentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Komentar ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Tidak ada komentar untuk ditampilkan</p>
          ) : (
            comments.map((comment) => {
              const isSuspicious = suspiciousUsers.includes(comment.username)
              return (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg ${isSuspicious ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{comment.username}</p>
                        {isSuspicious && (
                          <span className="flex items-center text-xs text-red-600 gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Terdeteksi sebagai buzzer
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

