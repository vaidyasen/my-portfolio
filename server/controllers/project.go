package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Project struct {
	Title       string `json:"Title"`
	Description string `json:"Description"`
}

func GetProjects(c *gin.Context) {
	projects := []Project{
		{Title: "GamerIT", Description: "MERN app for gamer community & matchmaking"},
		{Title: "Complaint Box", Description: "Full stack complaint resolution platform"},
	}
	c.JSON(http.StatusOK, projects)
}
