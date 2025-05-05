"use client"

import { useState } from "react"
import InputPanel from "./input-panel"
import AlgorithmPanel from "./algorithm-panel"
import GraphVisualization from "./graph-visualization"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export type Edge = {
  from: number
  to: number
}

export type GraphData = {
  workers: number
  tasks: number
  edges: Edge[]
}

export type AlgorithmResult = {
  steps: string[]
  matches: Edge[]
  maxFlow?: number
}

export default function AlgorithmVisualizer() {
  const [graphData, setGraphData] = useState<GraphData>({
    workers: 3,
    tasks: 3,
    edges: [],
  })
  const [hopcroftResult, setHopcroftResult] = useState<AlgorithmResult | null>(null)
  const [edmondsResult, setEdmondsResult] = useState<AlgorithmResult | null>(null)
  const [activeTab, setActiveTab] = useState<string>("input")
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleGraphDataChange = (newData: GraphData) => {
    setGraphData(newData)
  }

  const runHopcroftKarp = () => {
    if (graphData.edges.length === 0) {
      toast({
        title: "No edges defined",
        description: "Please add at least one edge to run the algorithm",
        variant: "destructive",
      })
      return
    }

    // Simulate algorithm execution
    const result = hopcroftKarpAlgorithm(graphData)
    setHopcroftResult(result)
    setActiveTab("hopcroft")

    toast({
      title: "Hopcroft-Karp Algorithm",
      description: "Algorithm executed successfully",
    })
  }

  const runEdmondsKarp = () => {
    if (graphData.edges.length === 0) {
      toast({
        title: "No edges defined",
        description: "Please add at least one edge to run the algorithm",
        variant: "destructive",
      })
      return
    }

    // Simulate algorithm execution
    const result = edmondsKarpAlgorithm(graphData)
    setEdmondsResult(result)
    setActiveTab("edmonds")

    toast({
      title: "Edmonds-Karp Algorithm",
      description: "Algorithm executed successfully",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 shadow-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="hopcroft">Hopcroft-Karp</TabsTrigger>
            <TabsTrigger value="edmonds">Edmonds-Karp</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <InputPanel
              graphData={graphData}
              onGraphDataChange={handleGraphDataChange}
              onRunHopcroftKarp={runHopcroftKarp}
              onRunEdmondsKarp={runEdmondsKarp}
            />
          </TabsContent>

          <TabsContent value="hopcroft">
            <AlgorithmPanel title="Hopcroft-Karp Algorithm" result={hopcroftResult} algorithmType="bipartite" />
          </TabsContent>

          <TabsContent value="edmonds">
            <AlgorithmPanel title="Edmonds-Karp Algorithm" result={edmondsResult} algorithmType="maxflow" />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
        <GraphVisualization
          graphData={graphData}
          matchedEdges={activeTab === "hopcroft" ? hopcroftResult?.matches || [] : edmondsResult?.matches || []}
        />
      </Card>
    </div>
  )
}

// Hopcroft-Karp algorithm for bipartite matching
function hopcroftKarpAlgorithm(graphData: GraphData): AlgorithmResult {
  const { workers, tasks, edges } = graphData
  const steps: string[] = []
  const matches: Edge[] = []

  // Create adjacency list for workers
  const adj: number[][] = Array.from({ length: workers + 1 }, () => [])
  for (const edge of edges) {
    adj[edge.from].push(edge.to)
  }

  // Initialize NIL and distances
  const NIL = 0
  const pairU: number[] = Array(workers + 1).fill(NIL)
  const pairV: number[] = Array(tasks + 1).fill(NIL)
  const dist: number[] = Array(workers + 1).fill(0)

  steps.push("Initialize all vertices as free")

  // Function to check if there's an augmenting path
  function bfs(): boolean {
    const queue: number[] = []

    // First layer of vertices (set distance as 0)
    for (let u = 1; u <= workers; u++) {
      // If this is a free vertex, add it to queue
      if (pairU[u] === NIL) {
        dist[u] = 0
        queue.push(u)
      } else {
        dist[u] = Number.POSITIVE_INFINITY
      }
    }

    dist[NIL] = Number.POSITIVE_INFINITY

    // BFS to find augmenting paths
    while (queue.length > 0) {
      const u = queue.shift()!

      if (dist[u] < dist[NIL]) {
        // Get all adjacent vertices of the dequeued vertex u
        for (const v of adj[u]) {
          // If pair of v is not explored yet
          if (dist[pairV[v]] === Number.POSITIVE_INFINITY) {
            // Consider the pair and add it to queue
            dist[pairV[v]] = dist[u] + 1
            queue.push(pairV[v])
          }
        }
      }
    }

    // If we could come back to NIL using alternating path of distinct
    // vertices then there is an augmenting path
    return dist[NIL] !== Number.POSITIVE_INFINITY
  }

  // Function to find augmenting paths using DFS
  function dfs(u: number): boolean {
    if (u !== NIL) {
      for (const v of adj[u]) {
        // Follow the distances set by BFS
        if (dist[pairV[v]] === dist[u] + 1) {
          // If dfs for pair of v also returns true
          if (dfs(pairV[v])) {
            pairV[v] = u
            pairU[u] = v
            return true
          }
        }
      }

      // If no augmenting path beginning with u
      dist[u] = Number.POSITIVE_INFINITY
      return false
    }
    return true
  }

  // Main Hopcroft-Karp algorithm
  let matchingSize = 0
  steps.push("While there exists an augmenting path:")

  while (bfs()) {
    steps.push("  Found augmenting paths using BFS")

    // Find a free vertex
    for (let u = 1; u <= workers; u++) {
      // If current vertex is free and there is an augmenting path from it
      if (pairU[u] === NIL && dfs(u)) {
        matchingSize++
      }
    }

    steps.push(`  Updated matching using DFS (current size: ${matchingSize})`)
  }

  // Collect the matches
  for (let u = 1; u <= workers; u++) {
    if (pairU[u] !== NIL) {
      matches.push({ from: u, to: pairU[u] })
    }
  }

  steps.push(`Maximum bipartite matching size: ${matchingSize}`)

  return {
    steps,
    matches,
  }
}

// Edmonds-Karp algorithm for maximum flow
function edmondsKarpAlgorithm(graphData: GraphData): AlgorithmResult {
  const { workers, tasks, edges } = graphData
  const steps: string[] = []
  const matches: Edge[] = []

  // Create a source (0) and sink (workers + tasks + 1)
  const source = 0
  const sink = workers + tasks + 1
  const n = sink + 1 // Total number of vertices

  // Create adjacency matrix for residual graph
  const capacity: number[][] = Array.from({ length: n }, () => Array(n).fill(0))

  // Add edges from source to workers (capacity 1)
  for (let i = 1; i <= workers; i++) {
    capacity[source][i] = 1
  }

  // Add edges from tasks to sink (capacity 1)
  for (let i = 1; i <= tasks; i++) {
    capacity[workers + i][sink] = 1
  }

  // Add edges from workers to tasks (capacity 1)
  for (const edge of edges) {
    capacity[edge.from][workers + edge.to] = 1
  }

  steps.push("Create residual graph with source and sink")
  steps.push("Source (0) connected to all workers with capacity 1")
  steps.push("All tasks connected to sink with capacity 1")
  steps.push("Workers connected to tasks based on input edges")

  // Function to find augmenting path using BFS
  function bfs(): number[] | null {
    const visited = Array(n).fill(false)
    const parent = Array(n).fill(-1)
    const queue: number[] = [source]
    visited[source] = true

    while (queue.length > 0) {
      const u = queue.shift()!

      for (let v = 0; v < n; v++) {
        if (!visited[v] && capacity[u][v] > 0) {
          queue.push(v)
          parent[v] = u
          visited[v] = true
        }
      }
    }

    // If we reached sink in BFS, then there is a path
    if (visited[sink]) {
      return parent
    }
    return null
  }

  // Main Edmonds-Karp algorithm
  let maxFlow = 0
  steps.push("While there exists an augmenting path:")

  let iteration = 1
  let parent = bfs()

  while (parent !== null) {
    steps.push(`Iteration ${iteration}: Found augmenting path using BFS`)

    // Find bottleneck capacity
    let pathFlow = Number.POSITIVE_INFINITY
    for (let v = sink; v !== source; v = parent[v]) {
      const u = parent[v]
      pathFlow = Math.min(pathFlow, capacity[u][v])
    }

    steps.push(`  Bottleneck capacity: ${pathFlow}`)

    // Update residual capacities
    for (let v = sink; v !== source; v = parent[v]) {
      const u = parent[v]
      capacity[u][v] -= pathFlow
      capacity[v][u] += pathFlow // Reverse edge for residual graph
    }

    maxFlow += pathFlow
    steps.push(`  Updated residual capacities`)
    steps.push(`  Current max flow: ${maxFlow}`)

    iteration++
    parent = bfs()
  }

  // Extract the matching from the flow
  for (let i = 1; i <= workers; i++) {
    for (let j = 1; j <= tasks; j++) {
      // If there's a flow from worker i to task j
      if (capacity[i][workers + j] === 0 && edges.some((e) => e.from === i && e.to === j)) {
        matches.push({ from: i, to: j })
      }
    }
  }

  steps.push(`Maximum flow: ${maxFlow}`)

  return {
    steps,
    matches,
    maxFlow,
  }
}
