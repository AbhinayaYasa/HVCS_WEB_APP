# HVCS — Hudson Valley Concierge Services

A modern web application for Hudson Valley Concierge Services, featuring a gallery showcase and admin management portal.

## Stack

- **Frontend:** React + TypeScript + Vite + React Router
- **Backend:** Firebase (Firestore, Storage, Auth)
- **UI:** Custom "Front Desk" concierge aesthetic (no Tailwind)

## Features

- **Home:** Hero, featured gallery preview (6 items), CTAs
- **Gallery:** Responsive grid, category filter, search, lightbox
- **Admin:** Auth-protected upload/manage gallery items

---

## Firebase Project Setup

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g. `hvcs-webapp`)
3. Enable **Google Analytics** (optional)

### 2. Enable Firestore Database

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or production with rules below)
4. Select a region (e.g. `us-east1`)

### 3. Enable Firebase Storage

1. In Firebase Console → **Build** → **Storage**
2. Click **Get started**
3. Use default rules (or deploy custom rules below)

### 4. Enable Email/Password Authentication

1. In Firebase Console → **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider

### 5. Register your app

1. In Firebase Console → Project Settings (gear icon)
2. Under **Your apps**, add a **Web** app
3. Copy the `firebaseConfig` object

### 6. Set environment variables

Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase config:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Deploy to Vercel

1. Connect your GitHub repo to Vercel.
2. **Add environment variables** (required for Firebase):
   - In Vercel: Project Settings → Environment Variables
   - Add each variable from `frontend/.env.example`:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`
3. Redeploy after adding env vars.

Without these variables, the app will show a blank page or an error.

---

## Run Locally

From the project root:

```bash
npm install
npm run dev
```

Or from the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy (Optional)

### Deploy Firestore & Storage rules

```bash
npm install -g firebase-tools
firebase login
cd hvcs-webapp
firebase use --add  # select your project
firebase deploy --only firestore:rules,storage
```

### Deploy Firestore indexes (if needed)

```bash
firebase deploy --only firestore:indexes
```

### Deploy hosting (if using Firebase Hosting)

1. Build the frontend: `cd frontend && npm run build`
2. Configure `firebase.json` hosting section for `frontend/dist`
3. Run: `firebase deploy --only hosting`

---

## Project Structure

```
hvcs-webapp/
├── firebase/           # Firestore & Storage rules
├── frontend/           # React + Vite app
│   └── src/
│       ├── components/
│       ├── lib/        # Firebase, auth, firestore, storage
│       ├── pages/
│       ├── routes/
│       └── types/
└── README.md
```

---

## License

Private — Hudson Valley Concierge Services.
