package controllers

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
)

// Public endpoint for getting published blog posts
func GetBlogs(c *gin.Context) {
	var blogs []models.BlogPost
	query := config.DB.Where("published = ?", true)

	// Pagination for public endpoint
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	query.Model(&models.BlogPost{}).Count(&total)

	// Get published blog posts, ordered by published_at desc
	if err := query.Offset(offset).Limit(limit).Order("published_at DESC").Find(&blogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch blog posts",
		})
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

// Public endpoint for getting a single blog post by slug
func GetBlogBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var blog models.BlogPost

	if err := config.DB.Where("slug = ? AND published = ?", slug, true).First(&blog).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
		return
	}

	// Increment view count
	config.DB.Model(&blog).Update("view_count", blog.ViewCount+1)

	c.JSON(http.StatusOK, gin.H{"blog": blog})
}

func GetAdminBlogPosts(c *gin.Context) {
	var blogs []models.BlogPost
	query := config.DB

	// Search functionality
	if search := c.Query("search"); search != "" {
		query = query.Where("title LIKE ? OR content LIKE ? OR excerpt LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Status filter
	if status := c.Query("status"); status != "" {
		query = query.Where("published = ?", status == "published")
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

	blog.Slug = uniqueBlogSlug(blog.Title, blog.Slug, 0)
	setPublishedAt(&blog)

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

	updateData.ID = blog.ID
	updateData.CreatedAt = blog.CreatedAt
	updateData.Slug = uniqueBlogSlug(updateData.Title, updateData.Slug, blog.ID)
	setPublishedAt(&updateData)

	if err := config.DB.Save(&updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blog post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"blog": updateData})
}

var nonSlugCharacters = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(value string) string {
	slug := strings.Trim(nonSlugCharacters.ReplaceAllString(strings.ToLower(value), "-"), "-")
	if slug == "" {
		return "blog-post"
	}
	return slug
}

func uniqueBlogSlug(title, requestedSlug string, excludeID uint) string {
	base := requestedSlug
	if base == "" {
		base = title
	}
	base = slugify(base)
	candidate := base

	for suffix := 2; ; suffix++ {
		var count int64
		query := config.DB.Model(&models.BlogPost{}).Where("slug = ?", candidate)
		if excludeID != 0 {
			query = query.Where("id <> ?", excludeID)
		}
		query.Count(&count)
		if count == 0 {
			return candidate
		}
		candidate = fmt.Sprintf("%s-%d", base, suffix)
	}
}

func setPublishedAt(blog *models.BlogPost) {
	if !blog.Published {
		blog.PublishedAt = nil
		return
	}
	if blog.PublishedAt == nil {
		now := time.Now()
		blog.PublishedAt = &now
	}
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
