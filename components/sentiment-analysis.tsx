import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Comment, SentimentAnalysis as SentimentData } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface SentimentAnalysisProps {
  sentimentData: SentimentData;
  comments: Comment[];
}

export function SentimentAnalysis({
  sentimentData,
  comments,
}: SentimentAnalysisProps) {
  const { distribution, anomalies } = sentimentData;

  // Calculate percentages for the sentiment distribution
  const total =
    distribution.positive + distribution.neutral + distribution.negative;
  const positivePercent = Math.round((distribution.positive / total) * 100);
  const neutralPercent = Math.round((distribution.neutral / total) * 100);
  const negativePercent = Math.round((distribution.negative / total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Sentimen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Distribusi Sentimen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Positif</span>
                  <span className="text-sm font-medium">
                    {positivePercent}%
                  </span>
                </div>
                <Progress
                  value={positivePercent}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-green-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Netral</span>
                  <span className="text-sm font-medium">{neutralPercent}%</span>
                </div>
                <Progress
                  value={neutralPercent}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Negatif</span>
                  <span className="text-sm font-medium">
                    {negativePercent}%
                  </span>
                </div>
                <Progress
                  value={negativePercent}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-red-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Interpretasi Sentimen</h3>
            <div className="p-4 rounded-md bg-muted">
              <p>
                {positivePercent > 80
                  ? "Sentimen sangat positif yang tidak wajar, kemungkinan ada upaya koordinasi untuk membentuk opini positif."
                  : positivePercent > 60
                  ? "Sentimen didominasi positif, perlu diperiksa apakah sesuai dengan konteks topik."
                  : negativePercent > 80
                  ? "Sentimen sangat negatif yang tidak wajar, kemungkinan ada upaya koordinasi untuk membentuk opini negatif."
                  : negativePercent > 60
                  ? "Sentimen didominasi negatif, perlu diperiksa apakah sesuai dengan konteks topik."
                  : "Distribusi sentimen relatif seimbang, menunjukkan diskusi yang lebih natural."}
              </p>
            </div>
          </div>

          {anomalies.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Anomali Sentimen</h3>
              <div className="space-y-2">
                {anomalies.map((anomaly, index) => {
                  const comment = comments.find(
                    (c) => c.id === anomaly.commentId
                  );
                  if (!comment) return null;

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-md border bg-red-50 border-red-100 dark:bg-red-900"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{comment.username}</span>
                        <span className="text-xs bg-red-200 dark:bg-red-500 px-2 py-0.5 leading-none flex items-center rounded-full">
                          Anomali
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {anomaly.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
