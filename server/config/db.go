package config

import (
	"log"

	"github.com/ritikvaidyasen/portfolio-server/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("portfolio.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}
	
	// Auto-migrate all models
	DB.AutoMigrate(
		&models.Contact{},
		&models.User{},
		&models.Project{},
		&models.Skill{},
		&models.BlogPost{},
	)
}
