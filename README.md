# Sachin Patel — Portfolio Website v2

A fully self-contained personal portfolio with:
- 🌙 Dark / Light mode toggle (remembers your preference)
- 📸 Profile photo support (or auto-initials avatar)
- 📄 Resume download button (nav + hero)
- ✏️  Live in-browser editor — edit all content without touching code
- 📋 Config export — copy updated config.js to make changes permanent

## File Structure

```
sachin-patel-portfolio/
├── index.html      ← Page structure (rarely needs editing)
├── style.css       ← All styles + dark/light themes
├── main.js         ← Renders content + runs the editor
├── config.js       ← ★ YOUR DATA — edit this file to update the site
├── resume.pdf      ← Place your resume PDF here (any filename, update config)
├── photo.jpg       ← Place your photo here (optional)
└── README.md
```

## How to update your content

### Option A — Live editor (easiest)
1. Open `index.html` in your browser
2. Click the **Edit** button (gold, top-right nav)
3. Edit anything in the side panel — changes appear instantly
4. Go to the **Export** tab → click **Copy config.js**
5. Paste into your `config.js` file and save

### Option B — Edit config.js directly
Open `config.js` in any text editor and update the values.
All sections pull data from there automatically.

## Adding your photo
1. Place your photo file (e.g. `photo.jpg`) in the same folder as `index.html`
2. In `config.js`, set: `photoUrl: "photo.jpg"`
3. Or use the **Edit** panel → **Info** tab → Profile Photo URL

## Adding your resume
1. Place your PDF (e.g. `Sachin_Patel_Resume.pdf`) in the same folder
2. In `config.js`, set: `resumeFile: "Sachin_Patel_Resume.pdf"`
3. The Download Resume button will appear in the nav and hero automatically

## Changing the accent colour
- Open the **Edit** panel → **Hero** tab → **Accent Color**
- Pick any hex colour to replace the default teal everywhere

## Hosting for free (recommended)
1. Create a free account at https://pages.github.com
2. Create a new repository named `yourusername.github.io`
3. Upload all files in this folder
4. Your site will be live at `https://yourusername.github.io`

Other free options: Netlify (drag & drop the folder), Vercel, Cloudflare Pages.
