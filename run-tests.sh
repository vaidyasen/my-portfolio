#!/bin/bash

# Portfolio Test Runner
# This script runs both client and server tests

set -e

echo "🧪 Running Portfolio Test Suite"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Track test results
CLIENT_TESTS_PASSED=false
SERVER_TESTS_PASSED=false
TOTAL_START_TIME=$(date +%s)

# Client Tests
echo ""
echo "🔍 Running Client Tests..."
echo "=========================="

cd client

if npm test -- --coverage --watchAll=false --verbose; then
    print_status "Client tests passed!"
    CLIENT_TESTS_PASSED=true
else
    print_error "Client tests failed!"
    CLIENT_TESTS_PASSED=false
fi

cd ..

# Server Tests
echo ""
echo "🔍 Running Server Tests..."
echo "=========================="

cd server

if go test -v -cover ./...; then
    print_status "Server tests passed!"
    SERVER_TESTS_PASSED=true
else
    print_error "Server tests failed!"
    SERVER_TESTS_PASSED=false
fi

cd ..

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="

TOTAL_END_TIME=$(date +%s)
TOTAL_DURATION=$((TOTAL_END_TIME - TOTAL_START_TIME))

if [ "$CLIENT_TESTS_PASSED" = true ]; then
    print_status "Client Tests: PASSED"
else
    print_error "Client Tests: FAILED"
fi

if [ "$SERVER_TESTS_PASSED" = true ]; then
    print_status "Server Tests: PASSED"
else
    print_error "Server Tests: FAILED"
fi

echo ""
echo "⏱️  Total execution time: ${TOTAL_DURATION}s"

# Exit with appropriate code
if [ "$CLIENT_TESTS_PASSED" = true ] && [ "$SERVER_TESTS_PASSED" = true ]; then
    print_status "All tests passed! 🎉"
    exit 0
else
    print_error "Some tests failed!"
    exit 1
fi