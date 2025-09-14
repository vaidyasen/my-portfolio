// Package middleware - Error handling middleware following SOLID principles
package middleware

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details any    `json:"details,omitempty"`
}

// ErrorHandler provides centralized error handling
func ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			log.Printf("Panic recovered: %s\n%s", err, debug.Stack())
			c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
				Code:  "INTERNAL_ERROR",
			})
		}
		c.Abort()
	})
}

// ValidationErrorHandler handles validation errors
func ValidationErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			// Handle different types of errors
			switch err.Type {
			case gin.ErrorTypeBind:
				c.JSON(http.StatusBadRequest, ErrorResponse{
					Error: "Invalid request data",
					Code:  "VALIDATION_ERROR",
					Details: err.Error(),
				})
			case gin.ErrorTypePublic:
				c.JSON(http.StatusBadRequest, ErrorResponse{
					Error: err.Error(),
					Code:  "CLIENT_ERROR",
				})
			default:
				log.Printf("Internal error: %s", err.Error())
				c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error: "Internal server error",
					Code:  "INTERNAL_ERROR",
				})
			}
		}
	}
}

// LoggingMiddleware logs all requests
func LoggingMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

// SecurityHeaders adds security headers
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

// RequestSizeLimit limits request body size
func RequestSizeLimit(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxSize)
		c.Next()
	}
}