# AI Insights

A responsive web app that chronicles discovery and documentation of new AI technology.

## About

This blog explores emerging AI technologies, development tools, pricing models, and practical implementation strategies.

## Deployment

This site is automatically deployed to both GitHub Pages and Vercel on every push to the main branch.

### GitHub Pages
- URL: `https://[username].github.io/ai-insights`
- Deployment: Automatic via GitHub Actions

### Vercel
- URL: Custom domain (configure in Vercel dashboard)
- Deployment: Automatic via Vercel GitHub integration

## Local Development

### Setup
```bash
git clone https://github.com/[username]/ai-insights.git
cd ai-insights
```

### Viewing Locally
Simply open `index.html` in your browser. This is a static site with no build process required.

## File Structure

- `index.html` - Homepage
- `about.html` - About page
- `post*.html` - Individual blog posts
- `style.css` - Styling
- `app.js` - JavaScript functionality
- `.github/workflows/deploy.yml` - GitHub Actions deployment pipeline
- `vercel.json` - Vercel deployment configuration
