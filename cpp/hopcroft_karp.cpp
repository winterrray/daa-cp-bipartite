#include <iostream>
#include <vector>
#include <queue>
#include <limits>

using namespace std;

class HopcroftKarp {
private:
    int workers;                  // Number of workers (left side of bipartite graph)
    int tasks;                    // Number of tasks (right side of bipartite graph)
    vector<vector<int>> adj;      // Adjacency list for workers
    vector<int> pairU;            // Stores which task is assigned to which worker
    vector<int> pairV;            // Stores which worker is assigned to which task
    vector<int> dist;             // Stores distance of NIL in BFS
    const int NIL = 0;            // NIL is represented by 0

public:
    // Constructor
    HopcroftKarp(int workers, int tasks) : workers(workers), tasks(tasks) {
        adj.resize(workers + 1);
        pairU.resize(workers + 1, NIL);
        pairV.resize(tasks + 1, NIL);
        dist.resize(workers + 1);
    }

    // Add an edge from worker u to task v
    void addEdge(int u, int v) {
        adj[u].push_back(v);
    }

    // BFS to find augmenting paths
    bool bfs() {
        queue<int> Q;

        // First layer of vertices (set distance as 0)
        for (int u = 1; u <= workers; u++) {
            // If this is a free vertex, add it to queue
            if (pairU[u] == NIL) {
                dist[u] = 0;
                Q.push(u);
            }
            else {
                dist[u] = numeric_limits<int>::max();
            }
        }

        dist[NIL] = numeric_limits<int>::max();

        // BFS to find augmenting paths
        while (!Q.empty()) {
            int u = Q.front();
            Q.pop();

            if (dist[u] < dist[NIL]) {
                // Get all adjacent vertices of the dequeued vertex u
                for (int v : adj[u]) {
                    // If pair of v is not explored yet
                    if (dist[pairV[v]] == numeric_limits<int>::max()) {
                        // Consider the pair and add it to queue
                        dist[pairV[v]] = dist[u] + 1;
                        Q.push(pairV[v]);
                    }
                }
            }
        }

        // If we could come back to NIL using alternating path of distinct
        // vertices then there is an augmenting path
        return (dist[NIL] != numeric_limits<int>::max());
    }

    // DFS to find augmenting paths
    bool dfs(int u) {
        if (u != NIL) {
            for (int v : adj[u]) {
                // Follow the distances set by BFS
                if (dist[pairV[v]] == dist[u] + 1) {
                    // If dfs for pair of v also returns true
                    if (dfs(pairV[v])) {
                        pairV[v] = u;
                        pairU[u] = v;
                        return true;
                    }
                }
            }

            // If no augmenting path beginning with u
            dist[u] = numeric_limits<int>::max();
            return false;
        }
        return true;
    }

    // Main function to find maximum matching
    int hopcroftKarpAlgorithm() {
        int matching = 0;

        // Keep finding augmenting paths using BFS and DFS
        while (bfs()) {
            // Find a free vertex
            for (int u = 1; u <= workers; u++) {
                // If current vertex is free and there is an augmenting path from it
                if (pairU[u] == NIL && dfs(u)) {
                    matching++;
                }
            }
        }
        return matching;
    }

    // Print the matching pairs
    void printMatching() {
        cout << "Matched pairs (Worker -> Task):" << endl;
        for (int u = 1; u <= workers; u++) {
            if (pairU[u] != NIL) {
                cout << "Worker " << u << " -> Task " << pairU[u] << endl;
            }
        }
    }

    // Get the matching as a vector of pairs
    vector<pair<int, int>> getMatching() {
        vector<pair<int, int>> matches;
        for (int u = 1; u <= workers; u++) {
            if (pairU[u] != NIL) {
                matches.push_back({u, pairU[u]});
            }
        }
        return matches;
    }
};

// Example main function (not used in the web app)
/*
int main() {
    // Create a bipartite graph with 4 workers and 4 tasks
    HopcroftKarp hk(4, 4);

    // Add edges
    hk.addEdge(1, 1);
    hk.addEdge(1, 2);
    hk.addEdge(2, 1);
    hk.addEdge(3, 3);
    hk.addEdge(4, 2);
    hk.addEdge(4, 4);

    // Find maximum matching
    int maxMatching = hk.hopcroftKarpAlgorithm();
    
    cout << "Maximum matching: " << maxMatching << endl;
    hk.printMatching();

    return 0;
}
*/
