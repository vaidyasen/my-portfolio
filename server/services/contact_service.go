// Package services - Contact service following SOLID principles
package services

import (
	"errors"
	"regexp"

	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
	"gorm.io/gorm"
)

const (
	ErrContactNotFound = "contact not found"
	ErrFailedToFetch   = "failed to fetch contact"
	ErrFailedToUpdate  = "failed to update contact"
	ErrFailedToDelete  = "failed to delete contact"
)

// ContactService handles contact-related business logic
type ContactService struct {
	db *gorm.DB
}

// NewContactService creates a new contact service
func NewContactService() *ContactService {
	return &ContactService{
		db: config.DB,
	}
}

// SubmitContact creates a new contact submission
func (s *ContactService) SubmitContact(contact *models.Contact) error {
	if err := s.validateContact(contact); err != nil {
		return err
	}

	if err := s.db.Create(contact).Error; err != nil {
		return errors.New("failed to submit contact form")
	}

	return nil
}

// GetContacts retrieves all contact submissions with pagination
func (s *ContactService) GetContacts(page, limit int) ([]models.Contact, int64, error) {
	var contacts []models.Contact
	var total int64

	// Count total records
	if err := s.db.Model(&models.Contact{}).Count(&total).Error; err != nil {
		return nil, 0, errors.New("failed to count contacts")
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Fetch contacts with pagination
	if err := s.db.Order("created_at DESC").Offset(offset).Limit(limit).Find(&contacts).Error; err != nil {
		return nil, 0, errors.New("failed to fetch contacts")
	}

	return contacts, total, nil
}

// GetContactByID retrieves a contact by ID
func (s *ContactService) GetContactByID(id uint) (*models.Contact, error) {
	var contact models.Contact
	
	if err := s.db.First(&contact, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New(ErrContactNotFound)
		}
		return nil, errors.New(ErrFailedToFetch)
	}

	return &contact, nil
}

// MarkContactAsRead marks a contact as read
func (s *ContactService) MarkContactAsRead(id uint) error {
	result := s.db.Model(&models.Contact{}).Where("id = ?", id).Update("is_read", true)
	
	if result.Error != nil {
		return errors.New(ErrFailedToUpdate)
	}

	if result.RowsAffected == 0 {
		return errors.New(ErrContactNotFound)
	}

	return nil
}

// DeleteContact deletes a contact by ID
func (s *ContactService) DeleteContact(id uint) error {
	result := s.db.Delete(&models.Contact{}, id)
	
	if result.Error != nil {
		return errors.New(ErrFailedToDelete)
	}

	if result.RowsAffected == 0 {
		return errors.New(ErrContactNotFound)
	}

	return nil
}

// validateContact validates contact data
func (s *ContactService) validateContact(contact *models.Contact) error {
	if contact.Name == "" {
		return errors.New("name is required")
	}

	if len(contact.Name) < 2 {
		return errors.New("name must be at least 2 characters long")
	}

	if contact.Email == "" {
		return errors.New("email is required")
	}

	if !s.isValidEmail(contact.Email) {
		return errors.New("invalid email format")
	}

	if contact.Message == "" {
		return errors.New("message is required")
	}

	if len(contact.Message) < 10 {
		return errors.New("message must be at least 10 characters long")
	}

	return nil
}

// isValidEmail validates email format
func (s *ContactService) isValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}