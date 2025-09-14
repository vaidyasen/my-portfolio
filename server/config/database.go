// Package config provides database configuration and connection management
// Follows Single Responsibility Principle
package config

import (
	"log"
	"os"

	"github.com/ritikvaidyasen/portfolio-server/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	DatabaseURL string
	LogLevel    logger.LogLevel
}

// NewDatabaseConfig creates a new database configuration
func NewDatabaseConfig() *DatabaseConfig {
	logLevel := logger.Silent
	if os.Getenv("DB_DEBUG") == "true" {
		logLevel = logger.Info
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "portfolio.db"
	}

	return &DatabaseConfig{
		DatabaseURL: dbURL,
		LogLevel:    logLevel,
	}
}

// InitDB initializes the database connection
func InitDB() {
	config := NewDatabaseConfig()
	
	db, err := gorm.Open(sqlite.Open(config.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(config.LogLevel),
	})
	
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB = db
	log.Println("Database connected successfully")
	
	// Auto-migrate all models
	err = DB.AutoMigrate(
		&models.Contact{},
		&models.User{},
		&models.Project{},
		&models.Skill{},
		&models.BlogPost{},
	)
	
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	
	log.Println("Database migration completed successfully")
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}

// CloseDB closes the database connection
func CloseDB() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}