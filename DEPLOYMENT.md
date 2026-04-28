# 🚀 GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### 1. Create GitHub Repository

```bash
# Initialize git
git init
cd stick-viltrumite-arena

# Add all files
git add .

# First commit
git commit -m "Initial commit: Stick Viltrumite Arena 3D"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/stick-viltrumite-arena.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to repository settings: `https://github.com/YOUR_USERNAME/stick-viltrumite-arena/settings`
2. Click "Pages" on the left sidebar
3. Under "Source", select `main` branch
4. Select root folder `/`
5. Click "Save"

### 3. Wait for Deployment

GitHub will automatically build and deploy. You'll see a green checkmark when ready (usually 1-2 minutes).

**Your game is now live at:**
```
https://YOUR_USERNAME.github.io/stick-viltrumite-arena
```

---

## File Structure for GitHub Pages

```
your-repository/
├── index.html                 # Main game file ✅
├── config.js                  # Configuration
├── physics-body.js            # Physics system
├── stick-figure.js            # Character class
├── particle-system.js         # Effects
├── abilities.js               # Ability system
├── game-engine.js             # Main engine
├── README-3D.md               # Game documentation
├── .github/
│   └── workflows/
│       └── deploy.yml         # Auto-deploy config
└── LICENSE                    # (optional) MIT license
```

**Important**: Make sure `index.html` is in the root directory!

---

## Common Issues & Fixes

### Issue: "404 - Not Found"
- ✅ **Solution**: Ensure `index.html` is in root, not in a subfolder
- Check that branch is set to `main` in Settings → Pages

### Issue: "Failed to load resources (CDN)"
- ✅ **Solution**: Ensure you have internet connection
- CDNs used: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`
- Game works offline AFTER first load (cached)

### Issue: "Game won't start"
- ✅ **Solution**: Open browser console (F12) and check for errors
- Ensure all JS files (config.js, physics-body.js, etc.) are in root directory
- Check that Three.js, Cannon.js, and Tween.js loaded successfully

### Issue: "Slow performance"
- ✅ **Solution**: Use Chrome/Edge (better WebGL)
- Reduce particle count in particle-system.js if needed
- Mobile users: Consider using 2D version instead

---

## Update & Redeploy

After making changes:

```bash
# Stage changes
git add .

# Commit
git commit -m "Update: [describe changes]"

# Push to GitHub
git push origin main
```

Your site updates automatically within 1-2 minutes!

---

## Optional: Custom Domain

To use your own domain (e.g., `stickfight.com`):

1. In repository Settings → Pages
2. Enter your domain in "Custom domain"
3. Update your domain's DNS settings with GitHub's IP addresses
4. See [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details

---

## Performance Tips

- **First Load**: ~5-10 seconds (CDNs load)
- **Cached Load**: <1 second
- **Offline Play**: Works after first load (all CDN resources cached)
- **Mobile**: 30-60 FPS on mid-range devices

---

## Troubleshooting Checklist

- [ ] Repository created and public
- [ ] All files in root directory (or subfolders properly referenced)
- [ ] `index.html` exists in root
- [ ] GitHub Pages enabled in Settings
- [ ] Branch set to `main`
- [ ] Wait 2+ minutes after pushing
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check console for errors (F12)

---

## Need Help?

1. **GitHub Pages Issues**: https://docs.github.com/en/pages
2. **Three.js Docs**: https://threejs.org/docs
3. **Cannon.js Docs**: https://www.cannonjs.org
4. **Check Repository**: https://github.com/YOUR_USERNAME/stick-viltrumite-arena

---

**Your game is now deployed! 🎮**

Share your repo link on socials:
```
Check out my 3D stick fighting game!
🎮 https://[username].github.io/stick-viltrumite-arena
👊 Physics-based ragdoll combat
⚔️ Defeat Thragg and unlock endless mode
```
