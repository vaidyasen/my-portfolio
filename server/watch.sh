#!/bin/bash

echo "Starting Go server with file watching..."
echo "Press Ctrl+C to stop"

# Function to start the server
start_server() {
    echo "Starting server..."
    go run main.go &
    SERVER_PID=$!
    echo "Server started with PID: $SERVER_PID"
}

# Function to stop the server
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "Stopping server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
    # Also kill any process on port 8080
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
}

# Function to restart the server
restart_server() {
    echo "File change detected, restarting server..."
    stop_server
    sleep 1
    start_server
}

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    stop_server
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the server initially
start_server

# Watch for file changes
fswatch -o --include='\.go$' . | while read f; do
    restart_server
done
