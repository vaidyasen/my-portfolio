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
		api.GET("/projects/:id", controllers.GetProjectByID)
		api.GET("/skills", controllers.GetSkills)
		api.GET("/blogs", controllers.GetBlogs)
		api.GET("/blogs/:slug", controllers.GetBlogBySlug)
		api.POST("/contact", controllers.SubmitContact)
		api.GET("/resume", controllers.GetResume)
	}

	// Auth routes
	auth := r.Group("/auth")
	{
		auth.POST("/login", controllers.AdminLogin)
		auth.POST("/setup", controllers.CreateAdminUser)                      // Remove in production
		auth.POST("/migrate-projects", controllers.MigrateExistingProjects)   // One-time migration
		auth.POST("/update-projects", controllers.UpdateProjectsFromGitHub)   // Update projects with GitHub data
		auth.POST("/real-projects", controllers.UpdateWithRealGitHubProjects) // Update with real GitHub projects
		auth.POST("/seed-skills", controllers.SeedSkills)                     // Seed initial skills data
	}

	// Admin routes - protected by JWT and admin role
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.AdminMiddleware())
	{
		// Dashboard
		admin.GET("/dashboard", controllers.GetAdminDashboard)

		// Admin user management
		admin.GET("/user", controllers.GetAdminUser)
		admin.PUT("/user", controllers.UpdateAdminUser)

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

		// Contact Messages Management
		contactsAdmin := admin.Group("/contacts")
		{
			contactsAdmin.GET("", controllers.GetAdminContacts)
			contactsAdmin.GET("/:id", controllers.GetAdminContact)
			contactsAdmin.PUT("/:id/read", controllers.MarkContactAsRead)
			contactsAdmin.DELETE("/:id", controllers.DeleteAdminContact)
		}
	}

	// Health check endpoint
	r.StaticFile("/resume.pdf", "resume.pdf")

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Portfolio API is running",
		})
	})
}
