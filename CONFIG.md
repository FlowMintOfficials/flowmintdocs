# Config and GitHub Pages – keep secrets out of the repo

`config.json` (and `config.js` generated from it) can contain **sensitive data**: UPI ID, support/general/privacy emails. If you publish this site with **GitHub Pages**, those files are served as static assets, so:

- **Do not commit** `config.json` or `config.js` when they contain real UPI/emails.
- Use **placeholders** in the repo and **inject real values only at deploy time** (e.g. from GitHub Actions secrets).

## 1. Local / one-off publish

1. **Copy the template**: `cp config.example.json config.json`
2. **Edit** `config.json` with your real UPI ID and emails (only on your machine; do not commit).
3. **Generate** `config.js` (so pages work without fetch):
   ```bash
   node -e "const fs=require('fs');const c=JSON.parse(fs.readFileSync('config.json','utf8'));fs.writeFileSync('config.js','// Generated from config.json – do not commit if it contains real data\nwindow.FLOWMINT_CONFIG='+JSON.stringify(c)+';\n');"
   ```
4. **Do not** add `config.json` or `config.js` to git when they contain real data (they are in `.gitignore`).

## 2. GitHub Pages with deploy-time config (recommended)

Keep the **repo** free of real UPI/emails. At **deploy time**, create `config.json` (and optionally `config.js`) from **GitHub repository secrets**.

### Option A: GitHub Actions that inject config

1. In the repo: **Settings → Secrets and variables → Actions**. Add secrets, e.g.:
   - `CONFIG_CONTACT_GENERAL_EMAIL`
   - `CONFIG_CONTACT_PRIVACY_EMAIL`
   - `CONFIG_PAYMENT_UPI_ID`
   - `CONFIG_PAYMENT_SUPPORT_EMAIL`
2. In your **Pages deploy workflow**, add a step that builds `config.json` from these secrets and writes it (and `config.js`) into the directory that gets published. The workflow runs in a trusted environment; the repo and the published branch never need to store real values.

Example step (adjust keys to match your config shape):

```yaml
- name: Create config from secrets
  env:
    GENERAL_EMAIL: ${{ secrets.CONFIG_CONTACT_GENERAL_EMAIL }}
    PRIVACY_EMAIL: ${{ secrets.CONFIG_CONTACT_PRIVACY_EMAIL }}
    UPI_ID: ${{ secrets.CONFIG_PAYMENT_UPI_ID }}
    SUPPORT_EMAIL: ${{ secrets.CONFIG_PAYMENT_SUPPORT_EMAIL }}
  run: |
    # Create config.json (simplified; extend with full JSON from config.example.json)
    cat > config.json << EOF
    {
      "contact": { "generalEmail": "$GENERAL_EMAIL", "privacyEmail": "$PRIVACY_EMAIL" },
      "payment": { "upiId": "$UPI_ID", "supportEmail": "$SUPPORT_EMAIL", "mailSubject": "FlowMint Pro - Payment Completed - License Request", "mailBody": "..." },
      "plans": $(cat config.example.json | jq '.plans'),
      "proFeaturesList": $(cat config.example.json | jq '.proFeaturesList')
    }
    EOF
    node -e "const fs=require('fs');const c=JSON.parse(fs.readFileSync('config.json','utf8'));fs.writeFileSync('config.js','window.FLOWMINT_CONFIG='+JSON.stringify(c)+';');"
```

Then deploy the site (e.g. push to `gh-pages` or use `actions/upload-pages-artifact`) so the built output includes this `config.json` and `config.js`. The **source branch** never contains real UPI/emails.

### Option B: Build on your machine, push only built output

If you build and push from your machine:

1. Keep `config.json` and `config.js` **out of the repo** (they are in `.gitignore`).
2. Build the site locally (with real config only on your machine) and push only the **built** folder (e.g. to `gh-pages`). The main branch stays without real config.

Downside: the branch you push to (e.g. `gh-pages`) will still contain the real config in the built output. Anyone with access to that branch can see it. **Option A (Actions + secrets)** is safer: only the Actions runner ever sees the secrets; the published artifact can still contain config, but the repo and main branch do not.

## 3. What to commit

- **Do commit**: `config.example.json` (placeholders only), this `CONFIG.md`, and the rest of the site.
- **Do not commit**: `config.json` or `config.js` when they contain real UPI ID or real email addresses. They are in the repo root `.gitignore` so git will ignore them.

If `config.json` or `config.js` were **already committed** with real data, remove them from git (keep the files on disk):

```bash
git rm --cached Github_docs/config.json Github_docs/config.js
git commit -m "Stop tracking config files; use config.example.json and deploy-time injection"
```

Then add real config only at deploy time (e.g. GitHub Actions secrets) or keep it locally and never push it.

## Summary

| Item | In repo (committed) | At deploy / locally |
|------|---------------------|----------------------|
| `config.example.json` | ✅ Placeholders only | — |
| `config.json` | ❌ Ignored | Created from secrets or local copy |
| `config.js` | ❌ Ignored | Generated from `config.json` |

This way you can publish to GitHub Pages without storing UPI or API/email details in the repository.
