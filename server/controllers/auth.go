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
	// Request structure for creating admin
	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if admin already exists
	var existingUser models.User
	if err := config.DB.Where("role = ?", "admin").First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Admin user already exists"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	
	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     "admin",
	}

	result := config.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Admin user created successfully",
		"username": user.Username,
		"email": user.Email,
	})
}

func GetAdminDashboard(c *gin.Context) {
	var projectCount, skillCount, blogCount, contactCount, unreadContactCount int64
	
	config.DB.Model(&models.Project{}).Count(&projectCount)
	config.DB.Model(&models.Skill{}).Count(&skillCount)
	config.DB.Model(&models.BlogPost{}).Count(&blogCount)
	config.DB.Model(&models.Contact{}).Count(&contactCount)
	config.DB.Model(&models.Contact{}).Where("read = ?", false).Count(&unreadContactCount)
	
	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"projects":         projectCount,
			"skills":          skillCount,
			"blogs":           blogCount,
			"contacts":        contactCount,
			"unread_contacts": unreadContactCount,
		},
	})
}

// Get current admin user details
func GetAdminUser(c *gin.Context) {
	var user models.User
	if err := config.DB.Where("role = ?", "admin").First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": user.ID,
		"username": user.Username,
		"email": user.Email,
		"role": user.Role,
		"created_at": user.CreatedAt,
	})
}

// Update admin credentials
func UpdateAdminUser(c *gin.Context) {
	var req struct {
		Username    string `json:"username"`
		Email       string `json:"email"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("role = ?", "admin").First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin user not found"})
		return
	}

	// Update fields if provided
	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.NewPassword != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = string(hashedPassword)
	}

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin user updated successfully",
		"username": user.Username,
		"email": user.Email,
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
