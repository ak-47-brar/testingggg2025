// GitHub-based Authentication System
// Uses users.json in the repo as a database

const GITHUB_CONFIG = {
    owner: 'ak-47-brar',
    repo: 'testingggg2025',
    branch: 'main',
    file: 'users.json'
};

// GitHub API endpoints (no auth token needed for public repos)
const GITHUB_API = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.file}`;
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.file}`;

let usersDatabase = { users: [], lastUpdated: new Date().toISOString() };

// Load users from GitHub
async function loadUsersFromGitHub() {
    try {
        const response = await fetch(GITHUB_RAW + '?t=' + Date.now());
        if (response.ok) {
            usersDatabase = await response.json();
            console.log('Users loaded from GitHub:', usersDatabase.users.length);
            return true;
        }
    } catch (error) {
        console.error('Error loading users from GitHub:', error);
    }
    return false;
}

// Save users to GitHub (requires user to manually update via export)
async function saveUsersToGitHub() {
    // Since we can't push without auth token, we'll provide instructions
    showSaveInstructions();
}

function showSaveInstructions() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:30px;border-radius:15px;max-width:600px;max-height:80vh;overflow-y:auto;';
    
    content.innerHTML = `
        <h2 style="color:#667eea;margin-bottom:20px;">💾 Save User Database</h2>
        <p style="margin-bottom:15px;">Your account has been created locally. To sync with GitHub:</p>
        
        <div style="background:#f0f9ff;padding:15px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#374151;margin-bottom:10px;">Option 1: Auto-Export (Recommended)</h3>
            <p style="color:#6b7280;margin-bottom:10px;">Click the button below to download the updated users.json file:</p>
            <button id="download-users" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">
                💾 Download users.json
            </button>
            <p style="color:#6b7280;margin-top:10px;font-size:14px;">Then upload it to the GitHub repo manually.</p>
        </div>
        
        <div style="background:#fef2f2;padding:15px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#374151;margin-bottom:10px;">Option 2: Copy & Paste</h3>
            <p style="color:#6b7280;margin-bottom:10px;">Copy this JSON and paste it into users.json on GitHub:</p>
            <textarea id="users-json" readonly style="width:100%;height:150px;padding:10px;border:2px solid #e5e7eb;border-radius:8px;font-family:monospace;font-size:12px;">${JSON.stringify(usersDatabase, null, 2)}</textarea>
            <button id="copy-json" style="padding:10px 20px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;margin-top:10px;font-weight:bold;">
                📋 Copy to Clipboard
            </button>
        </div>
        
        <p style="color:#6b7280;font-size:14px;margin-top:20px;">
            <strong>Note:</strong> Without a GitHub token, users are stored locally. 
            To enable true cloud sync, you can manually update the users.json file in the repo.
        </p>
        
        <button id="close-modal" style="padding:12px 30px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;margin-top:20px;width:100%;font-weight:bold;">
            Close
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Download button
    document.getElementById('download-users').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(usersDatabase, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.json';
        a.click();
        URL.revokeObjectURL(url);
        showMessage('signup-form', 'File downloaded! Upload it to GitHub repo.', 'success');
    });
    
    // Copy button
    document.getElementById('copy-json').addEventListener('click', () => {
        const textarea = document.getElementById('users-json');
        textarea.select();
        document.execCommand('copy');
        showMessage('signup-form', 'JSON copied to clipboard!', 'success');
    });
    
    // Close button
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
}

// Switch between login and signup forms
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
});

// Utility functions
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

function showMessage(formId, message, type = 'error') {
    const form = document.getElementById(formId);
    const existingMsg = form.querySelector('.error-message, .success-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = type === 'error' ? 'error-message' : 'success-message';
    msgDiv.textContent = message;
    form.insertBefore(msgDiv, form.firstChild);
    
    if (type === 'success') {
        setTimeout(() => msgDiv.remove(), 3000);
    }
}

function setCurrentUser(user) {
    const userSession = {
        username: user.username,
        email: user.email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    sessionStorage.setItem('isLoggedIn', 'true');
}

// Signup Handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('signup-form', 'Passwords do not match!');
        return;
    }
    
    // Load latest users from GitHub
    await loadUsersFromGitHub();
    
    // Check if username exists
    if (usersDatabase.users.some(u => u.username === username)) {
        showMessage('signup-form', 'Username already exists!');
        return;
    }
    
    // Check if email exists
    if (usersDatabase.users.some(u => u.email === email)) {
        showMessage('signup-form', 'Email already registered!');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
        studySessions: []
    };
    
    usersDatabase.users.push(newUser);
    usersDatabase.lastUpdated = new Date().toISOString();
    
    // Save to localStorage as backup
    localStorage.setItem('studyTrackerUsers', JSON.stringify(usersDatabase.users));
    
    showMessage('signup-form', 'Account created! Please save to GitHub...', 'success');
    
    // Show save instructions
    setTimeout(() => {
        saveUsersToGitHub();
    }, 1000);
    
    // Auto login
    setTimeout(() => {
        setCurrentUser(newUser);
        window.location.href = 'index.html';
    }, 3000);
});

// Login Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Try to load from GitHub first
    await loadUsersFromGitHub();
    
    // Fallback to localStorage
    if (usersDatabase.users.length === 0) {
        const localUsers = JSON.parse(localStorage.getItem('studyTrackerUsers')) || [];
        if (localUsers.length > 0) {
            usersDatabase.users = localUsers;
        }
    }
    
    const user = usersDatabase.users.find(u => u.username === username);
    
    if (!user) {
        showMessage('login-form', 'Username not found!');
        return;
    }
    
    if (user.password !== hashPassword(password)) {
        showMessage('login-form', 'Incorrect password!');
        return;
    }
    
    showMessage('login-form', 'Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        setCurrentUser(user);
        // Restore user's study sessions
        if (user.studySessions && user.studySessions.length > 0) {
            localStorage.setItem('studySessions', JSON.stringify(user.studySessions));
        }
        window.location.href = 'index.html';
    }, 1000);
});

// Check if already logged in
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'index.html';
}

// Load users on page load
loadUsersFromGitHub();
