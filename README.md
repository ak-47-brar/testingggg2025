# 📚 Study Time Tracker

A comprehensive web application to track your real study time with precision, user authentication, and data management. Perfect for students who want to monitor their study habits and maintain consistency.

## ✨ Features

### 🔐 Multi-User Authentication
- **Secure Login System**: Each user has their own protected account
- **User Registration**: Create account with username, email, and password
- **Password Protection**: Encrypted password storage for security
- **Session Management**: Stay logged in during your study sessions
- **Data Isolation**: Each user's study data is completely separate and private

### ⏱️ Real-Time Study Tracking
- **Stopwatch Timer**: Records actual study time as it happens
- **Pause/Resume**: Take breaks without losing your session
- **Session Notes**: Add notes to each study session for better tracking
- **Auto-Save**: Data automatically saves to your user profile every 30 seconds

### 📊 Analytics & Insights
- **Daily Charts**: Visualize your study patterns with interactive bar charts
- **Continuity Calendar**: See your study streak with color-coded calendar (last 42 days)
- **Study Statistics**:
  - Total study time
  - Number of sessions
  - Average time per day
  - Current streak count

### 📈 Data Views
- **Today's Progress**: Quick overview of current day's achievements
- **Time Range Filters**: View data for 7 days, 30 days, or all time
- **Recent Sessions**: Detailed list of your last 20 study sessions
- **Color-Coded Intensity**: Calendar shows study intensity with different colors
  - Red: No study
  - Light Blue: < 1 hour
  - Medium Blue: 1-2 hours
  - Dark Blue: 2+ hours

### 💾 Data Management & Sync
- **Export Data**: Download your study sessions as JSON backup file
- **Import Data**: Restore or merge data from backup files
- **Cross-Device Transfer**: Export from one device, import on another
- **Clear Data**: Option to reset all sessions if needed
- **User Profile Storage**: Each user's data is linked to their account

## 🚀 Live Demo

Visit: [https://ak-47-brar.github.io/testingggg2025/auth.html](https://ak-47-brar.github.io/testingggg2025/auth.html)

## 💻 Installation

### Use Online (Recommended)
Simply visit the live demo link above - no installation needed!

### Run Locally
1. Clone this repository:
```bash
git clone https://github.com/ak-47-brar/testingggg2025.git
```

2. Open `auth.html` in your web browser to start with login page

That's it! No build process or dependencies required.

## 📱 How to Use

### First Time Setup
1. Visit the app and click **"Sign Up"**
2. Enter your desired username (letters, numbers, underscores only)
3. Provide your email address
4. Create a password (minimum 6 characters)
5. Confirm your password
6. Click **"Sign Up"** to create your account
7. You'll be automatically logged in!

### Logging In
1. Enter your username and password
2. Click **"Login"**
3. Your previous study sessions will be automatically loaded

### Recording a Study Session
1. Click **Start** to begin your study session
2. The timer will start counting immediately
3. Use **Pause** if you need a break (timer stops but session continues)
4. Add optional notes in the text area (what subject, topics covered, etc.)
5. Click **End Session** when done to save your session
6. Session is automatically saved to your user profile!

### Viewing Analytics
1. Click the **Analytics** tab
2. Choose your preferred time range (7 days, 30 days, or all time)
3. Explore:
   - Overall statistics at the top
   - Daily study time chart showing your consistency
   - Continuity calendar showing your streak
   - List of recent sessions with your notes

### Managing Your Data
1. Click the **Sync Data** tab
2. Options available:
   - **Export Data**: Download backup file (e.g., `study-data-username-2025-12-06.json`)
   - **Import Data**: Restore from backup or merge sessions
   - **Auto-Sync Status**: See when data was last saved
   - **Clear Data**: Reset all sessions (use with caution!)

### Transferring Data Between Devices
1. **On Device 1**: Login → Sync Data tab → Export Data
2. **Transfer** the JSON file (via email, cloud storage, USB, etc.)
3. **On Device 2**: Login with same username → Sync Data → Import Data → Select the file
4. Your study history is now on the new device!

## 💡 Why Login System?

### Multi-User Support
- **Multiple students** can use the same device/browser
- **Separate accounts** for family members or roommates
- **Private data** - each user only sees their own study sessions
- **No mixing of data** - your brother's gaming time won't count as your study time! 😄

### Data Organization
- All your study sessions are **linked to your username**
- When you login, your data loads automatically
- When you logout, data is saved to your profile
- Switch between users without losing any data

### Use Cases
- **Siblings sharing a laptop** - each can track separately
- **Study groups** - each member tracks their own time
- **Multiple exam preparations** - use different accounts for different goals
- **Privacy** - logout to prevent others from seeing your study habits

## 💾 Data Storage & Privacy

All your study data is stored **locally in your browser** using `localStorage`. This means:

✅ **Privacy First**:
- Your data is **100% private** and never leaves your device
- No external servers or databases involved
- No internet connection required after initial load
- Passwords are hashed (encrypted) before storage

✅ **Works Offline**:
- Completely functional without internet
- No API keys or external services needed
- Fast and responsive

✅ **User Accounts**:
- Each username has separate data storage
- Login persists during browser session
- Logout required to switch users

⚠️ **Important Notes**:
- Clearing browser data will delete all user accounts and sessions
- Data is browser-specific (Chrome data ≠ Firefox data)
- Use Export feature regularly for backups
- Import feature allows cross-browser/device transfer

## 🛠️ Technical Details

### Frontend
- **Pure HTML/CSS/JavaScript** - No frameworks required
- **Chart.js** - For beautiful data visualizations
- **Responsive Design** - Works on desktop, tablet, and mobile

### Data Management
- **LocalStorage API** - For persistent data storage
- **User Authentication** - Username/password system
- **Session Storage** - For login state management
- **JSON Export/Import** - For data portability
- **Password Hashing** - Simple hash function (demo level)

### Files Structure
```
├── auth.html          # Login/Signup page
├── auth.css           # Authentication page styling
├── auth.js            # Login/signup logic
├── index.html         # Main study tracker app
├── style.css          # Main app styling
├── script.js          # Timer, analytics, data management
└── README.md          # This file
```

## 🔒 Security Features

- **Password Hashing**: Passwords are not stored in plain text
- **Session Management**: Auto-logout on browser close
- **Data Isolation**: Users cannot access each other's data
- **Form Validation**: Prevents invalid inputs
- **Confirmation Dialogs**: Prevent accidental data deletion

*Note: This is a client-side demo app. For production use with sensitive data, implement server-side authentication with proper encryption (bcrypt, JWT, etc.)*

## 📋 Future Enhancements

Potential features for future versions:
- Study goals and targets per user
- Multiple study subjects/categories
- Weekly/monthly reports with email notifications
- Dark mode toggle
- Pomodoro timer technique integration
- Study reminders and scheduling
- Leaderboard for competitive studying (friends)
- Password recovery via email
- Two-factor authentication
- Server-side sync for true cloud backup

## 🤝 Contributing

Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for students preparing for competitive exams like RPSC, RAS, REET who need to track their real study time effectively across multiple subjects and sessions.

---

## 🎯 Quick Start Guide

1. **Visit**: [https://ak-47-brar.github.io/testingggg2025/auth.html](https://ak-47-brar.github.io/testingggg2025/auth.html)
2. **Sign Up**: Create your account (takes 30 seconds)
3. **Start Timer**: Begin tracking your first study session
4. **View Progress**: Check your analytics and maintain your streak
5. **Export Regularly**: Backup your data weekly

**Start tracking your study time today and build a consistent study habit! 🎯📖**