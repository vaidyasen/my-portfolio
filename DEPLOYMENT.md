# Free Deployment Guide for Your Portfolio

## 🚀 Deploy Backend on Render.com (FREE)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: `vaidyasen/my-portfolio`
3. Configure the service:
   - **Name**: `ritik-portfolio-backend`
   - **Root Directory**: `server`
   - **Environment**: `Go`
   - **Build Command**: `go mod download && go build -o portfolio-server main.go`
   - **Start Command**: `./portfolio-server`
   - **Instance Type**: `Free`

### Step 3: Environment Variables (in Render dashboard)
```
GIN_MODE=release
PORT=10000
```

### Step 4: Get Your Backend URL
After deployment, you'll get a URL like: `https://ritik-portfolio-backend.onrender.com`

---

## 🌐 Deploy Frontend on Vercel (FREE)

### Step 1: Install Vercel CLI (Already Done)
```bash
npm install -g vercel
```

### Step 2: Deploy Frontend
```bash
cd client
vercel --prod
```

### Step 3: Set Environment Variables in Vercel
In your Vercel dashboard:
```
REACT_APP_API_URL=https://ritik-portfolio-backend.onrender.com
GENERATE_SOURCEMAP=false
```

---

## 🔧 Alternative: Deploy Both on Fly.io (FREE)

### Option 1: Use Fly.io for both frontend and backend
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly auth signup`
3. Deploy backend: `fly launch` (from server directory)
4. Deploy frontend: `fly launch` (from client directory)

---

## 📱 Quick Deploy Commands

### Backend (Render)
1. Push to GitHub (already done)
2. Go to render.com and connect your repo
3. Use the settings above

### Frontend (Vercel)
```bash
cd /Users/rvaidyas/Desktop/Code/projects/my-portfolio/my-portfolio/client
vercel login
vercel --prod
```

## 🎯 Expected Results

- **Backend URL**: `https://ritik-portfolio-backend.onrender.com`
- **Frontend URL**: `https://ritik-portfolio.vercel.app`
- **Admin Panel**: `https://ritik-portfolio.vercel.app/admin`

## 💡 Tips for Free Deployment

1. **Render Free Tier**: Sleeps after 15 mins of inactivity
2. **Vercel Free Tier**: Unlimited static deployments
3. **Database**: SQLite file will persist on Render
4. **CORS**: Already configured for your Vercel domain

## 🚨 Important Notes

- Free services have limitations (sleep, bandwidth)
- Always test your deployed app
- Check logs if something doesn't work
- Your database will reset if the Render service restarts (consider upgrading for persistence)

## 🛠️ Troubleshooting

If your app doesn't work:
1. Check Render logs for backend errors
2. Check Vercel function logs
3. Verify environment variables are set
4. Test API endpoints directly

Ready to deploy? Let me know if you need help with any step!
