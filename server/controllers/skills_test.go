package controllers

import (
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

func setupTestDBSkills() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.Skill{})
	return db
}

func TestGetSkills(t *testing.T) {
	gin.SetMode(gin.TestMode)
	
	// Setup test database
	testDB := setupTestDBSkills()
	originalDB := config.DB
	config.DB = testDB
	defer func() {
		config.DB = originalDB
	}()

	// Create test data
	skills := []models.Skill{
		{
			Name:        "JavaScript",
			Category:    "Frontend",
			Description: "Programming language for web development",
		},
		{
			Name:        "Go",
			Category:    "Backend", 
			Description: "Systems programming language",
		},
		{
			Name:        "React",
			Category:    "Frontend",
			Description: "JavaScript library for building UIs",
		},
	}

	for _, skill := range skills {
		testDB.Create(&skill)
	}

	t.Run("Get all skills", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/api/skills", nil)
		c.Request = req

		GetSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		assert.Equal(t, 3, len(skillsData))
		assert.Equal(t, float64(3), response["count"])
	})

	t.Run("Get skills by category", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/api/skills?category=Frontend", nil)
		c.Request = req

		GetSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		assert.Equal(t, 2, len(skillsData)) // JavaScript and React
		assert.Equal(t, float64(2), response["count"])
	})

	t.Run("Get skills with non-existent category", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/api/skills?category=NonExistent", nil)
		c.Request = req

		GetSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		assert.Equal(t, 0, len(skillsData))
		assert.Equal(t, float64(0), response["count"])
	})
}

func TestGetAdminSkills(t *testing.T) {
	gin.SetMode(gin.TestMode)
	
	// Setup test database
	testDB := setupTestDBSkills()
	originalDB := config.DB
	config.DB = testDB
	defer func() {
		config.DB = originalDB
	}()

	// Create test data
	skills := []models.Skill{
		{
			Name:        "JavaScript",
			Category:    "Frontend",
			Description: "Programming language for web development",
		},
		{
			Name:        "Go",
			Category:    "Backend",
			Description: "Systems programming language",
		},
		{
			Name:        "React",
			Category:    "Frontend",
			Description: "JavaScript library for building UIs",
		},
	}

	for _, skill := range skills {
		testDB.Create(&skill)
	}

	t.Run("Get admin skills with search", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/admin/skills?search=JavaScript", nil)
		c.Request = req

		GetAdminSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		// Should find both "JavaScript" skill and "React" (which has "JavaScript" in description)
		assert.GreaterOrEqual(t, len(skillsData), 1)
	})

	t.Run("Get admin skills with category filter", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/admin/skills?category=Backend", nil)
		c.Request = req

		GetAdminSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		assert.Equal(t, 1, len(skillsData)) // Only Go
	})

	t.Run("Get admin skills with both search and category", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		req, _ := http.NewRequest("GET", "/admin/skills?search=React&category=Frontend", nil)
		c.Request = req

		GetAdminSkills(c)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		
		skillsData := response["skills"].([]interface{})
		assert.Equal(t, 1, len(skillsData)) // Only React
	})
}