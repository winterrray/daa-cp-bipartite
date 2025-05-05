"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import type { GraphData, Edge } from "./algorithm-visualizer"

interface InputPanelProps {
  graphData: GraphData
  onGraphDataChange: (data: GraphData) => void
  onRunHopcroftKarp: () => void
  onRunEdmondsKarp: () => void
}

export default function InputPanel({
  graphData,
  onGraphDataChange,
  onRunHopcroftKarp,
  onRunEdmondsKarp,
}: InputPanelProps) {
  const [newEdge, setNewEdge] = useState<Edge>({ from: 1, to: 1 })

  const handleWorkersChange = (value: string) => {
    const workers = Number.parseInt(value)
    if (isNaN(workers) || workers < 1) return

    // Update graph data with new worker count
    onGraphDataChange({
      ...graphData,
      workers,
      // Remove edges that reference workers that no longer exist
      edges: graphData.edges.filter((edge) => edge.from <= workers),
    })
  }

  const handleTasksChange = (value: string) => {
    const tasks = Number.parseInt(value)
    if (isNaN(tasks) || tasks < 1) return

    // Update graph data with new task count
    onGraphDataChange({
      ...graphData,
      tasks,
      // Remove edges that reference tasks that no longer exist
      edges: graphData.edges.filter((edge) => edge.to <= tasks),
    })
  }

  const handleAddEdge = () => {
    // Check if edge already exists
    const edgeExists = graphData.edges.some((edge) => edge.from === newEdge.from && edge.to === newEdge.to)

    if (!edgeExists) {
      onGraphDataChange({
        ...graphData,
        edges: [...graphData.edges, { ...newEdge }],
      })
    }
  }

  const handleRemoveEdge = (index: number) => {
    const newEdges = [...graphData.edges]
    newEdges.splice(index, 1)
    onGraphDataChange({
      ...graphData,
      edges: newEdges,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="workers">Number of Workers</Label>
          <Input
            id="workers"
            type="number"
            min="1"
            value={graphData.workers}
            onChange={(e) => handleWorkersChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tasks">Number of Tasks</Label>
          <Input
            id="tasks"
            type="number"
            min="1"
            value={graphData.tasks}
            onChange={(e) => handleTasksChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Edges</CardTitle>
          <CardDescription>Connect workers to tasks they can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-2">
            <div>
              <Label htmlFor="from">Worker</Label>
              <Select
                value={newEdge.from.toString()}
                onValueChange={(value) => setNewEdge({ ...newEdge, from: Number.parseInt(value) })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Worker" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: graphData.workers }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Worker {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="to">Task</Label>
              <Select
                value={newEdge.to.toString()}
                onValueChange={(value) => setNewEdge({ ...newEdge, to: Number.parseInt(value) })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Task" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: graphData.tasks }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Task {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddEdge} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Add Edge
            </Button>
          </div>
        </CardContent>
      </Card>

      {graphData.edges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Defined Edges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graphData.edges.map((edge, index) => (
                  <TableRow key={index}>
                    <TableCell>Worker {edge.from}</TableCell>
                    <TableCell>Task {edge.to}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveEdge(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onRunHopcroftKarp} className="flex-1" variant="default">
          Run Hopcroft-Karp
        </Button>
        <Button onClick={onRunEdmondsKarp} className="flex-1" variant="secondary">
          Run Edmonds-Karp
        </Button>
      </div>
    </div>
  )
}
