package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/ritikvaidyasen/portfolio-server/config"
    "github.com/ritikvaidyasen/portfolio-server/models"
)

type ContactForm struct {
    Name    string `json:"name" binding:"required"`
    Email   string `json:"email" binding:"required,email"`
    Message string `json:"message" binding:"required"`
}

func SubmitContact(c *gin.Context) {
    var form ContactForm
    if err := c.ShouldBindJSON(&form); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Create contact record in database
    contact := models.Contact{
        Name:    form.Name,
        Email:   form.Email,
        Message: form.Message,
    }

    if err := config.DB.Create(&contact).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save contact message"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Message received successfully",
    })
}