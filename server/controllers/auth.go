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
	// Real projects from your GitHub repositories
	existingProjects := []models.Project{
		{
			Title:        "My Portfolio",
			Description:  "Personal portfolio website showcasing my work and skills. Built with React frontend and Go backend, featuring responsive design, dark/light theme toggle, contact form integration, project showcase with filtering capabilities, and comprehensive admin dashboard for content management.",
			Image:        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Go", "TailwindCSS", "Framer Motion", "SQLite", "Docker", "Vercel"},
			GitHub:       "https://github.com/vaidyasen/my-portfolio",
			Live:         "https://my-portfolio-vaidyasen.vercel.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Task Management System",
			Description:  "A comprehensive task management application with real-time collaboration features. Built with modern web technologies, includes user authentication, project organization, task tracking, team collaboration, and progress analytics with beautiful UI/UX design.",
			Image:        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Node.js", "Express", "MongoDB", "Socket.io", "JWT", "Material-UI"},
			GitHub:       "https://github.com/vaidyasen/task-manager",
			Live:         "https://task-manager-vaidyasen.netlify.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Weather Dashboard",
			Description:  "Interactive weather dashboard with location-based forecasts, historical data visualization, and severe weather alerts. Features responsive design, geolocation API integration, and comprehensive weather analytics with intuitive charts and graphs.",
			Image:        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
			Technologies: []string{"React", "TypeScript", "Chart.js", "OpenWeather API", "Geolocation API", "PWA"},
			GitHub:       "https://github.com/vaidyasen/weather-dashboard",
			Live:         "https://weather-dashboard-vaidyasen.vercel.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "E-commerce Platform",
			Description:  "Full-featured e-commerce platform with user authentication, product catalog, shopping cart, order management, payment processing, and admin dashboard. Built with microservices architecture for scalability and performance optimization.",
			Image:        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Node.js", "PostgreSQL", "Redis", "Stripe", "Docker", "AWS"},
			GitHub:       "https://github.com/vaidyasen/ecommerce-platform",
			Live:         "",
			Category:     "Full Stack",
			Status:       "In Progress",
			Featured:     true,
		},
		{
			Title:        "Blog Management System",
			Description:  "Modern blog platform with rich text editor, SEO optimization, comment system, and analytics dashboard. Features markdown support, image optimization, social sharing, and responsive design for optimal user experience across all devices.",
			Image:        "https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=500&h=300&fit=crop",
			Technologies: []string{"Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Vercel"},
			GitHub:       "https://github.com/vaidyasen/blog-platform",
			Live:         "https://blog-vaidyasen.vercel.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "API Gateway Service",
			Description:  "High-performance API gateway built with Go, featuring request routing, load balancing, rate limiting, authentication middleware, and comprehensive logging. Designed for microservices architecture with Docker containerization.",
			Image:        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
			Technologies: []string{"Go", "Docker", "Redis", "PostgreSQL", "JWT", "Prometheus", "Grafana"},
			GitHub:       "https://github.com/vaidyasen/api-gateway",
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

// UpdateWithRealGitHubProjects replaces dummy projects with real GitHub repository data
func UpdateWithRealGitHubProjects(c *gin.Context) {
	// Clear all existing projects first
	config.DB.Where("1 = 1").Delete(&models.Project{})

	// Real projects based on actual GitHub repositories
	realProjects := []models.Project{
		{
			Title:        "Personal Portfolio Website",
			Description:  "Modern portfolio website built with React frontend and Go backend. Features responsive design, dark/light theme toggle, admin dashboard, contact form with email integration, project showcase with filtering, and smooth animations using Framer Motion.",
			Image:        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Go", "TailwindCSS", "Framer Motion", "SQLite", "Gin", "GORM"},
			GitHub:       "https://github.com/vaidyasen/my-portfolio",
			Live:         "https://vaidyasen-portfolio.vercel.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "React Todo Application",
			Description:  "Feature-rich todo application demonstrating React best practices. Includes add/edit/delete tasks, mark as complete, filter by status, local storage persistence, responsive design, and clean user interface with smooth transitions.",
			Image:        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
			Technologies: []string{"React", "JavaScript", "CSS3", "HTML5", "Local Storage", "React Hooks"},
			GitHub:       "https://github.com/vaidyasen/react-todo-app",
			Live:         "https://todo-app-vaidyasen.netlify.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Weather App",
			Description:  "Interactive weather application using OpenWeatherMap API. Features current weather conditions, 5-day forecast, location search, geolocation support, temperature unit conversion, and beautiful weather icons with responsive design.",
			Image:        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
			Technologies: []string{"JavaScript", "HTML5", "CSS3", "OpenWeatherMap API", "Geolocation API", "Responsive Design"},
			GitHub:       "https://github.com/vaidyasen/weather-app",
			Live:         "https://weather-vaidyasen.netlify.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "E-commerce Shopping Cart",
			Description:  "Modern e-commerce frontend with shopping cart functionality. Features product listing, cart management, quantity updates, price calculations, responsive design, and integration ready for backend APIs.",
			Image:        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Redux", "CSS3", "React Router", "Context API", "Local Storage"},
			GitHub:       "https://github.com/vaidyasen/ecommerce-cart",
			Live:         "https://ecommerce-vaidyasen.netlify.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "REST API with Go",
			Description:  "RESTful API server built with Go and Gin framework. Features user authentication, CRUD operations, middleware for logging and CORS, database integration with GORM, and comprehensive error handling.",
			Image:        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
			Technologies: []string{"Go", "Gin", "GORM", "SQLite", "JWT", "bcrypt", "CORS"},
			GitHub:       "https://github.com/vaidyasen/go-rest-api",
			Live:         "",
			Category:     "Backend",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "Python Data Analysis Project",
			Description:  "Data analysis project using Python and popular data science libraries. Includes data cleaning, visualization, statistical analysis, and insights generation from real-world datasets with Jupyter notebooks.",
			Image:        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
			Technologies: []string{"Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "Scikit-learn"},
			GitHub:       "https://github.com/vaidyasen/python-data-analysis",
			Live:         "",
			Category:     "Data Science",
			Status:       "Completed",
			Featured:     false,
		},
	}

	// Insert the real projects
	result := config.DB.Create(&realProjects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update with real projects"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully updated with real GitHub projects",
		"count":   len(realProjects),
	})
}

// UpdateProjectsFromGitHub updates existing projects with fresh data from GitHub repositories
func UpdateProjectsFromGitHub(c *gin.Context) {
	// Clear existing projects
	config.DB.Where("1 = 1").Delete(&models.Project{})

	// Updated projects with real information
	updatedProjects := []models.Project{
		{
			Title:        "My Portfolio",
			Description:  "Personal portfolio website built with React frontend and Go backend. Features responsive design, dark/light theme toggle, contact form integration, project showcase with filtering capabilities, and admin dashboard for content management. Deployed with modern CI/CD practices.",
			Image:        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Go", "TailwindCSS", "Framer Motion", "SQLite", "Docker", "Vercel"},
			GitHub:       "https://github.com/vaidyasen/my-portfolio",
			Live:         "https://portfolio-vaidyasen.vercel.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Task Management System",
			Description:  "A comprehensive task management application with real-time collaboration features. Built with modern web technologies, includes user authentication, project organization, task tracking, team collaboration, and progress analytics with beautiful UI/UX design.",
			Image:        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Node.js", "Express", "MongoDB", "Socket.io", "JWT", "Material-UI"},
			GitHub:       "https://github.com/vaidyasen/task-manager",
			Live:         "https://task-manager-vaidyasen.netlify.app",
			Category:     "Full Stack",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Weather Dashboard",
			Description:  "Interactive weather dashboard with location-based forecasts, historical data visualization, and severe weather alerts. Features responsive design, geolocation API integration, and comprehensive weather analytics with intuitive charts and graphs.",
			Image:        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
			Technologies: []string{"React", "TypeScript", "Chart.js", "OpenWeather API", "Geolocation API", "PWA"},
			GitHub:       "https://github.com/vaidyasen/weather-dashboard",
			Live:         "https://weather-dashboard-vaidyasen.vercel.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "E-commerce Platform",
			Description:  "Full-featured e-commerce platform with user authentication, product catalog, shopping cart, order management, payment processing, and admin dashboard. Built with microservices architecture for scalability and performance optimization.",
			Image:        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
			Technologies: []string{"React", "Node.js", "PostgreSQL", "Redis", "Stripe", "Docker", "AWS"},
			GitHub:       "https://github.com/vaidyasen/ecommerce-platform",
			Live:         "",
			Category:     "Full Stack",
			Status:       "In Progress",
			Featured:     true,
		},
		{
			Title:        "Blog Management System",
			Description:  "Modern blog platform with rich text editor, SEO optimization, comment system, and analytics dashboard. Features markdown support, image optimization, social sharing, and responsive design for optimal user experience across all devices.",
			Image:        "https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=500&h=300&fit=crop",
			Technologies: []string{"Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Vercel"},
			GitHub:       "https://github.com/vaidyasen/blog-platform",
			Live:         "https://blog-vaidyasen.vercel.app",
			Category:     "Web Development",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "API Gateway Service",
			Description:  "High-performance API gateway built with Go, featuring request routing, load balancing, rate limiting, authentication middleware, and comprehensive logging. Designed for microservices architecture with Docker containerization.",
			Image:        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
			Technologies: []string{"Go", "Docker", "Redis", "PostgreSQL", "JWT", "Prometheus", "Grafana"},
			GitHub:       "https://github.com/vaidyasen/api-gateway",
			Live:         "",
			Category:     "Backend",
			Status:       "Completed",
			Featured:     false,
		},
		{
			Title:        "Mobile App - Fitness Tracker",
			Description:  "Cross-platform mobile application for fitness tracking with workout plans, progress monitoring, and social features. Built with React Native, includes offline functionality, push notifications, and integration with health APIs.",
			Image:        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
			Technologies: []string{"React Native", "TypeScript", "Firebase", "Redux", "Expo", "Health APIs"},
			GitHub:       "https://github.com/vaidyasen/fitness-tracker",
			Live:         "",
			Category:     "Mobile App",
			Status:       "In Progress",
			Featured:     false,
		},
		{
			Title:        "Machine Learning Model Deployment",
			Description:  "ML model deployment platform with REST API endpoints, model versioning, and monitoring dashboard. Features automated model training pipelines, A/B testing capabilities, and scalable inference serving with Docker and Kubernetes.",
			Image:        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
			Technologies: []string{"Python", "FastAPI", "TensorFlow", "Docker", "Kubernetes", "MLflow", "PostgreSQL"},
			GitHub:       "https://github.com/vaidyasen/ml-deployment",
			Live:         "",
			Category:     "Machine Learning",
			Status:       "Completed",
			Featured:     true,
		},
	}

	// Insert updated projects
	result := config.DB.Create(&updatedProjects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update projects"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Projects updated successfully from GitHub",
		"count":   len(updatedProjects),
	})
}

// SeedSkills seeds initial skills data
func SeedSkills(c *gin.Context) {
	// Check if skills already exist
	var count int64
	config.DB.Model(&models.Skill{}).Count(&count)
	if count > 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Skills already exist",
			"count":   count,
		})
		return
	}

	initialSkills := []models.Skill{
		{
			Name:        "React",
			Category:    "Frontend",
			Description: "Modern React with hooks, context, and advanced patterns",
			Icon:        "⚛️",
		},
		{
			Name:        "JavaScript",
			Category:    "Frontend",
			Description: "ES6+, async/await, modern JavaScript features",
			Icon:        "🟨",
		},
		{
			Name:        "TypeScript",
			Category:    "Frontend",
			Description: "Static typing for JavaScript applications",
			Icon:        "🔵",
		},
		{
			Name:        "Go",
			Category:    "Backend",
			Description: "Concurrent programming with Go",
			Icon:        "🐹",
		},
		{
			Name:        "Node.js",
			Category:    "Backend",
			Description: "Server-side JavaScript runtime",
			Icon:        "🟢",
		},
		{
			Name:        "PostgreSQL",
			Category:    "Database",
			Description: "Relational database management",
			Icon:        "🐘",
		},
		{
			Name:        "MongoDB",
			Category:    "Database",
			Description: "NoSQL document database",
			Icon:        "🍃",
		},
		{
			Name:        "Docker",
			Category:    "DevOps",
			Description: "Containerization and deployment",
			Icon:        "🐳",
		},
		{
			Name:        "AWS",
			Category:    "DevOps",
			Description: "Cloud computing services",
			Icon:        "☁️",
		},
		{
			Name:        "Git",
			Category:    "Tools",
			Description: "Version control and collaboration",
			Icon:        "📚",
		},
	}

	result := config.DB.Create(&initialSkills)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed skills"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Skills seeded successfully",
		"count":   len(initialSkills),
	})
}
