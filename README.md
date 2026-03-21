# Save Rupee — Frontend

APP :- https://save-rupeee.vercel.app

React PWA frontend for Save Rupee, a personal finance tracker. Built with React 19, Redux Toolkit, and Tailwind CSS v4.

## Tech Stack

- **Framework** — React 19
- **Build Tool** — Vite
- **State Management** — Redux Toolkit
- **Routing** — React Router v7
- **HTTP Client** — Axios
- **Styling** — Tailwind CSS v4
- **Charts** — Recharts
- **Icons** — Lucide React
- **PWA** — vite-plugin-pwa

## Features

- Google OAuth 2.0 login — no email/password
- Persistent auth via httpOnly JWT cookie
- One-time currency selection (permanently locked after set)
- Add, edit, and delete transactions
- Three transaction types — Expense, Earn, Invest
- Fixed category allowlist per type
- Infinite scroll transaction list
- All-time and filtered summary cards (All Time / This Year / This Month)
- Monthly bar chart with year selector
- PDF export with date range picker
- Soft-delete with 30-day account recovery flow
- Dark mode default with light/dark toggle (persisted in localStorage)
- PWA installable on Android Chrome
- Click-outside-to-close dropdown menus
- Full form validation (amount, note length, date range)

## Project Structure

```
client/
├── public/
│   ├── SaveRupeeeLogo.png       # App logo
│   └── manifest.json            # PWA manifest
│
├── src/
│   ├── app/
│   │   └── store.js             # Redux store
│   │
│   ├── components/
│   │   ├── Navbar.jsx           # Top bar (logo, theme toggle, avatar menu)
│   │   ├── BottomNav.jsx        # Bottom navigation (Home/Analytics/Settings)
│   │   ├── FABButton.jsx        # Floating Add Transaction button
│   │   └── Modal.jsx            # Reusable modal overlay
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.js           # Auth state + fetchMe thunk
│   │   │   ├── ProtectedRoute.jsx     # Redirects unauthenticated users
│   │   │   └── CurrencySetup.jsx      # One-time currency selection screen
│   │   │
│   │   ├── transactions/
│   │   │   ├── transactionSlice.js    # Transactions state + thunks
│   │   │   ├── TransactionForm.jsx    # Add transaction form
│   │   │   ├── TransactionList.jsx    # Infinite scroll list
│   │   │   ├── TransactionItem.jsx    # Single transaction row
│   │   │   └── EditTransactionForm.jsx # Edit transaction form
│   │   │
│   │   ├── summary/
│   │   │   ├── summarySlice.js        # Summary state + thunks
│   │   │   ├── SummaryCards.jsx       # 4 cards (Earned/Spent/Invested/Cash Left)
│   │   │   └── MonthlyChart.jsx       # Recharts bar chart
│   │   │
│   │   └── settings/
│   │       ├── settingsSlice.js       # Settings state (delete account)
│   │       └── themeSlice.js          # Theme state (dark/light, localStorage)
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx        # Google login + account recovery flow
│   │   ├── DashboardPage.jsx    # Home tab (summary cards + transactions)
│   │   ├── AnalyticsPage.jsx    # Analytics tab (filter + chart)
│   │   └── SettingsPage.jsx     # Settings tab (export + delete account)
│   │
│   ├── services/
│   │   └── api.js               # Axios instance (baseURL + withCredentials)
│   │
│   ├── utils/
│   │   └── categories.utils.js  # Category allowlist (matches backend)
│   │
│   ├── App.jsx                  # Routes + Layout
│   ├── main.jsx                 # ReactDOM + Redux Provider + theme init
│   └── index.css                # Tailwind v4 import + dark mode variant
│
├── .env
├── vite.config.js
├── package.json
└── index.html
```

## Pages & Flows

### Login
- Google OAuth button redirects to backend `/auth/google`
- On success → redirected to `/dashboard` or `/setup`
- Deleted account → recovery screen with days remaining
- Account recovery → restored via email lookup

### Currency Setup `/setup`
- First-time users pick a default currency
- Currency is permanently locked after confirmation
- Supported: INR, USD, EUR, GBP, AED, SGD, AUD

### Dashboard `/dashboard`
- Summary cards — Earned, Spent, Invested, Cash Left (all-time)
- Infinite scroll transaction list (10 per page)
- FAB pill button to add new transaction

### Analytics `/analytics`
- Filter pills — All Time / This Year / This Month
- Summary cards update based on selected filter
- Monthly bar chart with year selector (2020 to current year)

### Settings `/settings`
- User profile card (avatar, name, email, locked currency)
- PDF export with date range (2020-01-01 to today)
- Delete account with 30-day recovery window

## Validation Rules (Frontend)

- **Amount** — must be > 0 and ≤ 99,999,999.99
- **Note** — max 20 characters (live counter shown)
- **Date** — must be between 2020-01-01 and today (enforced on submit, not just picker)
- **Export dates** — same range, from must be before to

## Getting Started

### Prerequisites
- Node.js v18+
- Backend running (see [Save Rupee Backend](https://github.com/Piyussh-22/Save-Rupeee-Backend))

### Setup

```bash
# Clone the repo
git clone https://github.com/Piyussh-22/Save-Rupeee-Frontend.git
cd Save-Rupeee-Frontend

# Install dependencies
npm install

# Copy env template and fill in values
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

### Build for Production

```bash
npm run build
```

## Deployment

This app is deployed on [Vercel](https://vercel.com).

Set `VITE_API_URL` to your live backend URL in Vercel's environment variables.

**Live App:** (https://save-rupeee.vercel.app)

## PWA Installation

**Android (Chrome):**
An install button appears automatically in the navbar when the app is opened in Chrome over HTTPS. Tap it to install to your home screen.

**iOS (Safari):**
Tap the Share button → "Add to Home Screen".

## Dark Mode

Dark mode is the default. Toggle via the sun/moon icon in the navbar. Preference is saved in `localStorage` and persists across sessions.

## License

MIT
