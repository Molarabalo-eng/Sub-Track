# SubTrack 📱💳
> *"Help every user take back control of their money by making subscription spending visible, manageable, and optimisable — one reminder at a time."*

SubTrack is a mobile-first subscription management and bill reminder application designed to eliminate surprise charges, highlight wasted subscription spending, and offer curated cost-effective alternatives.

---

## 🚨 The Core Problem

Recurring subscriptions are a silent drain on personal finances. Most users accumulate streaming, SaaS, data, and utility bills across various platforms without a single consolidated view.

### Key Pain Points
* **Surprise Auto-Renewals**: Subscriptions renew automatically without advance notice, charging users unexpectedly.
* **Fragmented Subscriptions**: Streaming services (Netflix, Spotify), utilities (Electricity, Internet/Data), and software (Google One, Microsoft 365) are managed separately.
* **Wasted Spending**: Idle subscriptions continue charging month after month without the user noticing.
* **Unawareness of Alternatives**: Cheaper or free local alternatives exist, but users lack visibility into potential savings.

### Primary Target Persona
* **Name**: Jeff (22–35 years old)
* **Device**: Android Smartphone (Primary)
* **Income**: Mid-level, budget-conscious
* **Active Subscriptions**: Netflix, Spotify, YouTube Premium, Electricity, Mobile Data, DSTV/Showmax
* **Goal**: Avoid surprise debits, cancel unused services, and reduce recurring monthly expenses.

---

## 💡 The Solution

SubTrack is a lightweight, mobile-first application built to solve recurring bill friction:
1. **Centralized Tracking**: Log and visualize all active subscriptions in one place with dynamic multi-currency support (₦ NGN, $ USD, £ GBP).
2. **Smart Renewal Reminders**: Receive timely alerts at **T-5 days**, **T-3 days**, and **D-Day (Renewal Day)** before money leaves your account.
3. **Unused Service Detection**: Passive signals tag inactive subscriptions with a **"Possibly Unused"** badge.
4. **Cheaper Alternatives Engine**: Curated savings engine suggests lower-cost local alternatives (e.g., switching Netflix Standard to Showmax, or Spotify Premium to Boomplay).

---

## ✨ Features (MVM Scope)

### 📊 1. Subscription Tracker & Spend Dashboard
* Aggregated view of total monthly spend across all active services.
* Upcoming renewal list sorted by next due date with countdown badges (`Renews today`, `3d left`, `Overdue`).
* Quick search and subscription details modal with 1-tap price editing and instant deletion.

### 🇳🇬 2. Multi-Currency & Localized Plans
* Native currency support: **Naira (₦)**, **US Dollar ($)**, and **British Pound (£)**.
* Pre-loaded local subscription pricing tiers (e.g. Netflix Nigeria ₦2,200–₦7,000/mo, Spotify ₦900/mo, Electricity averages).

### ⚡ 3. Visual Quick-Add & Custom Entry
* **Option A Visual Grid**: Tap-to-select grid grouped by categories (*Streaming*, *Music*, *Utilities*, *Productivity*).
* **Custom Subscriptions**: Free-text modal entry for any unlisted service (e.g. Canva, Gym, ChatGPT).

### 🔔 4. Smart Renewal Reminders
* Pre-renewal alerts scheduled at 5 days, 3 days, and 0 days (D-Day).
* **Quiet Hours Support**: Configurable suppression window (e.g., 10 PM to 7 AM) to prevent disturbance.

### 💡 5. Cheaper Alternatives Engine
* Direct inline recommendations showing potential monthly savings.
  | Active Subscription | Suggested Alternative | Potential Savings |
  | :--- | :--- | :--- |
  | Netflix Standard | Showmax (₦1,900/mo) | Save up to ₦2,500/mo |
  | Spotify Premium | Boomplay (₦900/mo) | Save up to ₦900/mo |
  | Google One 100GB | Free Tier (15GB) | Save ₦950/mo |
  | YouTube Premium | YouTube (Free with Ads) | Save ₦1,190/mo |

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool & Bundler**: [Vite 8](https://vitejs.dev/)
* **Authentication**: [Clerk React](https://clerk.com/) (Passwordless & OAuth)
* **Database & BaaS**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security RLS)
* **Icons & Styling**: [Lucide React](https://lucide.dev/) + Vanilla CSS design system
* **Mobile Runtime Target**: Android APK (Capacitor / Webview / PWA)

---

## 🚀 How to Build & Use

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Android Studio** (for building the Android `.apk` binary)

---

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/subtrack.git
cd subtrack
npm install
```

---

### 2. Configure Environment Variables

Create a `.env.local` file in the project root with your Clerk and Supabase credentials:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

---

### 3. Run Locally (Web Dev Server)

Start the Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

### 4. Build Production Web Assets

To build and typecheck the optimized production web bundle:

```bash
npm run build
```

The compiled output will be generated in the `dist/` directory.

---

## 📱 Building the Android APK

SubTrack is engineered as a mobile-first app designed for Android deployment. You can compile the web build into an Android `.apk` package using **Capacitor**.

### Step 1: Install Capacitor in the Project

```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
```

### Step 2: Initialize Capacitor Config

```bash
npx cap init SubTrack com.subtrack.app --web-dir dist
```

### Step 3: Build Web Assets & Add Android Platform

```bash
npm run build
npx cap add android
```

### Step 4: Sync Assets with Native Android Container

```bash
npx cap sync android
```

### Step 5: Build Android APK

#### Option A — Via Command Line (Gradle):
```bash
cd android
./gradlew assembleDebug
```
The compiled debug APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B — Via Android Studio:
```bash
npx cap open android
```
In Android Studio:
1. Wait for Gradle sync to finish.
2. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Transfer the generated `.apk` file to your Android phone and install!

---

## 📂 Project Structure

```text
subtrack/
├── public/
│   └── icons/                 # Service brand logos
├── src/
│   ├── components/            # Reusable UI components (BottomNav, ManageModal)
│   ├── lib/                   # Utility modules (supabase client, currency helper, subscription service)
│   ├── pages/                 # Main route pages (SplashScreen, CountrySelect, Onboarding, Dashboard, Profile)
│   ├── App.tsx                # App router & Clerk authentication wrapper
│   └── main.tsx               # Entry point
├── dist/                      # Production build bundle
├── package.json
└── README.md
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
