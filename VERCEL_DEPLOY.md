# Quick Vercel Deployment Fix

## ✅ Files Ready
- ✓ index.html
- ✓ qr.jpeg  
- ✓ wantan.mp3 (4.4 MB - OK)
- ✓ All paths are relative (correct)

## 🚀 Deployment Steps

### 1. Make sure all files are in Git:
```bash
git add .
git commit -m "Deploy beach BBQ invitation"
git push
```

### 2. Deploy on Vercel:

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. **Important:** Leave all settings as default (auto-detected)
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. If you still get NOT_FOUND:

**Check these:**
1. ✅ All files committed to Git (check with `git status`)
2. ✅ No `.gitignore` excluding your files
3. ✅ Project root contains `index.html`
4. ✅ Deployment logs in Vercel dashboard for specific errors

### 4. Common Issues:

**Issue: "File not found"**
- Check Vercel deployment logs
- Verify file exists in repository
- Check file paths are relative (no `/` at start)

**Issue: "Build failed"**
- This is a static site, no build needed
- Make sure Framework Preset is set to "Other" or auto-detected

**Issue: "404 on page load"**
- Make sure `index.html` is in the root directory
- Check the deployment URL is correct

## 📁 Required File Structure:
```
beach/
├── index.html
├── qr.jpeg
└── wantan.mp3
```

## 🔍 Debug Steps:

1. **Check Vercel Logs:**
   - Go to your project → Deployments → Click on latest deployment
   - Check "Build Logs" and "Runtime Logs"

2. **Test Locally First:**
   - Open `index.html` in browser
   - Check browser console (F12) for errors
   - Verify all assets load

3. **Verify File Paths:**
   - All should be relative: `src="wantan.mp3"` ✓
   - NOT absolute: `src="/wantan.mp3"` ✗

## 💡 If Still Not Working:

Share the exact error message from:
- Vercel deployment logs
- Browser console (F12)
- Network tab showing which file returns 404

