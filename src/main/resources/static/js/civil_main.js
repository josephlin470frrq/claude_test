let sessionTimer = null;
let idleTimer = null;
let timeoutCounter = 120;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadProfileData();
        setupLogoutHandler();
        setupIdleTracking();
        resetIdleTimer();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        window.location.href = '/civil_login?error=session_expired';
    }
});

async function loadProfileData() {
    try {
        const response = await fetch('/api/civil/profile');
        if (!response.ok) {
            throw new Error('Failed to load profile');
        }

        const data = await response.json();
        displayProfileData(data);
    } catch (error) {
        console.error('Error loading profile:', error);
        throw error;
    }
}

function displayProfileData(data) {
    const { civil, mainRootFreq, subRootFreq, soulType } = data;

    document.getElementById('userName').textContent = civil.civil_name || 'User';
    document.getElementById('civilId').textContent = civil.civil_id;
    document.getElementById('civilName').textContent = civil.civil_name;
    document.getElementById('civilEmail').textContent = civil.civil_email;
    document.getElementById('gmailBind').textContent = civil.gmail_bind ? 'Yes' : 'No';
    document.getElementById('characterId').textContent = civil.character_id;
    document.getElementById('hopeFreqId').textContent = civil.hope_freq_id || '-';
    document.getElementById('luvBalance').textContent = civil.civil_luv_balance.toString();
    document.getElementById('pointBalance').textContent = civil.civil_point_balance.toString();

    if (mainRootFreq) {
        document.getElementById('mainFreqId').textContent = mainRootFreq.freq_id;
        document.getElementById('mainFreqSpell').textContent = mainRootFreq.spell || '-';
        document.getElementById('mainFreqName').textContent = mainRootFreq.name || '-';
        document.getElementById('mainFreqDetailed').textContent = mainRootFreq.detailed || '-';
    }

    if (subRootFreq) {
        document.getElementById('subFreqId').textContent = subRootFreq.freq_id;
        document.getElementById('subFreqSpell').textContent = subRootFreq.spell || '-';
        document.getElementById('subFreqName').textContent = subRootFreq.name || '-';
        document.getElementById('subFreqDetailed').textContent = subRootFreq.detailed || '-';
    }

    if (soulType) {
        document.getElementById('soulId').textContent = soulType.soul_id;
        document.getElementById('soulName').textContent = soulType.name || '-';
        document.getElementById('soulCore').textContent = soulType.core || '-';
        document.getElementById('soulMapping').textContent = soulType.mapping || '-';
        document.getElementById('soulApp').textContent = soulType.app || '-';
    }

    document.getElementById('civilCreator').textContent = civil.civil_creator ? 'Yes' : 'No';
    document.getElementById('civilParticip').textContent = civil.civil_particip ? 'Yes' : 'No';
    document.getElementById('civilVolunteer').textContent = civil.civil_volunteer ? 'Yes' : 'No';
    document.getElementById('civilUndertake').textContent = civil.civil_undertake ? 'Yes' : 'No';
}

function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok || response.redirected) {
                    window.location.href = '/civil_login';
                } else {
                    window.location.href = '/civil_login';
                }
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/civil_login';
            }
        });
    }
}

function setupIdleTracking() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });

    const extendBtn = document.getElementById('extendSession');
    if (extendBtn) {
        extendBtn.addEventListener('click', function() {
            hideSessionWarning();
            resetIdleTimer();
        });
    }
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(sessionTimer);
    hideSessionWarning();

    idleTimer = setTimeout(showSessionWarning, 120000);
}

function showSessionWarning() {
    const warningDiv = document.getElementById('sessionTimeout');
    const counterSpan = document.getElementById('timeoutCounter');

    if (warningDiv && counterSpan) {
        timeoutCounter = 120;
        counterSpan.textContent = timeoutCounter;
        warningDiv.style.display = 'flex';

        sessionTimer = setInterval(function() {
            timeoutCounter--;
            counterSpan.textContent = timeoutCounter;

            if (timeoutCounter <= 0) {
                clearInterval(sessionTimer);
                window.location.href = '/civil_login?error=session_timeout';
            }
        }, 1000);
    }
}

function hideSessionWarning() {
    const warningDiv = document.getElementById('sessionTimeout');
    if (warningDiv) {
        warningDiv.style.display = 'none';
    }

    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
}