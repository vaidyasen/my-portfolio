# Ritik Vaidyasen — Portfolio

A focused, single-page software engineering portfolio built with React and deployed on GitHub Pages.

## What is included

- Short professional introduction
- Four selected projects with concise descriptions
- Current role, education, and core technical skills
- Direct links to GitHub, LinkedIn, LeetCode, and email
- Responsive layout with accessible reduced-motion support

## Local development

```bash
cd client
npm install
npm start
```

Create a production build with:

```bash
cd client
npm run build
```

## Deployment

The workflow at `.github/workflows/deploy-pages.yml` builds the React app and deploys it to GitHub Pages whenever a change reaches `main`.

In the repository settings, choose **GitHub Actions** as the Pages source. The site will then be available at:

`https://vaidyasen.github.io/my-portfolio/`

## Project structure

The public portfolio lives in `client/`. The older Go API remains in `server/` for history, but the deployed portfolio does not depend on it.
