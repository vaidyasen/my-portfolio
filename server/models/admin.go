package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"` // Hidden from JSON
	Role      string    `json:"role" gorm:"default:'user'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Project struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Title        string    `json:"title" gorm:"not null"`
	Description  string    `json:"description" gorm:"type:text"`
	Image        string    `json:"image"`
	Technologies []string  `json:"technologies" gorm:"serializer:json"`
	GitHub       string    `json:"github"`
	Live         string    `json:"live"`
	Category     string    `json:"category"`
	Status       string    `json:"status" gorm:"default:'In Progress'"`
	Featured     bool      `json:"featured" gorm:"default:false"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Skill struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Category    string    `json:"category"`
	Level       int       `json:"level" gorm:"default:1"` // 1-100
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type BlogPost struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Title        string    `json:"title" gorm:"not null"`
	Slug         string    `json:"slug" gorm:"unique;not null"`
	Content      string    `json:"content" gorm:"type:longtext"`
	Excerpt      string    `json:"excerpt"`
	Image        string    `json:"image"`
	Tags         []string  `json:"tags" gorm:"serializer:json"`
	Published    bool      `json:"published" gorm:"default:false"`
	ViewCount    int       `json:"view_count" gorm:"default:0"`
	PublishedAt  *time.Time `json:"published_at"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
