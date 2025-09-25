let currentCivilId = '';
let currentEmail = '';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/civil/profile');
        if (response.ok) {
            const data = await response.json();
            displayUserInfo(data.civil);
        } else {
            window.location.href = '/civil_login?error=session_expired';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Failed to load profile information', 'error');
    }

    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', handleNameSubmit);
    }
});

function displayUserInfo(civil) {
    currentCivilId = civil.civil_id;
    currentEmail = civil.civil_email;

    const civilIdElement = document.getElementById('civilId');
    const civilEmailElement = document.getElementById('civilEmail');
    const civilNameInput = document.getElementById('civilName');

    if (civilIdElement) civilIdElement.textContent = civil.civil_id;
    if (civilEmailElement) civilEmailElement.textContent = civil.civil_email;
    if (civilNameInput) civilNameInput.value = civil.civil_name || '';
}

async function handleNameSubmit(event) {
    event.preventDefault();

    const civilNameInput = document.getElementById('civilName');
    const civilName = civilNameInput.value.trim();

    if (!civilName) {
        showMessage('Please enter a display name', 'error');
        return;
    }

    if (civilName.length < 2) {
        showMessage('Display name must be at least 2 characters long', 'error');
        return;
    }

    if (civilName.length > 17) {
        showMessage('Display name must be 17 characters or less', 'error');
        return;
    }

    try {
        const response = await fetch('/api/civil/update-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ civilName: civilName })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Name updated successfully! Redirecting to main dashboard...', 'success');
            setTimeout(() => {
                window.location.href = '/civil_main';
            }, 2000);
        } else {
            showMessage(result.error || 'Failed to update name', 'error');
        }
    } catch (error) {
        console.error('Error updating name:', error);
        showMessage('Network error occurred. Please try again.', 'error');
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    const messageText = document.getElementById('messageText');

    if (messageDiv && messageText) {
        messageText.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        if (type === 'error') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}