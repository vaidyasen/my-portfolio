package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestModelsDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	
	// Auto-migrate test tables
	db.AutoMigrate(&User{}, &Project{}, &Skill{}, &BlogPost{}, &Contact{})
	
	return db
}

func TestUserModel(t *testing.T) {
	db := setupTestModelsDB()
	
	t.Run("Create User", func(t *testing.T) {
		user := User{
			Username: "testuser",
			Email:    "test@example.com",
			Password: "hashedpassword",
			Role:     "admin",
		}
		
		result := db.Create(&user)
		assert.NoError(t, result.Error)
		assert.NotZero(t, user.ID)
		assert.NotZero(t, user.CreatedAt)
		assert.NotZero(t, user.UpdatedAt)
	})
	
	t.Run("Unique Username Constraint", func(t *testing.T) {
		// Create first user
		user1 := User{
			Username: "uniqueuser",
			Email:    "user1@example.com",
			Password: "password1",
			Role:     "admin",
		}
		db.Create(&user1)
		
		// Try to create second user with same username
		user2 := User{
			Username: "uniqueuser", // Same username
			Email:    "user2@example.com",
			Password: "password2",
			Role:     "user",
		}
		
		result := db.Create(&user2)
		assert.Error(t, result.Error)
	})
}

func TestProjectModel(t *testing.T) {
	db := setupTestModelsDB()
	
	t.Run("Create Project with Technologies", func(t *testing.T) {
		project := Project{
			Title:        "Test Project",
			Description:  "A test project description",
			Technologies: []string{"Go", "React", "PostgreSQL"},
			GitHub:       "https://github.com/test/project",
			Live:         "https://testproject.com",
			Category:     "Web Application",
			Status:       "Completed",
			Featured:     true,
		}
		
		result := db.Create(&project)
		assert.NoError(t, result.Error)
		assert.NotZero(t, project.ID)
		assert.Equal(t, "Test Project", project.Title)
		assert.Equal(t, []string{"Go", "React", "PostgreSQL"}, project.Technologies)
		assert.True(t, project.Featured)
	})
	
	t.Run("Default Values", func(t *testing.T) {
		project := Project{
			Title:       "Minimal Project",
			Description: "Basic project",
		}
		
		result := db.Create(&project)
		assert.NoError(t, result.Error)
		assert.Equal(t, "In Progress", project.Status) // Default status
		assert.False(t, project.Featured)              // Default featured
	})
}

func TestSkillModel(t *testing.T) {
	db := setupTestModelsDB()
	
	t.Run("Create Skill", func(t *testing.T) {
		skill := Skill{
			Name:        "Go Programming",
			Category:    "Backend",
			Level:       85,
			Description: "Experienced in Go development",
			Icon:        "golang-icon",
		}
		
		result := db.Create(&skill)
		assert.NoError(t, result.Error)
		assert.NotZero(t, skill.ID)
		assert.Equal(t, "Go Programming", skill.Name)
		assert.Equal(t, 85, skill.Level)
	})
	
	t.Run("Unique Skill Name", func(t *testing.T) {
		// Create first skill
		skill1 := Skill{
			Name:     "JavaScript",
			Category: "Frontend",
			Level:    80,
		}
		db.Create(&skill1)
		
		// Try to create skill with same name
		skill2 := Skill{
			Name:     "JavaScript", // Same name
			Category: "Backend",
			Level:    70,
		}
		
		result := db.Create(&skill2)
		assert.Error(t, result.Error)
	})
}

func TestBlogPostModel(t *testing.T) {
	db := setupTestModelsDB()
	
	t.Run("Create Blog Post", func(t *testing.T) {
		blogPost := BlogPost{
			Title:     "Test Blog Post",
			Slug:      "test-blog-post",
			Content:   "This is a test blog post content",
			Excerpt:   "Test excerpt",
			Tags:      []string{"go", "testing", "programming"},
			Published: true,
		}
		
		result := db.Create(&blogPost)
		assert.NoError(t, result.Error)
		assert.NotZero(t, blogPost.ID)
		assert.Equal(t, "Test Blog Post", blogPost.Title)
		assert.Equal(t, []string{"go", "testing", "programming"}, blogPost.Tags)
		assert.True(t, blogPost.Published)
	})
	
	t.Run("Unique Slug Constraint", func(t *testing.T) {
		// Create first blog post
		post1 := BlogPost{
			Title:   "First Post",
			Slug:    "unique-slug",
			Content: "Content 1",
		}
		db.Create(&post1)
		
		// Try to create second post with same slug
		post2 := BlogPost{
			Title:   "Second Post",
			Slug:    "unique-slug", // Same slug
			Content: "Content 2",
		}
		
		result := db.Create(&post2)
		assert.Error(t, result.Error)
	})
}

func TestContactModel(t *testing.T) {
	db := setupTestModelsDB()
	
	t.Run("Create Contact", func(t *testing.T) {
		contact := Contact{
			Name:    "John Doe",
			Email:   "john@example.com",
			Message: "Hello, this is a test message",
		}
		
		result := db.Create(&contact)
		assert.NoError(t, result.Error)
		assert.NotZero(t, contact.ID)
		assert.Equal(t, "John Doe", contact.Name)
		assert.Equal(t, "john@example.com", contact.Email)
		assert.NotZero(t, contact.CreatedAt)
	})
	
	t.Run("Required Fields", func(t *testing.T) {
		contact := Contact{
			Name: "Jane Doe",
			// Missing email and message
		}
		
		result := db.Create(&contact)
		// Note: GORM doesn't enforce required fields by default
		// You might want to add validation in your application layer
		assert.NoError(t, result.Error)
	})
}
