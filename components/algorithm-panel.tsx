"use client"

import type { AlgorithmResult } from "./algorithm-visualizer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AlgorithmPanelProps {
  title: string
  result: AlgorithmResult | null
  algorithmType: "bipartite" | "maxflow"
}

export default function AlgorithmPanel({ title, result, algorithmType }: AlgorithmPanelProps) {
  if (!result) {
    return <div className="p-4 text-center text-muted-foreground">Run the algorithm to see results here</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title} Results</h2>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Algorithm Steps</h3>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            {result.steps.map((step, index) => (
              <div key={index} className="py-0.5">
                {step}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{algorithmType === "bipartite" ? "Matched Pairs" : "Flow Result"}</h3>
            {algorithmType === "maxflow" && result.maxFlow !== undefined && (
              <Badge variant="secondary" className="text-sm">
                Max Flow: {result.maxFlow}
              </Badge>
            )}
          </div>

          {result.matches.length > 0 ? (
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              {result.matches.map((match, index) => (
                <div key={index} className="py-0.5">
                  Worker {match.from} → Task {match.to}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-4">No matches found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
