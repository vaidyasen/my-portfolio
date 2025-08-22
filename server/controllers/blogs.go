package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
)

func GetAdminBlogPosts(c *gin.Context) {
	var blogs []models.BlogPost
	query := config.DB

	// Search functionality
	if search := c.Query("search"); search != "" {
		query = query.Where("title LIKE ? OR content LIKE ? OR excerpt LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Status filter
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	query.Model(&models.BlogPost{}).Count(&total)

	result := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&blogs)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch blog posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"blogs": blogs,
		"pagination": gin.H{
			"total":       total,
			"page":        page,
			"limit":       limit,
			"total_pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

func CreateAdminBlogPost(c *gin.Context) {
	var blog models.BlogPost
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := config.DB.Create(&blog)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create blog post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"blog": blog})
}

func UpdateAdminBlogPost(c *gin.Context) {
	id := c.Param("id")
	var blog models.BlogPost

	if err := config.DB.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
		return
	}

	var updateData models.BlogPost
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the blog post
	if err := config.DB.Model(&blog).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blog post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"blog": blog})
}

func DeleteAdminBlogPost(c *gin.Context) {
	id := c.Param("id")
	var blog models.BlogPost

	if err := config.DB.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
		return
	}

	if err := config.DB.Delete(&blog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete blog post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Blog post deleted successfully"})
}
