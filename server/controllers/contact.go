package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

type ContactForm struct {
    Name    string `json:"name"`
    Email   string `json:"email"`
    Message string `json:"message"`
}

func SubmitContact(c *gin.Context) {
    var form ContactForm
    if err := c.ShouldBindJSON(&form); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    // Normally store or email form details
    c.JSON(http.StatusOK, gin.H{"status": "Message received"})
}