#!/bin/bash

# Create build directory
mkdir -p build
cd build

# Configure and build
cmake ..
make

# Copy executable to parent directory
cp bipartite_flow ..

echo "Build complete. Executable is at ./bipartite_flow"
