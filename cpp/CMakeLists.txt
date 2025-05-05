cmake_minimum_required(VERSION 3.10)
project(BipartiteFlowAlgorithms)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add executable
add_executable(bipartite_flow main.cpp)

# Install target
install(TARGETS bipartite_flow DESTINATION bin)
