package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetResume(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"url":  "/resume.pdf",
		"name": "Ritik_Vaidyasen_Resume.pdf",
	})
}
