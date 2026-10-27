/**
 * Hasana Real-time Visitor & Usage Analytics Tracker (Real Data)
 */

function getSessionId() {
    let vid = localStorage.getItem('hasana_vid');
    if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('hasana_vid', vid);
    }
    let sid = sessionStorage.getItem('hasana_sess_id');
    if (!sid) {
        sid = 's_' + Math.random().toString(36).substring(2, 8) + '_' + vid;
        sessionStorage.setItem('hasana_sess_id', sid);
    }
    return sid;
}

let activeInterval = null;

export function trackPageView(location) {
    try {
        if (!location || !location.pathname) {
            return;
        }

        // Do not track admin portal visits
        if (location.pathname.startsWith('/admin')) {
            return;
        }

        if (activeInterval) {
            clearInterval(activeInterval);
            activeInterval = null;
        }

        const sessionId = getSessionId();
        const fullPath = location.pathname + (location.search || '');

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        // Initial page visit hit
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                session_id: sessionId,
                path: fullPath,
                duration_seconds: 10,
                is_heartbeat: false,
            }),
        }).catch(() => {});

        // Heartbeat every 15 seconds while tab is active to record real reading duration
        activeInterval = setInterval(() => {
            if (document.hidden) {
                return;
            }

            fetch('/api/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    path: fullPath,
                    duration_seconds: 15,
                    is_heartbeat: true,
                }),
            }).catch(() => {});
        }, 15000);
    } catch (e) {
        // Silently fail to never disrupt user app experience
    }
}
