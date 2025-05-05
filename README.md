# Bipartite Matching & Maximum Flow Visualizer

A responsive React web application that visualizes bipartite matching and maximum flow algorithms using C++ implementations. This interactive tool helps users understand how these important graph algorithms work through visual representation and step-by-step execution.

![Bipartite Matching Visualizer](https://placeholder.svg?height=400&width=800&query=Bipartite+Matching+and+Maximum+Flow+Visualizer+Screenshot)

## Features

### 📊 Input Panel
- Configure the number of workers and tasks
- Add edges between workers and tasks (e.g., Worker 1 → Task 3)
- Run either Hopcroft-Karp or Edmonds-Karp algorithms with a single click

### 🧠 Algorithm Execution Panel
- Display C++ code and execution steps
- Show matched pairs for Hopcroft-Karp algorithm
- Display max flow value and matched edges for Edmonds-Karp algorithm
- Syntax-highlighted results for better readability

### 🖼️ Graph Visualization
- Interactive bipartite graph visualization
- Workers displayed on the left side, tasks on the right
- Matched edges highlighted in green
- Powered by vis-network.js for smooth interaction

### 🎨 Modern UI/UX
- Fully responsive layout using Tailwind CSS
- Soft-rounded cards and clear typography
- Tab-based interface for easy navigation
- Toast notifications for user feedback

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- C++ compiler (g++ or clang) for the C++ algorithms
- CMake 3.10 or higher (for building the C++ code)

### Setup
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/bipartite-flow-visualizer.git
   cd bipartite-flow-visualizer
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Build the C++ code:
   \`\`\`bash
   cd cpp
   ./build.sh
   cd ..
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open your browser and navigate to `http://localhost:3000`

## C++ Algorithm Implementations

The application uses C++ implementations of the Hopcroft-Karp and Edmonds-Karp algorithms. These algorithms are located in the `cpp` directory:

- `hopcroft_karp.cpp`: Implementation of the Hopcroft-Karp algorithm
- `edmonds_karp.cpp`: Implementation of the Edmonds-Karp algorithm
- `main.cpp`: Command-line interface for running the algorithms
- `CMakeLists.txt`: CMake configuration for building the C++ code
- `build.sh`: Shell script for building the C++ code

### Building the C++ Code

To build the C++ code, run the following commands:

\`\`\`bash
cd cpp
./build.sh
\`\`\`

This will create an executable called `bipartite_flow` in the `cpp` directory.

### Running the C++ Code Directly

You can run the C++ code directly from the command line:

\`\`\`bash
./cpp/bipartite_flow hopcroft-karp input.json output.json
# or
./cpp/bipartite_flow edmonds-karp input.json output.json
\`\`\`

Where:
- `hopcroft-karp` or `edmonds-karp` is the algorithm to run
- `input.json` is a JSON file containing the input graph data
- `output.json` is the file where the results will be written

Example input.json:
\`\`\`json
{
  "workers": 4,
  "tasks": 4,
  "edges": [
    {"from": 1, "to": 1},
    {"from": 1, "to": 2},
    {"from": 2, "to": 1},
    {"from": 3, "to": 3},
    {"from": 4, "to": 2},
    {"from": 4, "to": 4}
  ]
}
\`\`\`

## Integration with React Frontend

In a production environment, the React frontend would call the C++ executable through a Node.js API route. For this demonstration, we're simulating the C++ execution in JavaScript.

To integrate the actual C++ code with the React frontend, you would need to:

1. Create a Node.js API route that executes the C++ binary
2. Pass the graph data from the frontend to the API route
3. Execute the C++ binary with the graph data
4. Parse the output from the C++ binary and return it to the frontend

## Project Structure

\`\`\`
bipartite-flow-visualizer/
├── app/
│   ├── api/
│   │   └── algorithms/
│   │       ├── hopcroft-karp/
│   │       │   └── route.ts       # API route for Hopcroft-Karp
│   │       └── edmonds-karp/
│   │           └── route.ts       # API route for Edmonds-Karp
│   ├── page.tsx                   # Main page component
│   └── layout.tsx                 # App layout
├── components/
│   ├── algorithm-panel.tsx        # Algorithm results display
│   ├── algorithm-visualizer.tsx   # Main component with algorithm logic
│   ├── graph-visualization.tsx    # Graph visualization component
│   └── input-panel.tsx            # Input configuration panel
├── cpp/
│   ├── hopcroft_karp.cpp          # Hopcroft-Karp algorithm implementation
│   ├── edmonds_karp.cpp           # Edmonds-Karp algorithm implementation
│   ├── main.cpp                   # Command-line interface
│   ├── CMakeLists.txt             # CMake configuration
│   └── build.sh                   # Build script
├── hooks/
│   ├── use-mobile.ts              # Responsive design hook
│   └── use-toast.ts               # Toast notification hook
└── README.md                      # This file
\`\`\`

## Future Improvements

- Implement actual C++ execution using WebAssembly or Node.js addons
- Add step-by-step algorithm animation
- Support for weighted bipartite graphs
- Additional graph algorithms (Hungarian, Ford-Fulkerson)
- Export/import graph configurations
- Dark mode support
- Performance optimizations for larger graphs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The algorithms are based on standard implementations of Hopcroft-Karp and Edmonds-Karp
- UI design inspired by modern web applications
- Thanks to the creators of vis-network.js for the graph visualization library
