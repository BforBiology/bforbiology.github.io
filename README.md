# B for Biology — SEO upgrade (6 November 2026)

**Free site:** https://bforbiology.github.io/  
**Existing repository:** https://github.com/BforBiology/bforbiology.github.io

This upgrades the existing GitHub Pages website (not a new repository). It includes the existing sample resources **and** the Cell Biology note seen in the live repository on 6 November 2026. If your content has changed since then, back up your current `data/content.json` from GitHub before overwriting it.

## Deploy in five steps

1. Back up your current repository first: **Code → Download ZIP** on GitHub. Separately download the current `data/content.json` if you added newer resources.
2. Extract this upgrade ZIP. Open the root folder and **upload its contents**, not the outer folder or the ZIP, to `https://github.com/BforBiology/bforbiology.github.io/upload/main`.
3. Github's browser upload may not replace existing files cleanly. The reliable option is **GitHub Desktop**: clone your repository, copy the extracted upgrade's contents into the clone, then **Commit to main → Push origin**. This replaces matching files and preserves existing Git history. Never place a token in the repository.
4. If you have content newer than this package, retain your live `data/content.json` and use Creator Studio to regenerate pages (or restore it before publishing).
5. Confirm GitHub Pages Settings → Pages → Deploy from branch → main / (root). Visit `https://bforbiology.github.io/` when updated.

## Keep individual pages searchable

- Each resource has a real public page at `/lessons/<resource-id>/` and is listed in `sitemap.xml`.
- After editing or adding a resource in Creator Studio, click **Save locally**, then **Publish all to GitHub**. The upgraded publisher updates JSON, generates a static HTML page for each resource, removes old generated pages for deleted resources, and updates `sitemap.xml`.
- If any individual file publish fails, check the detailed status and repeat only after checking the remote files; backup your JSON before major changes. Avoid concurrent editing from two browser tabs.
- Sitemap: `https://bforbiology.github.io/sitemap.xml`. Add this in Search Console → Sitemaps as `sitemap.xml`.

## Creator Studio instructions

1. Open `https://bforbiology.github.io/admin.html` from a trusted device.
2. Enter **BforBiology**, **bforbiology.github.io**, branch **main**, and your fine-grained GitHub token limited to this repository with **Contents: Read/write**. Never put the token in source code or screenshots.
3. Select an existing resource to edit or fill the new resource form. You can write Hindi and English text, upload small PDFs and images, embed YouTube videos, and add MCQ quiz JSON.
4. Click **Save resource locally**. Then **Publish all to GitHub** to deploy.
5. Click **Forget connection** and close the browser tab when finished. The token remains in browser tab memory only; drafts are stored in browser local storage. The dashboard page is PUBLIC (not a password-protected admin server).

## Limitations and honest disclosures

- This is a **static site**, not a private server-side CMS. Avoid entering sensitive student information.
- Content metadata lives in `data/content.json` (public). The individual lesson pages become indexable only *after* publishing them.
- Do not assume Google will index or rank every resource; sitemap submission is not guaranteed indexing.
- The sample resources are for demonstration, and some lack videos/images. Replace them with substantial, original material before considering advertising.
- Contact is a public GitHub Issues link until you configure a real address.
- Privacy Policy is a starting policy describing the provided code; review and update it before adding analytics, advertising, contact forms or tracking.
- A GitHub Pages `github.io` address and GitHub's non-commercial-use restrictions may limit monetization. Verify current ad network requirements and hosting terms before applying.
- External Google fonts in the existing CSS can entail third-party network requests; change to system fonts if you want no external font requests.

## Verify after deploy

- Homepage loads stylesheet and lists lessons.
- Click a resource and verify a dedicated lesson page loads.
- Open `/about.html`, `/contact.html`, `/privacy.html`, `/disclaimer.html`, `/sitemap.xml`, `/robots.txt`.
- Open Creator Studio, connect, edit a resource, save locally, then publish and check the generated page.
