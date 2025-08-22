package controllers

import (
	"net/http"

	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"

	"github.com/gin-gonic/gin"
)

func GetProjects(c *gin.Context) {
	var projects []models.Project
	
	// Check if filtering by featured projects
	featured := c.Query("featured")
	query := config.DB
	
	if featured == "true" {
		query = query.Where("featured = ?", true)
	}
	
	// Get projects from database
	if err := query.Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch projects",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"count":    len(projects),
	})
}
