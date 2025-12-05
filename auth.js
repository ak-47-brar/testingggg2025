// Authentication System using LocalStorage

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
    // Simple hash for demo - in production, use proper hashing
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

function getUsers() {
    return JSON.parse(localStorage.getItem('studyTrackerUsers')) || [];
}

function saveUsers(users) {
    localStorage.setItem('studyTrackerUsers', JSON.stringify(users));
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
document.getElementById('signupForm').addEventListener('submit', (e) => {
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
    
    const users = getUsers();
    
    // Check if username exists
    if (users.some(u => u.username === username)) {
        showMessage('signup-form', 'Username already exists!');
        return;
    }
    
    // Check if email exists
    if (users.some(u => u.email === email)) {
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
    
    users.push(newUser);
    saveUsers(users);
    
    showMessage('signup-form', 'Account created successfully! Redirecting...', 'success');
    
    // Auto login
    setTimeout(() => {
        setCurrentUser(newUser);
        window.location.href = 'index.html';
    }, 1500);
});

// Login Handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
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