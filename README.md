# 🚀 Ritik's Portfolio Website

A modern, full-stack personal portfolio website built with React (frontend) and Go (backend). Features a responsive design, dark/light theme toggle, contact form, and project showcase.

## ✨ Features

### Frontend (React)

- 🎨 Modern, responsive design with TailwindCSS
- 🌙 Dark/Light theme toggle with persistence
- ⚡ Smooth animations with Framer Motion
- 📱 Mobile-first responsive design
- 🧭 React Router for seamless navigation
- 📄 SEO optimized with React Helmet
- 🎯 Interactive project filtering
- 📬 Contact form with real-time validation

### Backend (Go)

- 🔧 RESTful API built with Gin framework
- 📊 SQLite database with GORM
- 🌐 CORS enabled for cross-origin requests
- 📝 Comprehensive logging middleware
- 🔒 Input validation and error handling
- 🏥 Health check endpoints
- 📧 Contact form submission handling
- 🐳 Docker support for containerization

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend

- **Go 1.23** - Modern Go with latest features
- **Gin** - High-performance HTTP web framework
- **GORM** - Go ORM with SQLite
- **CORS** - Cross-Origin Resource Sharing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for production

## 📁 Project Structure

```
my-portfolio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ThemeToggle.js
│   │   │   └── ProjectCard.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Projects.js
│   │   │   └── Contact.js
│   │   ├── index.css       # Global styles
│   │   └── index.js        # App entry point
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx configuration
│   └── package.json
├── server/                 # Go backend
│   ├── config/
│   │   └── db.go          # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── contact.go
│   │   ├── project.go
│   │   └── resume.go
│   ├── models/            # Data models
│   │   └── contact.go
│   ├── routes/            # Route definitions
│   │   └── routes.go
│   ├── Dockerfile         # Backend container
│   ├── go.mod
│   └── main.go           # Server entry point
├── docker-compose.yml     # Development orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Go 1.23+
- Docker and Docker Compose (optional)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ritikvaidyasen/my-portfolio.git
   cd my-portfolio
   ```

2. **Start the backend server**

   ```bash
   cd server
   go mod download
   go run main.go
   ```

   Server will start on `http://localhost:8080`

3. **Start the frontend development server**
   ```bash
   cd client
   npm install
   npm start
   ```
   Frontend will start on `http://localhost:3000`

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🔧 Environment Variables

### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SITE_URL=http://localhost:3000
```

### Backend

```env
GIN_MODE=release  # or debug for development
PORT=8080
```

## 📚 API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects?featured=true` - Get featured projects only

### Contact

- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  }
  ```

### Utility

- `GET /health` - Health check endpoint
- `GET /api/resume` - Get resume information

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in your hosting platform

### Backend (Render/Heroku)

1. Use the provided Dockerfile
2. Set the PORT environment variable
3. Ensure database persistence with volumes

### Docker Production

```bash
# Build images
docker-compose -f docker-compose.yml build

# Deploy to production
docker-compose -f docker-compose.yml up -d
```

## 🎨 Customization

### Adding New Projects

Edit `server/controllers/project.go` and add your projects to the projects array:

```go
projects := []Project{
    {
        ID:          5,
        Title:       "Your New Project",
        Description: "Brief description",
        // ... other fields
    },
}
```

### Styling

- Modify `client/src/index.css` for global styles
- Use TailwindCSS classes for component styling
- Customize the theme in `client/src/tailwind.config.js`

### Adding New Pages

1. Create a new component in `client/src/pages/`
2. Add the route in `client/src/index.js`
3. Update the navbar in `client/src/components/Navbar.js`

## 📊 Performance Optimizations

- ⚡ Code splitting with React.lazy
- 🗜️ Gzip compression
- 📦 Asset caching with Nginx
- 🖼️ Image optimization
- 📱 Mobile-first responsive design

## 🔒 Security Features

- 🛡️ CORS protection
- 🔐 Input validation
- 🚫 XSS protection headers
- 🏠 Content Security Policy
- 📝 Sanitized database queries

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ritik Vaidyasen**

- Website: [ritikvaidyasen.dev](https://ritikvaidyasen.dev)
- GitHub: [@ritikvaidyasen](https://github.com/ritikvaidyasen)
- LinkedIn: [ritikvaidyasen](https://linkedin.com/in/ritikvaidyasen)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Go](https://golang.org/) - Backend language
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Gin](https://gin-gonic.com/) - Go web framework

---

⭐ If you found this project helpful, please give it a star!
