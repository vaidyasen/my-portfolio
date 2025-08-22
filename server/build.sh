#!/bin/bash
# Build script for Render deployment

echo "Building Go application..."
go mod download
go build -o portfolio-server main.go

echo "Build completed successfully!"
