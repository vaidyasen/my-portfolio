package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
)

// Admin Projects CRUD
func GetAdminProjects(c *gin.Context) {
	var projects []models.Project
	
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	category := c.Query("category")
	
	query := config.DB
	
	if search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}
	
	if category != "" {
		query = query.Where("category = ?", category)
	}
	
	var total int64
	query.Model(&models.Project{}).Count(&total)
	
	offset := (page - 1) * limit
	result := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&projects)
	
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

func GetAdminProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	
	result := config.DB.First(&project, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"project": project})
}

func CreateAdminProject(c *gin.Context) {
	var project models.Project
	
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	result := config.DB.Create(&project)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"project": project})
}

func UpdateAdminProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	
	result := config.DB.First(&project, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	
	var updateData models.Project
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	result = config.DB.Model(&project).Updates(updateData)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"project": project})
}

func DeleteAdminProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	
	result := config.DB.First(&project, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	
	result = config.DB.Delete(&project)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}
