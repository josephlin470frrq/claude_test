document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
        showError(getErrorMessage(error));
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth_failed': 'Authentication failed. Please try again.',
        'account_not_active': 'Your account is not active. Please contact support.',
        'registration_failed': 'Registration failed. Please try again.',
        'server_error': 'Server error occurred. Please try again later.',
        'access_denied': 'Access denied. Please check your permissions.'
    };

    return errorMessages[errorCode] || 'An unknown error occurred. Please try again.';
}