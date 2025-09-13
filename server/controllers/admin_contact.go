package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
)

// GetAdminContacts - Get all contact messages for admin
func GetAdminContacts(c *gin.Context) {
	var contacts []models.Contact
	
	// Get pagination parameters
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	
	pageInt, _ := strconv.Atoi(page)
	limitInt, _ := strconv.Atoi(limit)
	offset := (pageInt - 1) * limitInt
	
	// Get total count
	var total int64
	config.DB.Model(&models.Contact{}).Count(&total)
	
	// Get contacts with pagination, ordered by newest first
	if err := config.DB.Order("created_at DESC").Offset(offset).Limit(limitInt).Find(&contacts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contacts"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"contacts": contacts,
		"pagination": gin.H{
			"page":  pageInt,
			"limit": limitInt,
			"total": total,
			"pages": (total + int64(limitInt) - 1) / int64(limitInt),
		},
	})
}

// GetAdminContact - Get a specific contact message
func GetAdminContact(c *gin.Context) {
	id := c.Param("id")
	var contact models.Contact
	
	if err := config.DB.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}
	
	c.JSON(http.StatusOK, contact)
}

// DeleteAdminContact - Delete a contact message
func DeleteAdminContact(c *gin.Context) {
	id := c.Param("id")
	var contact models.Contact
	
	if err := config.DB.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}
	
	if err := config.DB.Delete(&contact).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Contact deleted successfully"})
}

// MarkContactAsRead - Mark a contact message as read/unread
func MarkContactAsRead(c *gin.Context) {
	id := c.Param("id")
	var contact models.Contact
	
	if err := config.DB.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}
	
	var updateData struct {
		Read bool `json:"read"`
	}
	
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	contact.Read = updateData.Read
	
	if err := config.DB.Save(&contact).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact"})
		return
	}
	
	c.JSON(http.StatusOK, contact)
}
