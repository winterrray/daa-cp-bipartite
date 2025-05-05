#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <algorithm>

using namespace std;

class EdmondsKarp {
private:
    int vertices;                      // Total number of vertices including source and sink
    vector<vector<int>> capacity;      // Residual capacity matrix
    vector<vector<int>> adjacency;     // Adjacency list for BFS
    int source;                        // Source vertex
    int sink;                          // Sink vertex
    int workers;                       // Number of workers
    int tasks;                         // Number of tasks

public:
    // Constructor
    EdmondsKarp(int workers, int tasks) : workers(workers), tasks(tasks) {
        // Create a graph with source (0), workers (1 to workers), 
        // tasks (workers+1 to workers+tasks), and sink (workers+tasks+1)
        source = 0;
        sink = workers + tasks + 1;
        vertices = sink + 1;
        
        // Initialize capacity matrix and adjacency list
        capacity.resize(vertices, vector<int>(vertices, 0));
        adjacency.resize(vertices);
        
        // Add edges from source to workers (capacity 1)
        for (int i = 1; i <= workers; i++) {
            addEdge(source, i, 1);
        }
        
        // Add edges from tasks to sink (capacity 1)
        for (int i = 1; i <= tasks; i++) {
            addEdge(workers + i, sink, 1);
        }
    }
    
    // Add an edge from worker to task
    void addWorkerTaskEdge(int worker, int task) {
        // Worker IDs start from 1, task IDs are offset by workers
        addEdge(worker, workers + task, 1);
    }
    
    // Add an edge with capacity
    void addEdge(int u, int v, int cap) {
        // Add edge to adjacency list
        adjacency[u].push_back(v);
        adjacency[v].push_back(u);  // Add reverse edge for residual graph
        
        // Add capacity
        capacity[u][v] = cap;
    }
    
    // BFS to find augmenting path
    bool bfs(vector<int>& parent) {
        fill(parent.begin(), parent.end(), -1);
        parent[source] = -2;  // Mark source as visited
        
        queue<int> q;
        q.push(source);
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (int v : adjacency[u]) {
                // If not visited and has capacity
                if (parent[v] == -1 && capacity[u][v] > 0) {
                    parent[v] = u;
                    if (v == sink) {
                        return true;  // Found a path to sink
                    }
                    q.push(v);
                }
            }
        }
        
        return false;  // No path found
    }
    
    // Main Edmonds-Karp algorithm
    int edmondsKarpAlgorithm() {
        int maxFlow = 0;
        vector<int> parent(vertices);
        
        // While there is an augmenting path
        while (bfs(parent)) {
            // Find bottleneck capacity
            int pathFlow = numeric_limits<int>::max();
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = min(pathFlow, capacity[u][v]);
            }
            
            // Update residual capacities
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                capacity[u][v] -= pathFlow;
                capacity[v][u] += pathFlow;  // Reverse edge
            }
            
            maxFlow += pathFlow;
        }
        
        return maxFlow;
    }
    
    // Print the matching pairs (for bipartite matching)
    void printMatching() {
        cout << "Matched pairs (Worker -> Task):" << endl;
        
        for (int worker = 1; worker <= workers; worker++) {
            for (int task = 1; task <= tasks; task++) {
                // If there's a flow from worker to task
                if (capacity[worker][workers + task] == 0 && 
                    find(adjacency[worker].begin(), adjacency[worker].end(), workers + task) != adjacency[worker].end()) {
                    cout << "Worker " << worker << " -> Task " << task << endl;
                }
            }
        }
    }
    
    // Get the matching as a vector of pairs
    vector<pair<int, int>> getMatching() {
        vector<pair<int, int>> matches;
        
        for (int worker = 1; worker <= workers; worker++) {
            for (int task = 1; task <= tasks; task++) {
                // If there's a flow from worker to task
                if (capacity[worker][workers + task] == 0 && 
                    find(adjacency[worker].begin(), adjacency[worker].end(), workers + task) != adjacency[worker].end()) {
                    matches.push_back({worker, task});
                }
            }
        }
        
        return matches;
    }
};

// Example main function (not used in the web app)
/*
int main() {
    int workers = 4;
    int tasks = 4;
    
    // Create a flow network for bipartite matching
    EdmondsKarp ek(workers, tasks);
    
    // Add edges between workers and tasks
    ek.addWorkerTaskEdge(1, 1);
    ek.addWorkerTaskEdge(1, 2);
    ek.addWorkerTaskEdge(2, 1);
    ek.addWorkerTaskEdge(3, 3);
    ek.addWorkerTaskEdge(4, 2);
    ek.addWorkerTaskEdge(4, 4);
    
    // Find maximum flow (equals maximum matching)
    int maxFlow = ek.edmondsKarpAlgorithm();
    
    cout << "Maximum flow (matching): " << maxFlow << endl;
    ek.printMatching();
    
    return 0;
}
*/
