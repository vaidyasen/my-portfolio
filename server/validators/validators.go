// Package validators - Input validation following SOLID principles
package validators

import (
	"errors"
	"regexp"
	"strings"

	"github.com/ritikvaidyasen/portfolio-server/models"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ValidationResult represents validation result
type ValidationResult struct {
	IsValid bool              `json:"is_valid"`
	Errors  []ValidationError `json:"errors"`
}

// Validator interface for different validators
type Validator interface {
	Validate() ValidationResult
}

// ContactValidator validates contact form data
type ContactValidator struct {
	Contact *models.Contact
}

// NewContactValidator creates a new contact validator
func NewContactValidator(contact *models.Contact) *ContactValidator {
	return &ContactValidator{Contact: contact}
}

// Validate validates contact data
func (v *ContactValidator) Validate() ValidationResult {
	var errors []ValidationError

	// Validate name
	if v.Contact.Name == "" {
		errors = append(errors, ValidationError{
			Field:   "name",
			Message: "Name is required",
		})
	} else if len(strings.TrimSpace(v.Contact.Name)) < 2 {
		errors = append(errors, ValidationError{
			Field:   "name",
			Message: "Name must be at least 2 characters long",
		})
	} else if len(v.Contact.Name) > 100 {
		errors = append(errors, ValidationError{
			Field:   "name",
			Message: "Name must not exceed 100 characters",
		})
	}

	// Validate email
	if v.Contact.Email == "" {
		errors = append(errors, ValidationError{
			Field:   "email",
			Message: "Email is required",
		})
	} else if !isValidEmail(v.Contact.Email) {
		errors = append(errors, ValidationError{
			Field:   "email",
			Message: "Email format is invalid",
		})
	}

	// Validate message
	if v.Contact.Message == "" {
		errors = append(errors, ValidationError{
			Field:   "message",
			Message: "Message is required",
		})
	} else if len(strings.TrimSpace(v.Contact.Message)) < 10 {
		errors = append(errors, ValidationError{
			Field:   "message",
			Message: "Message must be at least 10 characters long",
		})
	} else if len(v.Contact.Message) > 1000 {
		errors = append(errors, ValidationError{
			Field:   "message",
			Message: "Message must not exceed 1000 characters",
		})
	}

	return ValidationResult{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}

// ProjectValidator validates project data
type ProjectValidator struct {
	Project *models.Project
}

// NewProjectValidator creates a new project validator
func NewProjectValidator(project *models.Project) *ProjectValidator {
	return &ProjectValidator{Project: project}
}

// Validate validates project data
func (v *ProjectValidator) Validate() ValidationResult {
	var errors []ValidationError

	// Validate title
	if v.Project.Title == "" {
		errors = append(errors, ValidationError{
			Field:   "title",
			Message: "Title is required",
		})
	} else if len(v.Project.Title) < 3 {
		errors = append(errors, ValidationError{
			Field:   "title",
			Message: "Title must be at least 3 characters long",
		})
	} else if len(v.Project.Title) > 100 {
		errors = append(errors, ValidationError{
			Field:   "title",
			Message: "Title must not exceed 100 characters",
		})
	}

	// Validate description
	if v.Project.Description == "" {
		errors = append(errors, ValidationError{
			Field:   "description",
			Message: "Description is required",
		})
	} else if len(v.Project.Description) < 10 {
		errors = append(errors, ValidationError{
			Field:   "description",
			Message: "Description must be at least 10 characters long",
		})
	}

	// Validate technologies
	if len(v.Project.Technologies) == 0 {
		errors = append(errors, ValidationError{
			Field:   "technologies",
			Message: "At least one technology is required",
		})
	}

	// Validate URLs if provided
	if v.Project.GitHub != "" && !isValidURL(v.Project.GitHub) {
		errors = append(errors, ValidationError{
			Field:   "github",
			Message: "GitHub URL format is invalid",
		})
	}

	if v.Project.Live != "" && !isValidURL(v.Project.Live) {
		errors = append(errors, ValidationError{
			Field:   "live",
			Message: "Live URL format is invalid",
		})
	}

	return ValidationResult{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}

// Helper functions
func isValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func isValidURL(url string) bool {
	urlRegex := regexp.MustCompile(`^https?://[^\s/$.?#].[^\s]*$`)
	return urlRegex.MatchString(url)
}

// ValidateStruct validates any struct implementing Validator interface
func ValidateStruct(validator Validator) error {
	result := validator.Validate()
	if !result.IsValid {
		// Return first error
		if len(result.Errors) > 0 {
			return errors.New(result.Errors[0].Message)
		}
	}
	return nil
}