# Deployment Guide

This guide covers deploying Therapick to various platforms.

## 📦 Build for Production

```bash
npm run build
```

Production files will be in the `dist/` folder.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Via CLI:**
```bash
npm install -g vercel
vercel
```

**Via Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically

### Option 2: Netlify

**Via CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

**Via Dashboard:**
1. Drag `dist` folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repo

### Option 3: GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/therapick-app/',
  // ...
})
```

2. Add deploy script to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Install and deploy:
```bash
npm install -D gh-pages
npm run deploy
```

## 🌍 Custom Domain

Configure in your platform's dashboard under domain settings.

## ✅ Pre-Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] All features tested
- [ ] Mobile responsive
- [ ] No console errors

---

For detailed instructions, see platform documentation.
