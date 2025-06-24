package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ritikvaidyasen/portfolio-server/config"
	"github.com/ritikvaidyasen/portfolio-server/routes"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	config.InitDB()
	routes.RegisterRoutes(r)

	r.Run(":8080") // localhost:8080
}


