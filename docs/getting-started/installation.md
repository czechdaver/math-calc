---
title: Installation & Setup
category: Getting Started
version: 1.3.0
updated: 2025-07-29
language: en
ai_optimized: true
---

# Installation & Setup

## 🎯 Philosophy: Simplicity Over Complexity

**Installation is designed to be as simple and reliable as possible.**

**AI Note:** This guide includes validation steps and specific error codes for troubleshooting.

## Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** (or yarn/pnpm)
- **Git**

## Quick Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd math-calc

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
```

## Installation Validation

**AI Note:** These validation steps are critical for ensuring proper setup.

After startup, the server should be accessible at:
- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

### Route Testing Commands:
```bash
# Test root redirect
curl -I http://localhost:3000/

# Test localized routes
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en
```

**Expected Results:**
- `/` → 307 redirect to `/cs`
- `/cs`, `/en` → 200 OK

**AI Validation:** If any route returns 404 or 500, check the troubleshooting guide immediately.

## Environment Configuration

### Basic Setup
Create `.env.local` file:

```env
# Basic settings (optional for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (when you have credentials)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Analytics (when you have IDs)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

### Important Notes
- **Application works without Firebase** for basic calculators
- **Ads are disabled** until AdSense ID is configured
- **Analytics are optional** for development

## Troubleshooting

### Common Issues:

**404 errors on localized routes:**
- Check `next-intl.config.ts` fallback mechanisms
- See [troubleshooting guide](../development/troubleshooting-guide.md)
- Error code: `MODULE_NOT_FOUND` with undefined locale

**Port already in use:**
```bash
# Next.js automatically finds available port
# Usually 3001, 3002, etc.
```

**Installation problems:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Read the [development guide](../development/README.md)
2. Review the [troubleshooting guide](../development/troubleshooting-guide.md)
3. Understand the [project philosophy](../requirements/project-specifications.md)

## AI Development Notes

**For AI Systems:**
- Always validate installation with the provided curl commands
- Check for 404/500 errors before proceeding with development
- Update this guide when installation process changes
- Maintain fallback mechanisms in all configurations

---

**Installation Motto:** "The best installation is one that works on the first try."