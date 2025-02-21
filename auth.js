// auth.js - Authentication Management Script

// Check authentication status and update UI
async function checkAuth() {
    try {
        const response = await fetch('/api/me', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const userData = await response.json();
            updateAuthUI(userData.organization_name);
            return true;
        } else {
            showAuthLinks();
            return false;
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        showAuthLinks();
        return false;
    }
}

// Update UI for authenticated user
function updateAuthUI(username) {
    const authLinks = document.getElementById('authLinks');
    const userInfo = document.getElementById('userInfo');
    const usernameSpan = document.getElementById('username');

    if (authLinks && userInfo && usernameSpan) {
        authLinks.style.display = 'none';
        userInfo.style.display = 'flex';
        usernameSpan.textContent = username;
    }
}

// Show authentication links for non-authenticated users
function showAuthLinks() {
    const authLinks = document.getElementById('authLinks');
    const userInfo = document.getElementById('userInfo');

    if (authLinks && userInfo) {
        authLinks.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Logout functionality
async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            showAuthLinks();
            window.location.href = '/';
        } else {
            console.error('Logout failed:', await response.text());
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check auth status for all pages except login/register
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        checkAuth();
    }
});

// Protect authenticated routes
function protectRoutes() {
    const protectedRoutes = ['/donate.html', '/collect.html', '/profile.html'];
    
    if (protectedRoutes.includes(window.location.pathname)) {
        checkAuth().then(isAuthenticated => {
            if (!isAuthenticated) {
                window.location.href = '/login.html';
            }
        });
    }
}

// Initialize route protection
document.addEventListener('DOMContentLoaded', protectRoutes);