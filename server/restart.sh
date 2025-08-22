#!/bin/bash

# Kill any existing Go process on port 8080
echo "Stopping existing server..."
pkill -f "go run main.go" 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Start the server
echo "Starting server..."
cd /Users/rvaidyas/Desktop/Code/projects/my-portfolio/my-portfolio/server
go run main.go
