# Vercel Deployment Guide

## Common Issues and Solutions

### 1. NOT_FOUND Error

**Possible Causes:**
- Files not committed to Git
- Large audio file not uploaded
- Incorrect file paths

**Solutions:**

#### Check File Sizes
- Vercel Hobby plan has a **100MB limit per file**
- If `wantan.mp3` is larger than 100MB, you need to:
  - Compress the audio file, OR
  - Use Vercel Pro plan, OR
  - Host the audio file elsewhere (e.g., Cloudinary, AWS S3)

#### Ensure All Files Are Committed
Make sure these files are in your Git repository:
```
✓ index.html
✓ qr.jpeg
✓ wantan.mp3
✓ vercel.json
```

#### Verify File Paths
All paths in `index.html` should be relative:
- `src="wantan.mp3"` ✓
- `src="qr.jpeg"` ✓

### 2. Deployment Steps

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect the settings

3. **Check Build Settings:**
   - Framework Preset: **Other**
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty (root)

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### 3. If Audio File is Too Large

**Option A: Compress the Audio**
- Use online tools like [CloudConvert](https://cloudconvert.com) or [Audacity](https://www.audacityteam.org/)
- Reduce bitrate to 128kbps or lower
- Convert to a smaller format

**Option B: Host Audio Elsewhere**
1. Upload `wantan.mp3` to a CDN (Cloudinary, AWS S3, etc.)
2. Update the audio source in `index.html`:
   ```html
   <source src="https://your-cdn-url.com/wantan.mp3" type="audio/mpeg">
   ```

### 4. Verify Deployment

After deployment:
1. Check the deployment URL
2. Open browser console (F12) to check for errors
3. Test the music player button
4. Verify QR code image loads

### 5. Troubleshooting

**If files are missing:**
- Check Vercel deployment logs
- Verify all files are in the repository root
- Check `.gitignore` doesn't exclude your files

**If paths are wrong:**
- All paths should be relative (no leading `/`)
- Example: `src="wantan.mp3"` not `src="/wantan.mp3"`

## File Structure

```
beach/
├── index.html      (main file)
├── qr.jpeg         (QR code image)
├── wantan.mp3      (background music)
├── vercel.json     (Vercel config)
└── DEPLOYMENT.md   (this file)
```

## Need Help?

- Check Vercel deployment logs in the dashboard
- Open browser console to see JavaScript errors
- Verify all file sizes are under limits

