# User Credentials Storage System

## 💾 How It Works

This app uses **users.json** file in the GitHub repository as a database to store user credentials and study data.

## 📁 File Structure

### users.json
```json
{
  "users": [
    {
      "username": "student1",
      "email": "student1@example.com",
      "password": "hashed_password_here",
      "createdAt": "2025-12-06T00:00:00.000Z",
      "studySessions": [
        {
          "date": "2025-12-06T01:00:00.000Z",
          "duration": 7200,
          "notes": "RPSC Polity revision",
          "username": "student1"
        }
      ]
    }
  ],
  "lastUpdated": "2025-12-06T00:00:00.000Z"
}
```

## 🔐 Security Features

1. **Password Hashing**: Passwords are hashed using a simple hash function (not plain text)
2. **No API Keys Needed**: Uses public GitHub raw content URLs
3. **Local Backup**: All data also stored in browser localStorage

## 🔄 Sync Process

### When User Signs Up:
1. Account created in browser memory
2. Added to local users database
3. User downloads updated `users.json`
4. Manually uploads to GitHub repo
5. Other devices can now see this user

### When User Logs In:
1. App fetches `users.json` from GitHub
2. Checks if username exists
3. Verifies password hash
4. Loads user's study sessions

## 📝 Manual Update Steps

### Method 1: Download & Upload
1. Sign up in the app
2. Click "Download users.json" button
3. Go to: https://github.com/ak-47-brar/testingggg2025
4. Click on `users.json` file
5. Click "Edit" (pencil icon)
6. Delete old content
7. Paste new content from downloaded file
8. Commit changes

### Method 2: Direct Edit
1. Copy JSON from the modal popup
2. Go to: https://github.com/ak-47-brar/testingggg2025/blob/main/users.json
3. Click "Edit" (pencil icon)
4. Paste the copied JSON
5. Commit changes

## ✨ Benefits

✅ **No Backend Server**: Uses GitHub as free database
✅ **No API Keys**: Public repo access doesn't need authentication
✅ **Version Control**: GitHub keeps history of all changes
✅ **Free Forever**: GitHub provides free hosting and storage
✅ **Cross-Device**: Update once, access everywhere

## ⚠️ Important Notes

- **Public Repo**: Anyone can view users.json (don't use real passwords!)
- **Manual Sync**: Requires manual file update for true cloud sync
- **Demo Purpose**: This is educational - production apps need proper backend
- **Password Security**: Uses simple hash (production needs bcrypt + salt)

## 🚀 Access Points

### Browser Access
- **App**: https://ak-47-brar.github.io/testingggg2025/auth-github.html
- **Raw File**: https://raw.githubusercontent.com/ak-47-brar/testingggg2025/main/users.json

### API Access
- **GitHub API**: https://api.github.com/repos/ak-47-brar/testingggg2025/contents/users.json

## 📊 Data Flow Diagram

```
User Signs Up
    ↓
Account Created (Browser)
    ↓
Export users.json
    ↓
Manually Upload to GitHub
    ↓
Other Devices Fetch from GitHub
    ↓
Cross-Device Sync Complete!
```

## 🔧 For Developers

### To Add Auto-Sync (Advanced):
1. Create GitHub Personal Access Token
2. Add token to app (use environment variables)
3. Use GitHub API to automatically update users.json
4. Enable automatic commits

**Note**: Current version doesn't use tokens to keep it simple and free!

---

**Use `auth-github.html` for GitHub sync version or `auth.html` for local-only version.**
