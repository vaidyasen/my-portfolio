package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/services"
)

// GetProjects handles GET /api/projects
func GetProjects(c *gin.Context) {
	// Check if filtering by featured projects
	featured := c.Query("featured") == "true"

	// Create the service after the application has initialized the database.
	// A package-level service captured config.DB before main called InitDB,
	// leaving every project request with a permanently nil database handle.
	projects, err := services.NewProjectService().GetProjects(featured)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"count":    len(projects),
	})
}

// GetProjectByID handles GET /api/projects/:id
func GetProjectByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	project, err := services.NewProjectService().GetProjectByID(uint(id))
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "project not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"project": project,
	})
}
