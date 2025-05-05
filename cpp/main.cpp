#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include <chrono>
#include "hopcroft_karp.cpp"
#include "edmonds_karp.cpp"

using namespace std;
using namespace std::chrono;

// Structure to hold input data
struct InputData {
    int workers;
    int tasks;
    vector<pair<int, int>> edges;
};

// Structure to hold output data
struct OutputData {
    int maxMatching;
    vector<pair<int, int>> matches;
    vector<string> steps;
};

// Function to parse input JSON
InputData parseInput(const string& inputJson) {
    InputData data;
    
    // In a real implementation, you would use a JSON library
    // This is a simplified parser for demonstration
    
    // Extract workers and tasks
    size_t workersPos = inputJson.find("\"workers\":");
    size_t tasksPos = inputJson.find("\"tasks\":");
    
    if (workersPos != string::npos && tasksPos != string::npos) {
        string workersStr = inputJson.substr(workersPos + 10, tasksPos - workersPos - 10);
        string tasksStr = inputJson.substr(tasksPos + 8, inputJson.find(",", tasksPos) - tasksPos - 8);
        
        data.workers = stoi(workersStr);
        data.tasks = stoi(tasksStr);
    }
    
    // Extract edges
    size_t edgesPos = inputJson.find("\"edges\":");
    if (edgesPos != string::npos) {
        size_t edgesStart = inputJson.find("[", edgesPos);
        size_t edgesEnd = inputJson.find("]", edgesStart);
        
        if (edgesStart != string::npos && edgesEnd != string::npos) {
            string edgesStr = inputJson.substr(edgesStart + 1, edgesEnd - edgesStart - 1);
            
            // Parse each edge
            size_t pos = 0;
            while ((pos = edgesStr.find("{", pos)) != string::npos) {
                size_t endPos = edgesStr.find("}", pos);
                string edgeStr = edgesStr.substr(pos, endPos - pos + 1);
                
                size_t fromPos = edgeStr.find("\"from\":");
                size_t toPos = edgeStr.find("\"to\":");
                
                if (fromPos != string::npos && toPos != string::npos) {
                    string fromStr = edgeStr.substr(fromPos + 7, toPos - fromPos - 7);
                    string toStr = edgeStr.substr(toPos + 5, edgeStr.find("}", toPos) - toPos - 5);
                    
                    int from = stoi(fromStr);
                    int to = stoi(toStr);
                    
                    data.edges.push_back({from, to});
                }
                
                pos = endPos + 1;
            }
        }
    }
    
    return data;
}

// Function to generate output JSON
string generateOutput(const OutputData& data) {
    // In a real implementation, you would use a JSON library
    // This is a simplified generator for demonstration
    
    stringstream ss;
    
    ss << "{" << endl;
    ss << "  \"maxMatching\": " << data.maxMatching << "," << endl;
    
    ss << "  \"matches\": [" << endl;
    for (size_t i = 0; i < data.matches.size(); i++) {
        ss << "    {\"from\": " << data.matches[i].first << ", \"to\": " << data.matches[i].second << "}";
        if (i < data.matches.size() - 1) {
            ss << ",";
        }
        ss << endl;
    }
    ss << "  ]," << endl;
    
    ss << "  \"steps\": [" << endl;
    for (size_t i = 0; i < data.steps.size(); i++) {
        ss << "    \"" << data.steps[i] << "\"";
        if (i < data.steps.size() - 1) {
            ss << ",";
        }
        ss << endl;
    }
    ss << "  ]" << endl;
    
    ss << "}" << endl;
    
    return ss.str();
}

// Function to run Hopcroft-Karp algorithm
OutputData runHopcroftKarp(const InputData& input) {
    OutputData output;
    output.steps.push_back("Initialize all vertices as free");
    
    // Create Hopcroft-Karp instance
    HopcroftKarp hk(input.workers, input.tasks);
    
    // Add edges
    for (const auto& edge : input.edges) {
        hk.addEdge(edge.first, edge.second);
    }
    
    // Run algorithm
    output.steps.push_back("While there exists an augmenting path:");
    output.maxMatching = hk.hopcroftKarpAlgorithm();
    output.steps.push_back("  Found augmenting paths using BFS");
    output.steps.push_back("  Updated matching using DFS");
    output.steps.push_back("Maximum bipartite matching size: " + to_string(output.maxMatching));
    
    // Get matches
    output.matches = hk.getMatching();
    
    return output;
}

// Function to run Edmonds-Karp algorithm
OutputData runEdmondsKarp(const InputData& input) {
    OutputData output;
    output.steps.push_back("Create residual graph with source and sink");
    output.steps.push_back("Source (0) connected to all workers with capacity 1");
    output.steps.push_back("All tasks connected to sink with capacity 1");
    output.steps.push_back("Workers connected to tasks based on input edges");
    
    // Create Edmonds-Karp instance
    EdmondsKarp ek(input.workers, input.tasks);
    
    // Add edges
    for (const auto& edge : input.edges) {
        ek.addWorkerTaskEdge(edge.first, edge.second);
    }
    
    // Run algorithm
    output.steps.push_back("While there exists an augmenting path:");
    output.maxMatching = ek.edmondsKarpAlgorithm();
    output.steps.push_back("  Found augmenting path using BFS");
    output.steps.push_back("  Updated residual capacities");
    output.steps.push_back("Maximum flow: " + to_string(output.maxMatching));
    
    // Get matches
    output.matches = ek.getMatching();
    
    return output;
}

// Main function
int main(int argc, char* argv[]) {
    if (argc < 4) {
        cerr << "Usage: " << argv[0] << " <algorithm> <input_file> <output_file>" << endl;
        cerr << "  algorithm: hopcroft-karp or edmonds-karp" << endl;
        return 1;
    }
    
    string algorithm = argv[1];
    string inputFile = argv[2];
    string outputFile = argv[3];
    
    // Read input file
    ifstream inFile(inputFile);
    if (!inFile) {
        cerr << "Error: Could not open input file " << inputFile << endl;
        return 1;
    }
    
    stringstream buffer;
    buffer << inFile.rdbuf();
    string inputJson = buffer.str();
    inFile.close();
    
    // Parse input
    InputData input = parseInput(inputJson);
    
    // Run algorithm
    OutputData output;
    if (algorithm == "hopcroft-karp") {
        output = runHopcroftKarp(input);
    } else if (algorithm == "edmonds-karp") {
        output = runEdmondsKarp(input);
    } else {
        cerr << "Error: Unknown algorithm " << algorithm << endl;
        return 1;
    }
    
    // Generate output
    string outputJson = generateOutput(output);
    
    // Write output file
    ofstream outFile(outputFile);
    if (!outFile) {
        cerr << "Error: Could not open output file " << outputFile << endl;
        return 1;
    }
    
    outFile << outputJson;
    outFile.close();
    
    return 0;
}
