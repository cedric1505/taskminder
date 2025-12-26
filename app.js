const API_URL = '/api'; // Relative path works for same-origin deployment

// --- AUTH FUNCTIONS ---
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        loadDashboard();
    } else {
        alert(data.msg);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    location.reload();
}

// --- TASK FUNCTIONS ---
async function loadDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;

    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-msg').innerText = `Hello, ${localStorage.getItem('username')}`;

    const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'x-auth-token': token }
    });
    const tasks = await res.json();
    
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `priority-${task.priority.toLowerCase()}`;
        li.innerHTML = `
            <span>${task.title} <small>(${task.priority})</small></span>
            <button onclick="deleteTask('${task._id}')">X</button>
        `;
        list.appendChild(li);
    });
}

async function addTask() {
    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('task-priority').value;
    const token = localStorage.getItem('token');

    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
        },
        body: JSON.stringify({ title, priority })
    });
    
    document.getElementById('task-title').value = '';
    loadDashboard(); // Refresh list
}

async function deleteTask(id) {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
    });
    loadDashboard();
}

// Check if already logged in on load
if (localStorage.getItem('token')) loadDashboard();