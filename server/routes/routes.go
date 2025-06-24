package routes

import (
	"github.com/ritikvaidyasen/portfolio-server/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/projects", controllers.GetProjects)
	r.POST("/contact", controllers.SubmitContact)
	r.GET("/resume", controllers.GetResume)
}
