# Publishing to the Chrome Web Store

Updates are uploaded with one command. **By design the package is uploaded as a
draft and is NOT published automatically** — you review it and click *Publish* in
the dashboard. This avoids accidentally pushing a bad build live.

- Extension ID: `ibgnnkojbkconppocnmdobeodcaijmfm`
- Tool: [`chrome-webstore-upload-cli`](https://github.com/fregante/chrome-webstore-upload-cli) (pinned to v3)
- Credentials live in a gitignored `.env.webstore` (never committed)

## One-time setup

You need three values: `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`. This is the
fiddly part, but it is only done once.

1. **Google Cloud project + API**
   - Open <https://console.cloud.google.com/>, create (or pick) a project.
   - APIs & Services → Library → search "Chrome Web Store API" → **Enable**.

2. **OAuth consent screen**
   - APIs & Services → OAuth consent screen → User type **External** → fill the
     required app name / email.
   - Add yourself under **Test users** (so you can authorize without app review).

3. **OAuth client ID (gives CLIENT_ID + CLIENT_SECRET)**
   - APIs & Services → Credentials → Create credentials → **OAuth client ID**.
   - Application type: **Desktop app**.
   - Copy the generated **Client ID** and **Client secret**.

4. **Refresh token (gives REFRESH_TOKEN)**
   - Run the interactive helper and follow the browser prompt:
     ```
     npx chrome-webstore-upload-keys
     ```
   - Paste the Client ID / Client secret when asked; authorize in the browser; it
     prints the **refresh token**.

5. **Store the credentials locally**
   ```
   cp .env.webstore.example .env.webstore
   # then edit .env.webstore and fill in CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN
   ```
   `.env.webstore` is gitignored. Keep it out of version control.

## Releasing an update

1. Bump the version in **both** `manifests/manifest.v3.json` and
   `manifests/manifest.v2.json` (and `options.html` is synced by the build). The
   new version must be higher than what is currently published.
2. Upload a fresh, clean build as a draft:
   ```
   rake upload
   ```
   This runs `rake build` first (clean zip, `.DS_Store` excluded), then uploads
   `fastmail-plus-chrome.zip` to the store as a draft.
3. Review and publish:
   - Open <https://chrome.google.com/webstore/devconsole>, select *Fastmail Plus*,
     confirm the draft looks right, then click **Publish** (submits for review).

## Notes

- Only Chrome is supported. Edge users can install from the Chrome Web Store, so no
  separate Edge listing is required. The Firefox (`manifest.v2`) path is dormant.
- To enable one-command publish later (skip the manual click), add `--auto-publish`
  to the `upload` task's CLI call in the `Rakefile`. Left off intentionally for safety.
- A future option is a GitHub Actions workflow that uploads on a version tag; that
  would require putting the same three secrets into GitHub Actions secrets.
