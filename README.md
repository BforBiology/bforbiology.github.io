# B for Biology — free website and creator dashboard

This website is designed for **zero-cost public hosting on GitHub Pages**. It includes responsive design, dark mode, Class 11 / Class 12 browsing, instant search, category filters, article and PDF support, image galleries, embedded YouTube videos, MCQ quizzes with scoring, sharing, browser-local bookmarks, and a Creator Studio with GitHub publishing.

## A. Publish your website free (about 8 steps)

1. Unzip `B-for-Biology-Free-Website.zip` on your Windows computer.
2. Make a free GitHub account at https://github.com/ .
3. Select **+ → New repository**. Name it `bforbiology` (or another name). Set **Public** and create it.
4. Open your new repository. Choose **Add file → Upload files**, drag **the files AND folders inside** `bforbiology-site` into the upload area. Confirm that `index.html`, `admin.html`, `assets/` and `data/` are in the repository root. Commit changes. (If browser folder upload is awkward, use GitHub Desktop to push the extracted folder.)
5. In the repository open **Settings → Pages**. Select **Deploy from a branch**, choose `main` and `/(root)`, and click **Save**.
6. GitHub will display the free address: `https://YOUR-USERNAME.github.io/bforbiology/` (the repository name appears in the URL). It can take several minutes to appear.
7. Visit that address to see your public website. Visitors do not need GitHub accounts.
8. The creator dashboard is at `https://YOUR-USERNAME.github.io/bforbiology/admin.html`.

No domain or paid hosting is required. The repository is **public**: do not upload private files, students' personal information, or copyrighted materials without permission.

Official setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## B. Connect Creator Studio to publish changes

The public website reads its content from `data/content.json`. The Creator Studio lets you edit that file through GitHub's API.

1. In GitHub open **Settings (your profile) → Developer settings → Personal access tokens → Fine-grained tokens**. Select **Generate new token**.
2. Set a description such as `B for Biology creator studio`, choose a short expiration date, select your GitHub account as resource owner, and limit repository access to **Only select repositories → bforbiology**.
3. Under Repository permissions set **Contents: Read and write**. Do not grant unrelated permissions.
4. Create the token and copy it once. Keep it secret. Never share it in chat, posts, screenshots or website files.
5. On your public site visit `admin.html`. Enter your GitHub username, repository name (`bforbiology`), branch (`main`), and the token. Click **Load from GitHub**.
6. Fill the Creator Studio form, click **Save resource locally**, then **Publish all to GitHub**. A commit updates `data/content.json`; GitHub Pages redeploys automatically.
7. When finished, click **Forget connection** and close the tab. Recreate a token if it expires.

The token is kept **only in the open browser tab's JavaScript memory**. It is **not** saved in the content file, browser localStorage, or HTML. Browser localStorage holds draft content only. Anyone can *see* `admin.html` but without repository authorization they cannot publish. If you prefer, delete `admin.html` and `assets/admin.js` from your published repository and use a local copy of Creator Studio over a local web server.

## C. Add notes or PDF lessons

- In Creator Studio, choose **Note / Article / PDF**, select Class 11 or 12, type title, chapter, summary, tags, and lesson text.
- For a PDF file, choose it in **Upload files**, and click **Upload file to GitHub** (requires connection). Copy the returned relative path such as `assets/uploads/1762500000-chapter1.pdf` into **PDF file URL**.
- Save locally, then Publish all to GitHub. Users will see an **Open / download notes PDF** button.
- For longer notes write directly in the **Lesson explanation / notes** field. Blank lines create paragraphs. HTML is deliberately not executed.

## D. Add videos

- Upload your original video to YouTube (public or unlisted if you only want people with a link to access it).
- In Creator Studio select **Video lesson**, paste the YouTube video URL in **YouTube link**, add title, description, class and chapter, save and publish.
- YouTube handles large video files and playback. This is more efficient than uploading videos directly to GitHub. Do not use copyrighted videos without permission.

## E. Add images and diagrams

- Create your own image or use content you have rights to publish.
- Upload JPG/PNG/WEBP/SVG via Creator Studio, copy the returned path to **Image URL** (and optionally **Cover image URL**), save and publish.
- You can also provide an external `https://` image URL if usage rights permit.

## F. Create interactive quizzes

Choose **Quiz** and paste an array into **Quiz questions**, for example:

```json
[
  {
    "question": "Which organelle produces most ATP during aerobic respiration?",
    "options": ["Golgi apparatus", "Mitochondrion", "Ribosome", "Nucleolus"],
    "answer": 1
  },
  {
    "question": "Which pigment is the primary reaction-centre pigment?",
    "options": ["Chlorophyll a", "Xanthophyll", "Carotene"],
    "answer": 0
  }
]
```

`answer` uses index 0 for the first option, 1 for the second, etc. The quiz displays immediate total score on submission.

## G. Edit existing content and backups

- In **Manage and publish**, choose **Edit** or **Delete** next to an existing resource.
- **Save resource locally** creates a private draft in your browser. This is *not* visible to visitors until you click Publish all to GitHub.
- **Download content backup** exports a JSON file you can keep safely. **Import backup** restores the draft list. This backup does **not** include separate uploaded PDF/images—those remain in your GitHub repository.
- Before using a new computer, connect and **Load from GitHub** to see the published content.

## H. Free tier constraints and candid limitations

- GitHub Pages is static hosting. There is no built-in database, server-side membership system, private file storage, automatic video transcoding, or student accounts.
- Anyone with the public site URL can read published content; links cannot make public files private.
- Each Creator Studio upload is capped at **8 MB**, and large video files should be placed on YouTube rather than the GitHub repository.
- GitHub Pages has usage and site-size limits. The current official limits are at https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits .
- No automatic ad monetization or analytics is configured; these require separate setup and eligibility.
- GitHub Pages is not intended to run an online commerce site or sensitive transactions. This website has no payment processing or server login.
- You will need a free GitHub account and must publish to your own repository. The downloaded zip alone is not an online website.
- The page fonts are loaded from Google Fonts when online; system fonts are used when offline.

## I. Preview on Windows without deploying

If you have Python installed: open Command Prompt inside the extracted `bforbiology-site` directory and run:

```bat
py -m http.server 8000
```

Open `http://localhost:8000/` in Chrome. Open `/admin.html` for Creator Studio. GitHub publishing and file uploads still require an internet connection.

## J. Site files

- `index.html`: student-facing website
- `admin.html`: creator dashboard
- `assets/style.css`: design
- `assets/app.js`: site logic, search, readers and quizzes
- `assets/admin.js`: creator dashboard and GitHub publishing logic
- `data/content.json`: all notes, video links, image links and quiz definitions
- `assets/uploads/`: uploaded resources go here
- `.nojekyll`: allows static GitHub Pages assets to publish as-is
- `README.html`: browser-friendly publishing guide

Built without frameworks, paid APIs, tracking scripts or account requirements for visitors.
