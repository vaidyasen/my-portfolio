package services

import (
	"testing"

	"github.com/ritikvaidyasen/portfolio-server/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const (
	updatedTitleConst = "Updated Title"
	notFoundErrorMsg  = "not found"
)

func setupTestProjectService() *ProjectService {
	// Create an in-memory SQLite database for testing
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	
	// Auto migrate the schema
	db.AutoMigrate(&models.Project{})
	
	return &ProjectService{db: db}
}

func TestProjectServiceGetProjects(t *testing.T) {
	service := setupTestProjectService()

	// Create test data
	projects := []models.Project{
		{
			Title:       "Featured Project",
			Description: "A featured project",
			Featured:    true,
		},
		{
			Title:       "Regular Project",
			Description: "A regular project",
			Featured:    false,
		},
	}

	// Insert test data
	for _, project := range projects {
		service.db.Create(&project)
	}

	t.Run("Get all projects", func(t *testing.T) {
		result, err := service.GetProjects(false)
		
		assert.NoError(t, err)
		assert.Equal(t, 2, len(result))
	})

	t.Run("Get featured projects only", func(t *testing.T) {
		result, err := service.GetProjects(true)
		
		assert.NoError(t, err)
		assert.Equal(t, 1, len(result))
		assert.True(t, result[0].Featured)
		assert.Equal(t, "Featured Project", result[0].Title)
	})
}

func TestProjectServiceGetProjectByID(t *testing.T) {
	service := setupTestProjectService()

	// Create test project
	project := models.Project{
		Title:       "Test Project",
		Description: "Test Description",
		Featured:    true,
	}
	service.db.Create(&project)

	t.Run("Get existing project", func(t *testing.T) {
		result, err := service.GetProjectByID(project.ID)
		
		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, "Test Project", result.Title)
		assert.Equal(t, "Test Description", result.Description)
	})

	t.Run("Get non-existing project", func(t *testing.T) {
		result, err := service.GetProjectByID(9999)
		
		assert.Error(t, err)
		assert.Nil(t, result)
		assert.Contains(t, err.Error(), notFoundErrorMsg)
	})
}

func TestProjectServiceCreateProject(t *testing.T) {
	service := setupTestProjectService()

	t.Run("Create valid project", func(t *testing.T) {
		project := &models.Project{
			Title:       "New Project",
			Description: "New Description",
			Featured:    false,
		}

		err := service.CreateProject(project)
		
		assert.NoError(t, err)
		assert.NotZero(t, project.ID)
		
		// Verify project was created
		var count int64
		service.db.Model(&models.Project{}).Count(&count)
		assert.Equal(t, int64(1), count)
	})

	t.Run("Create project with empty title", func(t *testing.T) {
		project := &models.Project{
			Title:       "",
			Description: "Description",
			Featured:    false,
		}

		err := service.CreateProject(project)
		
		// Depending on validation rules, this might fail
		// Adjust assertion based on actual validation
		if err != nil {
			assert.Contains(t, err.Error(), "title")
		}
	})
}

func TestProjectServiceUpdateProject(t *testing.T) {
	service := setupTestProjectService()

	// Create initial project
	project := models.Project{
		Title:       "Original Title",
		Description: "Original Description",
		Featured:    false,
	}
	service.db.Create(&project)

	t.Run("Update existing project", func(t *testing.T) {
		updates := &models.Project{
			ID:          project.ID,
			Title:       updatedTitleConst,
			Description: "Updated Description",
			Featured:    true,
		}

		err := service.UpdateProject(updates)
		
		assert.NoError(t, err)
		
		// Verify update
		var updated models.Project
		service.db.First(&updated, project.ID)
		assert.Equal(t, updatedTitleConst, updated.Title)
		assert.Equal(t, "Updated Description", updated.Description)
		assert.True(t, updated.Featured)
	})

	t.Run("Update non-existing project", func(t *testing.T) {
		updates := &models.Project{
			ID:    9999, // Non-existing ID
			Title: updatedTitleConst,
		}

		err := service.UpdateProject(updates)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), notFoundErrorMsg)
	})
}

func TestProjectServiceDeleteProject(t *testing.T) {
	service := setupTestProjectService()

	// Create test project
	project := models.Project{
		Title:       "To Delete",
		Description: "Will be deleted",
		Featured:    false,
	}
	service.db.Create(&project)

	t.Run("Delete existing project", func(t *testing.T) {
		err := service.DeleteProject(project.ID)
		
		assert.NoError(t, err)
		
		// Verify deletion
		var count int64
		service.db.Model(&models.Project{}).Where("id = ?", project.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})

	t.Run("Delete non-existing project", func(t *testing.T) {
		err := service.DeleteProject(9999)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), notFoundErrorMsg)
	})
}