"use client"

import { useEffect, useRef } from "react"
import { Network } from "vis-network"
import { DataSet } from "vis-data"
import type { GraphData, Edge } from "./algorithm-visualizer"

interface GraphVisualizationProps {
  graphData: GraphData
  matchedEdges: Edge[]
}

export default function GraphVisualization({ graphData, matchedEdges }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create nodes for workers
    const workerNodes = Array.from({ length: graphData.workers }, (_, i) => ({
      id: i + 1,
      label: `Worker ${i + 1}`,
      group: "workers",
    }))

    // Create nodes for tasks (offset IDs to avoid conflicts)
    const taskOffset = 1000 // Offset to avoid ID conflicts
    const taskNodes = Array.from({ length: graphData.tasks }, (_, i) => ({
      id: taskOffset + i + 1,
      label: `Task ${i + 1}`,
      group: "tasks",
    }))

    // Combine all nodes
    const nodes = new DataSet([...workerNodes, ...taskNodes])

    // Create edges
    const edgesData = graphData.edges.map((edge, index) => {
      const isMatched = matchedEdges.some((match) => match.from === edge.from && match.to === edge.to)

      return {
        id: index + 1,
        from: edge.from,
        to: taskOffset + edge.to, // Adjust task ID with offset
        color: isMatched ? { color: "#10b981" } : { color: "#94a3b8" },
        width: isMatched ? 3 : 1,
      }
    })

    const edges = new DataSet(edgesData)

    // Configure network options
    const options = {
      layout: {
        hierarchical: {
          direction: "LR",
          sortMethod: "directed",
          levelSeparation: 200,
        },
      },
      nodes: {
        shape: "circle",
        size: 30,
        font: {
          size: 14,
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1 },
        },
        smooth: {
          type: "cubicBezier",
          forceDirection: "horizontal",
        },
      },
      groups: {
        workers: {
          color: { background: "#f97316", border: "#ea580c" },
        },
        tasks: {
          color: { background: "#3b82f6", border: "#2563eb" },
        },
      },
      physics: {
        enabled: false,
      },
    }

    // Create network
    networkRef.current = new Network(containerRef.current, { nodes, edges }, options)

    // Clean up
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [graphData, matchedEdges])

  return <div ref={containerRef} className="w-full h-[500px] border border-border rounded-md bg-card" />
}
