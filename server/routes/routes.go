package routes

import (
	"github.com/ritikvaidyasen/portfolio-server/controllers"
	"github.com/ritikvaidyasen/portfolio-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	// API routes group
	api := r.Group("/api")
	{
		api.GET("/projects", controllers.GetProjects)
		api.POST("/contact", controllers.SubmitContact)
		api.GET("/resume", controllers.GetResume)
	}
	
	// Auth routes
	auth := r.Group("/auth")
	{
		auth.POST("/login", controllers.AdminLogin)
		auth.POST("/setup", controllers.CreateAdminUser) // Remove in production
		auth.POST("/migrate-projects", controllers.MigrateExistingProjects) // One-time migration
	}
	
	// Admin routes - protected by JWT and admin role
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.AdminMiddleware())
	{
		// Dashboard
		admin.GET("/dashboard", controllers.GetAdminDashboard)
		
		// Projects CRUD
		projectsAdmin := admin.Group("/projects")
		{
			projectsAdmin.GET("", controllers.GetAdminProjects)
			projectsAdmin.GET("/:id", controllers.GetAdminProject)
			projectsAdmin.POST("", controllers.CreateAdminProject)
			projectsAdmin.PUT("/:id", controllers.UpdateAdminProject)
			projectsAdmin.DELETE("/:id", controllers.DeleteAdminProject)
		}
		
		// Skills CRUD
		skillsAdmin := admin.Group("/skills")
		{
			skillsAdmin.GET("", controllers.GetAdminSkills)
			skillsAdmin.POST("", controllers.CreateAdminSkill)
			skillsAdmin.PUT("/:id", controllers.UpdateAdminSkill)
			skillsAdmin.DELETE("/:id", controllers.DeleteAdminSkill)
		}
		
		// Blog Posts CRUD
		blogsAdmin := admin.Group("/blogs")
		{
			blogsAdmin.GET("", controllers.GetAdminBlogPosts)
			blogsAdmin.POST("", controllers.CreateAdminBlogPost)
			blogsAdmin.PUT("/:id", controllers.UpdateAdminBlogPost)
			blogsAdmin.DELETE("/:id", controllers.DeleteAdminBlogPost)
		}
	}
	
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Portfolio API is running",
		})
	})
}
