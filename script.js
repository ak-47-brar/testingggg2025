// Global variables
let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;
let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];

// DOM Elements
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const sessionNotes = document.getElementById('session-notes');

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
        
        if (page === 'analytics') {
            updateAnalytics();
        }
    });
});

// Timer Functions
function updateTimerDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    
    // Update current session time
    const sessionHours = Math.floor(totalSeconds / 3600);
    const sessionMinutes = Math.floor((totalSeconds % 3600) / 60);
    document.getElementById('current-session-time').textContent = `${sessionHours}h ${sessionMinutes}m`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            totalSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function stopTimer() {
    if (totalSeconds > 0) {
        // Save session
        const session = {
            date: new Date().toISOString(),
            duration: totalSeconds,
            notes: sessionNotes.value.trim()
        };
        
        sessions.unshift(session);
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        
        // Reset timer
        clearInterval(timerInterval);
        totalSeconds = 0;
        isRunning = false;
        updateTimerDisplay();
        sessionNotes.value = '';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        
        // Update today's stats
        updateTodayStats();
        
        alert('Session saved successfully!');
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);

// Today's Stats
function updateTodayStats() {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
        new Date(s.date).toDateString() === today
    );
    
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    document.getElementById('today-total').textContent = `${hours}h ${minutes}m`;
    document.getElementById('today-sessions').textContent = todaySessions.length;
    document.getElementById('streak-days').textContent = `${calculateStreak()} days`;
}

function calculateStreak() {
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    while (true) {
        const dateStr = currentDate.toDateString();
        const hasSession = sessions.some(s => 
            new Date(s.date).toDateString() === dateStr
        );
        
        if (hasSession) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Analytics Functions
let currentRange = 7;
let dailyChart = null;

function updateAnalytics() {
    const filteredSessions = getSessionsInRange(currentRange);
    updateOverviewStats(filteredSessions);
    updateDailyChart(filteredSessions);
    updateContinuityCalendar();
    updateSessionsList();
}

function getSessionsInRange(days) {
    if (days === 'all') return sessions;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return sessions.filter(s => new Date(s.date) >= cutoffDate);
}

function updateOverviewStats(filteredSessions) {
    const totalTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    document.getElementById('total-time').textContent = `${hours}h ${minutes}m`;
    document.getElementById('total-sessions').textContent = filteredSessions.length;
    
    // Average per day
    const days = currentRange === 'all' ? getDaysSinceFirstSession() : currentRange;
    const avgSeconds = days > 0 ? totalTime / days : 0;
    const avgHours = Math.floor(avgSeconds / 3600);
    const avgMinutes = Math.floor((avgSeconds % 3600) / 60);
    document.getElementById('avg-time').textContent = `${avgHours}h ${avgMinutes}m`;
    
    document.getElementById('current-streak').textContent = `${calculateStreak()} days`;
}

function getDaysSinceFirstSession() {
    if (sessions.length === 0) return 0;
    const firstDate = new Date(sessions[sessions.length - 1].date);
    const today = new Date();
    const diffTime = Math.abs(today - firstDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function updateDailyChart(filteredSessions) {
    const days = currentRange === 'all' ? 30 : currentRange;
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const daySessions = filteredSessions.filter(s => 
            new Date(s.date).toDateString() === dateStr
        );
        const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        data.push(Math.round(totalMinutes));
    }
    
    const ctx = document.getElementById('daily-chart').getContext('2d');
    
    if (dailyChart) {
        dailyChart.destroy();
    }
    
    dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Minutes Studied',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

function updateContinuityCalendar() {
    const calendar = document.getElementById('continuity-calendar');
    calendar.innerHTML = '';
    
    // Show last 42 days (6 weeks)
    for (let i = 41; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const daySessions = sessions.filter(s => 
            new Date(s.date).toDateString() === dateStr
        );
        
        const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = date.getDate();
        dayDiv.title = `${dateStr}: ${Math.round(totalMinutes)} minutes`;
        
        if (totalMinutes === 0) {
            dayDiv.classList.add('no-study');
        } else if (totalMinutes < 60) {
            dayDiv.classList.add('light');
        } else if (totalMinutes < 120) {
            dayDiv.classList.add('medium');
        } else {
            dayDiv.classList.add('heavy');
        }
        
        calendar.appendChild(dayDiv);
    }
}

function updateSessionsList() {
    const container = document.getElementById('sessions-container');
    container.innerHTML = '';
    
    const recentSessions = sessions.slice(0, 20);
    
    if (recentSessions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">No sessions recorded yet</p>';
        return;
    }
    
    recentSessions.forEach(session => {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'session-item';
        
        const date = new Date(session.date);
        const hours = Math.floor(session.duration / 3600);
        const minutes = Math.floor((session.duration % 3600) / 60);
        
        sessionDiv.innerHTML = `
            <div class="session-date">${date.toLocaleString()}</div>
            <div class="session-duration">${hours}h ${minutes}m</div>
            ${session.notes ? `<div class="session-note">${session.notes}</div>` : ''}
        `;
        
        container.appendChild(sessionDiv);
    });
}

// Range buttons
document.querySelectorAll('.range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRange = btn.dataset.range === 'all' ? 'all' : parseInt(btn.dataset.range);
        updateAnalytics();
    });
});

// Initialize
updateTimerDisplay();
updateTodayStats();