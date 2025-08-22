package controllers

import (
	"net/http"
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/middleware"
	"github.com/ritikvaidyasen/portfolio-server/models"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

func AdminLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	result := config.DB.Where("username = ? AND role = ?", req.Username, "admin").First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check password using bcrypt
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := middleware.GenerateJWT(user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token: token,
		User:  user,
	})
}

func CreateAdminUser(c *gin.Context) {
	// This is for initial setup - you might want to protect this endpoint
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	
	user := models.User{
		Username: "admin",
		Email:    "admin@example.com",
		Password: string(hashedPassword),
		Role:     "admin",
	}

	result := config.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Admin user created successfully"})
}

func GetAdminDashboard(c *gin.Context) {
	var projectCount, skillCount, blogCount int64
	
	config.DB.Model(&models.Project{}).Count(&projectCount)
	config.DB.Model(&models.Skill{}).Count(&skillCount)
	config.DB.Model(&models.BlogPost{}).Count(&blogCount)
	
	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"projects": projectCount,
			"skills":   skillCount,
			"blogs":    blogCount,
		},
	})
}

func MigrateExistingProjects(c *gin.Context) {
	// Hardcoded projects from the original project.go
	existingProjects := []models.Project{
		{
			Title:        "GamerIT",
			Description:  "MERN stack application for gamer community & matchmaking. A comprehensive platform built with MongoDB, Express.js, React, and Node.js that connects gamers worldwide. Features include user profiles, game matching algorithms, real-time chat, tournament organization, and social networking capabilities.",
			Image:        "https://via.placeholder.com/400x300?text=GamerIT",
			Technologies: []string{"React", "Node.js", "MongoDB", "Express.js", "Socket.io", "JWT"},
			GitHub:       "https://github.com/ritikvaidyasen/gamerit",
			Live:         "https://gamerit-demo.vercel.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Complaint Box",
			Description:  "Full stack complaint resolution platform with admin dashboard. A robust complaint management system featuring user authentication, ticket tracking, admin dashboard, automated email notifications, and analytics. Built with modern web technologies for scalability and performance.",
			Image:        "https://via.placeholder.com/400x300?text=Complaint+Box",
			Technologies: []string{"React", "Go", "PostgreSQL", "Redis", "Docker"},
			GitHub:       "https://github.com/ritikvaidyasen/complaint-box",
			Live:         "https://complaint-box-demo.herokuapp.com",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Portfolio Website",
			Description:  "Personal portfolio built with React and Go. A modern, responsive portfolio website showcasing my projects and skills. Features include dark/light theme toggle, contact form with backend integration, project showcase with filtering, and optimized performance.",
			Image:        "https://via.placeholder.com/400x300?text=Portfolio",
			Technologies: []string{"React", "Go", "TailwindCSS", "Framer Motion", "SQLite"},
			GitHub:       "https://github.com/ritikvaidyasen/portfolio",
			Live:         "https://ritikvaidyasen.dev",
			Category:     "Portfolio",
			Status:       "In Progress",
			Featured:     false,
		},
		{
			Title:        "E-commerce API",
			Description:  "RESTful API for e-commerce platform with microservices architecture. A scalable e-commerce backend API built with microservices architecture. Includes user management, product catalog, shopping cart, order processing, payment integration, and inventory management.",
			Image:        "https://via.placeholder.com/400x300?text=E-commerce+API",
			Technologies: []string{"Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC"},
			GitHub:       "https://github.com/ritikvaidyasen/ecommerce-api",
			Live:         "",
			Category:     "Backend",
			Status:       "Completed",
			Featured:     false,
		},
	}

	// Check if projects already exist to avoid duplicates
	var existingCount int64
	config.DB.Model(&models.Project{}).Count(&existingCount)
	
	if existingCount > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Projects already migrated", "count": existingCount})
		return
	}

	// Insert projects into database
	result := config.DB.Create(&existingProjects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to migrate projects"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Projects migrated successfully",
		"count":   len(existingProjects),
	})
}
