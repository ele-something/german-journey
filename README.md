# German Journey — A1 prototype

A calm, responsive, browser-based German A1 learning prototype.

## Included
- 20 A1 lesson pages with grammar notes, vocabulary, examples, short dialogues and practice tasks
- Quick quizzes with instant scoring
- A1 lesson navigation and completion tracking
- Vocabulary review across the A1 course
- Local progress saved in the browser with `localStorage`
- Article colour key: der = blue, die = red, das = green
- Responsive layout for desktop and mobile

## Run locally
No build tools or package installation are required.

1. Download and unzip this project.
2. Open `index.html` in a modern browser.
3. Your progress is saved in that browser on that device.

For the Google Fonts import, an internet connection is needed; the app itself works without it using fallback fonts.

## Publish with GitHub Pages
1. Create or open your GitHub repository.
2. Upload all files and folders from this project to the repository root (not just the ZIP).
3. Commit the files to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then save.
7. Wait for GitHub Pages to publish the site. The published URL will appear in the Pages settings.

## Important prototype notes
- This is a first A1 prototype, not the finished German Journey product.
- The lesson material is an initial structured version. It should be reviewed and expanded before public launch.
- Progress is stored locally in the browser; it is not synchronised between devices or accounts.
- There is no login, cloud database, audio recording, speech recognition or spaced-repetition scheduler in this prototype.
- The remaining levels (A2, B1 and B2) can be added later using the same lesson data structure.

## Updating later
Add new lessons to `lessons.js` using the same fields (`id`, `title`, `de`, `goal`, `grammar`, `vocab`, `examples`, `dialogue`, `practice`, `quiz`). The app automatically renders them in the course list; progress totals and labels should then be adjusted for the expanded curriculum.
