package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() {
	// Use in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	
	config.DB = db
	
	// Auto-migrate test tables
	db.AutoMigrate(
		&models.Contact{},
		&models.User{},
		&models.Project{},
		&models.Skill{},
		&models.BlogPost{},
	)
}

func TestGetProjects(t *testing.T) {
	// Setup
	setupTestDB()
	gin.SetMode(gin.TestMode)
	
	// Create test projects
	testProjects := []models.Project{
		{
			Title:        "Test Project 1",
			Description:  "Test Description 1",
			Technologies: []string{"Go", "React"},
			GitHub:       "https://github.com/test/project1",
			Status:       "Completed",
			Featured:     true,
		},
		{
			Title:        "Test Project 2",
			Description:  "Test Description 2",
			Technologies: []string{"Node.js", "Vue"},
			GitHub:       "https://github.com/test/project2",
			Status:       "In Progress",
			Featured:     false,
		},
	}
	
	for _, project := range testProjects {
		config.DB.Create(&project)
	}
	
	// Create router and endpoint
	router := gin.New()
	router.GET("/api/projects", GetProjects)
	
	t.Run("Get All Projects", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/projects", nil)
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		projects := response["projects"].([]interface{})
		assert.Equal(t, 2, len(projects))
		assert.Equal(t, float64(2), response["count"])
	})
	
	t.Run("Get Featured Projects Only", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/projects?featured=true", nil)
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		projects := response["projects"].([]interface{})
		assert.Equal(t, 1, len(projects))
		assert.Equal(t, float64(1), response["count"])
	})
}

func TestSubmitContact(t *testing.T) {
	// Setup
	setupTestDB()
	gin.SetMode(gin.TestMode)
	
	router := gin.New()
	router.POST("/api/contact", SubmitContact)
	
	t.Run("Valid Contact Submission", func(t *testing.T) {
		contactData := map[string]string{
			"name":    "John Doe",
			"email":   "john@example.com",
			"message": "Hello, this is a test message",
		}
		
		jsonData, _ := json.Marshal(contactData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/contact", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]string
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Message received successfully", response["message"])
		
		// Verify contact was saved to database
		var contact models.Contact
		config.DB.First(&contact)
		assert.Equal(t, "John Doe", contact.Name)
		assert.Equal(t, "john@example.com", contact.Email)
	})
	
	t.Run("Invalid Contact Data", func(t *testing.T) {
		invalidData := map[string]string{
			"name": "John Doe",
			// Missing email and message
		}
		
		jsonData, _ := json.Marshal(invalidData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/contact", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
