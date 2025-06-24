package models

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"gorm.io/gorm"
)

type Contact struct {
	gorm.Model
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func SubmitContact(c *gin.Context) {
	var contact Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&contact)
	c.JSON(http.StatusOK, gin.H{"message": "Message received"})
}
