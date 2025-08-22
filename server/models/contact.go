package models

import (
	"gorm.io/gorm"
)

type Contact struct {
	gorm.Model
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}
