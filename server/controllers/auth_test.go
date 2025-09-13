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
	"golang.org/x/crypto/bcrypt"
)

func TestAdminLogin(t *testing.T) {
	// Setup
	setupTestDB()
	gin.SetMode(gin.TestMode)
	
	// Create test admin user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("testpass123"), bcrypt.DefaultCost)
	testAdmin := models.User{
		Username: "testadmin",
		Email:    "admin@test.com",
		Password: string(hashedPassword),
		Role:     "admin",
	}
	config.DB.Create(&testAdmin)
	
	router := gin.New()
	router.POST("/auth/login", AdminLogin)
	
	t.Run("Valid Login", func(t *testing.T) {
		loginData := LoginRequest{
			Username: "testadmin",
			Password: "testpass123",
		}
		
		jsonData, _ := json.Marshal(loginData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response LoginResponse
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.NotEmpty(t, response.Token)
		assert.Equal(t, "testadmin", response.User.Username)
		assert.Equal(t, "admin", response.User.Role)
	})
	
	t.Run("Invalid Password", func(t *testing.T) {
		loginData := LoginRequest{
			Username: "testadmin",
			Password: "wrongpassword",
		}
		
		jsonData, _ := json.Marshal(loginData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
	
	t.Run("Non-existent User", func(t *testing.T) {
		loginData := LoginRequest{
			Username: "nonexistent",
			Password: "testpass123",
		}
		
		jsonData, _ := json.Marshal(loginData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
	
	t.Run("Missing Credentials", func(t *testing.T) {
		loginData := LoginRequest{
			Username: "testadmin",
			// Missing password
		}
		
		jsonData, _ := json.Marshal(loginData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestCreateAdminUser(t *testing.T) {
	// Setup
	setupTestDB()
	gin.SetMode(gin.TestMode)
	
	router := gin.New()
	router.POST("/auth/setup", CreateAdminUser)
	
	t.Run("Create First Admin User", func(t *testing.T) {
		adminData := map[string]string{
			"username": "newadmin",
			"email":    "newadmin@test.com",
			"password": "newpass123",
		}
		
		jsonData, _ := json.Marshal(adminData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/setup", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Admin user created successfully", response["message"])
		assert.Equal(t, "newadmin", response["username"])
		
		// Verify user was created in database
		var user models.User
		config.DB.Where("username = ?", "newadmin").First(&user)
		assert.Equal(t, "newadmin", user.Username)
		assert.Equal(t, "admin", user.Role)
	})
	
	t.Run("Prevent Duplicate Admin Creation", func(t *testing.T) {
		// Create an admin user first
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("testpass"), bcrypt.DefaultCost)
		existingAdmin := models.User{
			Username: "existingadmin",
			Email:    "existing@test.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		config.DB.Create(&existingAdmin)
		
		// Try to create another admin
		adminData := map[string]string{
			"username": "anotheradmin",
			"email":    "another@test.com",
			"password": "anotherpass123",
		}
		
		jsonData, _ := json.Marshal(adminData)
		
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/auth/setup", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusConflict, w.Code)
		
		var response map[string]string
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Admin user already exists", response["error"])
	})
}
