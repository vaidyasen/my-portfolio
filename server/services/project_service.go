// Package services provides business logic layer following SOLID principles
package services

import (
	"errors"

	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/models"
	"gorm.io/gorm"
)

// ProjectService handles project-related business logic
type ProjectService struct {
	db *gorm.DB
}

// NewProjectService creates a new project service
func NewProjectService() *ProjectService {
	return &ProjectService{
		db: config.DB,
	}
}

// ProjectRepository interface for data access (Dependency Inversion)
type ProjectRepository interface {
	GetAll(featured bool) ([]models.Project, error)
	GetByID(id uint) (*models.Project, error)
	Create(project *models.Project) error
	Update(project *models.Project) error
	Delete(id uint) error
}

// GetProjects retrieves projects with optional filtering
func (s *ProjectService) GetProjects(featured bool) ([]models.Project, error) {
	var projects []models.Project
	query := s.db

	if featured {
		query = query.Where("featured = ?", true)
	}

	if err := query.Find(&projects).Error; err != nil {
		return nil, errors.New("failed to fetch projects")
	}

	return projects, nil
}

// GetProjectByID retrieves a project by ID
func (s *ProjectService) GetProjectByID(id uint) (*models.Project, error) {
	var project models.Project
	
	if err := s.db.First(&project, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("project not found")
		}
		return nil, errors.New("failed to fetch project")
	}

	return &project, nil
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(project *models.Project) error {
	if err := s.validateProject(project); err != nil {
		return err
	}

	if err := s.db.Create(project).Error; err != nil {
		return errors.New("failed to create project")
	}

	return nil
}

// UpdateProject updates an existing project
func (s *ProjectService) UpdateProject(project *models.Project) error {
	if err := s.validateProject(project); err != nil {
		return err
	}

	if err := s.db.Save(project).Error; err != nil {
		return errors.New("failed to update project")
	}

	return nil
}

// DeleteProject deletes a project by ID
func (s *ProjectService) DeleteProject(id uint) error {
	result := s.db.Delete(&models.Project{}, id)
	
	if result.Error != nil {
		return errors.New("failed to delete project")
	}

	if result.RowsAffected == 0 {
		return errors.New("project not found")
	}

	return nil
}

// validateProject validates project data
func (s *ProjectService) validateProject(project *models.Project) error {
	if project.Title == "" {
		return errors.New("project title is required")
	}
	
	if project.Description == "" {
		return errors.New("project description is required")
	}

	if len(project.Technologies) == 0 {
		return errors.New("at least one technology is required")
	}

	return nil
}