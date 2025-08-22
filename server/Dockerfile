# Build stage
FROM golang:1.23-alpine AS builder

# Set necessary environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=amd64

# Install build dependencies
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Set work directory
WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -ldflags="-s -w" -o portfolio-server .

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates sqlite tzdata

# Set work directory
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /build/portfolio-server .

# Copy resume file
COPY --from=builder /build/resume.pdf .

# Expose port
EXPOSE 8080

# Set environment variables
ENV GIN_MODE=release
ENV PORT=8080

# Run the application
CMD ["./portfolio-server"]
