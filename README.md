# Valentine's Website 💖

A romantic interactive website built with Next.js featuring:

- 😏 Forced YES proposal moment (moving NO button)
- 🗓️ Time-locked Valentine week messages (Feb 7–14, 2026)
- 💾 One-time acceptance memory using localStorage
- 🎨 Beautiful gradient animations

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

### Proposal Page (/)

- YES button stores acceptance in localStorage
- NO button runs away when you hover over it
- Automatic redirect if already accepted

### Valentine Week Page (/valentine)

- 8 days of romantic messages (Rose Day → Valentine's Day)
- Messages unlock daily from Feb 7-14, 2026
- Navigate between unlocked days
- Future days remain locked until their date
- **Google Calendar Integration** - Add reminder with one click

## 📅 Google Calendar Setup (Optional)

To enable the "Mark your calendar" feature:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Calendar API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://your-site.vercel.app`)
   - Copy the Client ID

4. **Configure Environment Variable:**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Client ID:

   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

5. **Restart dev server:**
   ```bash
   npm run dev
   ```

**Note:** If Google Calendar API is not configured, the button will fallback to opening Google Calendar web interface with pre-filled event details.

## Tech Stack

- Next.js 14
- React 18
- CSS with gradients and animations
- localStorage for state persistence
- Date API for unlock logic
- Google Calendar API for reminders

## Deploy on Vercel

```bash
npm install -g vercel
vercel
```

Made with ❤️ for someone special
