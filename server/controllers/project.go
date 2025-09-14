package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/services"
)

var projectService = services.NewProjectService()

// GetProjects handles GET /api/projects
func GetProjects(c *gin.Context) {
	// Check if filtering by featured projects
	featured := c.Query("featured") == "true"
	
	projects, err := projectService.GetProjects(featured)
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

	project, err := projectService.GetProjectByID(uint(id))
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
