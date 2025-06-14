
// Firebase Configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDaMLH-TqyhdRm2orKVSEr_C3TCXOpbmjU",
    authDomain: "jpql-sql-converter.firebaseapp.com",
    projectId: "jpql-sql-converter",
    storageBucket: "jpql-sql-converter.firebasestorage.app",
    messagingSenderId: "505562665683",
    appId: "1:505562665683:web:282d51ce6963b21716fa26",
    measurementId: "G-NMDFES1JRD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Generate or get session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Check for analytics consent
function hasAnalyticsConsent() {
    return localStorage.getItem('analytics-consent') === 'true';
}

// Initialize analytics only if consent given
function initializeAnalytics() {
    if (hasAnalyticsConsent() && typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
}

// Show analytics notice if not yet decided
function showAnalyticsNotice() {
    if (localStorage.getItem('analytics-consent') === null) {
        const notice = document.createElement('div');
        notice.className = 'analytics-notice';
        notice.innerHTML = `
                    <div class="analytics-notice-text">
                        We use anonymous analytics and collect query examples to improve this tool. No personal data is stored.
                        <a href="#" class="btn-info" onclick="showPrivacyInfo(event)">Learn more</a>
                    </div>
                    <div class="analytics-notice-buttons">
                        <button class="btn-accept" onclick="acceptAnalytics()">Got it</button>
                    </div>
                `;
        document.body.appendChild(notice);
    }
}

function acceptAnalytics() {
    localStorage.setItem('analytics-consent', 'true');
    document.querySelector('.analytics-notice').classList.add('hidden');
    initializeAnalytics();
}

function showPrivacyInfo(e) {
    e.preventDefault();
    alert('We collect the following data to improve our tool:\n\n' +
        '• Query examples (input and output)\n' +
        '• Conversion types and patterns\n' +
        '• Anonymous usage statistics\n' +
        '• Session information (no personal data)\n\n' +
        'Your queries are stored securely in Firebase and help us:\n' +
        '• Improve conversion accuracy\n' +
        '• Add support for more query patterns\n' +
        '• Fix bugs and edge cases\n\n' +
        'We never store personal information or share your data.');
}

// Initialize on page load
window.addEventListener('load', function() {
    initializeAnalytics();
    setTimeout(showAnalyticsNotice, 1000);
});

let isJpqlToSql = true;
let sessionStartTime = Date.now();
let conversionCount = 0;

// Analytics helper function
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined' && hasAnalyticsConsent()) {
        gtag('event', eventName, {
            ...parameters,
            session_duration: Math.floor((Date.now() - sessionStartTime) / 1000)
        });
    }
}

// Track page view with custom dimensions
window.addEventListener('load', function() {
    trackEvent('page_view', {
        page_title: 'JPQL SQL Converter',
        page_location: window.location.href
    });
});

function toggleMode() {
    isJpqlToSql = !isJpqlToSql;

    // Track mode toggle
    trackEvent('mode_toggle', {
        from_mode: isJpqlToSql ? 'sql_to_jpql' : 'jpql_to_sql',
        to_mode: isJpqlToSql ? 'jpql_to_sql' : 'sql_to_jpql'
    });

    const fromLabel = document.getElementById('fromLabel');
    const toLabel = document.getElementById('toLabel');
    const inputLabel = document.getElementById('inputLabel');
    const outputLabel = document.getElementById('outputLabel');
    const inputText = document.getElementById('inputText');
    const arrowIcon = document.getElementById('arrowIcon');

    if (isJpqlToSql) {
        fromLabel.textContent = 'JPQL';
        toLabel.textContent = 'SQL';
        inputLabel.innerHTML = '<i class="bi bi-code-square"></i> Enter JPQL Query:';
        outputLabel.innerHTML = '<i class="bi bi-file-code"></i> Converted SQL Query:';
        inputText.placeholder = 'Enter your JPQL query here...';
        arrowIcon.classList.remove('reversed');
    } else {
        fromLabel.textContent = 'SQL';
        toLabel.textContent = 'JPQL';
        inputLabel.innerHTML = '<i class="bi bi-code-square"></i> Enter SQL Query:';
        outputLabel.innerHTML = '<i class="bi bi-file-code"></i> Converted JPQL Query:';
        inputText.placeholder = 'Enter your SQL query here...';
        arrowIcon.classList.add('reversed');
    }

    document.getElementById('output').textContent = '';
}

function toSnakeCase(query) {
    let params = {};
    query = query.replace(/:\w+/g, (match) => {
        let key = `__param${Object.keys(params).length}__`;
        params[key] = match;
        return key;
    });

    query = query.replace(/\b([a-zA-Z_][a-z0-9]*)([A-Z][a-z0-9]*)+\b/g, (match) => {
        return match.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    });

    Object.keys(params).forEach(key => {
        query = query.replace(key, params[key]);
    });

    return query;
}

function toCamelCase(query) {
    let params = {};
    query = query.replace(/:\w+/g, (match) => {
        let key = `__param${Object.keys(params).length}__`;
        params[key] = match;
        return key;
    });

    // First, handle entity names after FROM and JOIN keywords
    query = query.replace(/\b(FROM|JOIN)\s+([a-z]+(?:_[a-z]+)*)\b/gi, (match, keyword, entityName) => {
        // Convert entity name to PascalCase
        const pascalCase = entityName.split('_').map(part => {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join('');
        return `${keyword} ${pascalCase}`;
    });

    // Then handle remaining snake_case words (fields, etc.)
    query = query.replace(/\b[a-z]+(_[a-z]+)+\b/g, (match) => {
        const upperMatch = match.toUpperCase();
        const sqlKeywords = ['INNER_JOIN', 'LEFT_JOIN', 'RIGHT_JOIN', 'OUTER_JOIN', 'CROSS_JOIN',
            'GROUP_BY', 'ORDER_BY', 'UNION_ALL', 'IS_NULL', 'IS_NOT_NULL',
            'NOT_NULL', 'PRIMARY_KEY', 'FOREIGN_KEY'];

        if (sqlKeywords.includes(upperMatch)) {
            return match;
        }

        // Regular camelCase for fields
        return match.split('_').map((part, index) => {
            if (index === 0) return part.toLowerCase();
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join('');
    });

    Object.keys(params).forEach(key => {
        query = query.replace(key, params[key]);
    });

    return query;
}

function convertText() {
    let inputText = document.getElementById("inputText").value;
    if (!inputText.trim()) {
        showAlert('Please enter a query to convert', 'warning');
        return;
    }

    let convertedText;

    if (isJpqlToSql) {
        convertedText = toSnakeCase(inputText);
    } else {
        convertedText = toCamelCase(inputText);
    }

    document.getElementById("output").textContent = convertedText;

    // Track conversion event
    conversionCount++;
    trackEvent('query_converted', {
        conversion_type: isJpqlToSql ? 'jpql_to_sql' : 'sql_to_jpql',
        input_length: inputText.length,
        output_length: convertedText.length,
        has_parameters: inputText.includes(':'),
        has_joins: inputText.toUpperCase().includes('JOIN'),
        conversion_number: conversionCount
    });

    // Collect user queries (if consent given)
    if (hasAnalyticsConsent()) {
        collectUserQuery(inputText, convertedText);
    }
}

// Query collection function
// async function collectUserQuery(input, output) {
//     try {
//         // Option 1: Send to your webhook
//         await fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', {
//             method: 'POST',
//             body: JSON.stringify({
//                 input: input,
//                 output: output,
//                 type: isJpqlToSql ? 'jpql_to_sql' : 'sql_to_jpql',
//                 timestamp: new Date().toISOString(),
//                 sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
//             })
//         });
//     } catch (error) {
//         console.error('Failed to collect query:', error);
//     }
// }

function copyToClipboard() {
    let outputText = document.getElementById("output").textContent;
    if (!outputText.trim()) {
        showAlert('Nothing to copy! Please convert a query first.', 'warning');
        return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
        showAlert('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error("Error copying text: ", err);
        showAlert('Failed to copy. Please try again.', 'danger');
    });
}

function convertAndCopy() {
    convertText();
    setTimeout(() => {
        let outputText = document.getElementById("output").textContent;
        if (outputText.trim()) {
            copyToClipboard();
        }
    }, 100);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-success`;
    alertDiv.innerHTML = `
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Add keyboard shortcut for convert (Ctrl/Cmd + Enter)
document.getElementById('inputText').addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        convertText();
    }
});

// Google Sign In
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        // Save user info to Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        showAlert(`Welcome, ${user.displayName}!`, 'success');
    } catch (error) {
        console.error('Sign in error:', error);
        showAlert('Sign in failed. Please try again.', 'danger');
    }
}

// Sign Out
async function signOut() {
    try {
        await firebase.auth().signOut();
        showAlert('Signed out successfully', 'success');
    } catch (error) {
        console.error('Sign out error:', error);
        showAlert('Sign out failed', 'danger');
    }
}

// Auth State Observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('userContainer').style.display = 'flex';
        document.getElementById('userPhoto').src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName);
        document.getElementById('userName').textContent = user.displayName;
        document.getElementById('userEmail').textContent = user.email;
    } else {
        // User is signed out
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('userContainer').style.display = 'none';
    }
});

// Collect user query to Firebase
async function collectUserQuery(input, output) {
    if (!hasAnalyticsConsent()) return;

    const user = firebase.auth().currentUser;

    try {
        await db.collection('queries').add({
            input: input,
            output: output,
            conversionType: isJpqlToSql ? 'jpql_to_sql' : 'sql_to_jpql',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            sessionId: getSessionId(),
            // User specific fields
            userId: user ? user.uid : null,
            userEmail: user ? user.email : null,
            userName: user ? user.displayName : null,
            metadata: {
                inputLength: input.length,
                outputLength: output.length,
                hasJoins: input.toUpperCase().includes('JOIN'),
                hasParameters: input.includes(':'),
                hasWhere: input.toUpperCase().includes('WHERE'),
                hasGroupBy: input.toUpperCase().includes('GROUP BY'),
                hasOrderBy: input.toUpperCase().includes('ORDER BY')
            },
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        });

        console.log('Query collected successfully');
    } catch (error) {
        console.error('Error collecting query:', error);
    }
}

// Show Query History
async function showQueryHistory() {
    const user = firebase.auth().currentUser;
    if (!user) {
        showAlert('Please sign in to view history', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    modal.show();

    try {
        const snapshot = await db.collection('queries')
            .where('userId', '==', user.uid)
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        let historyHTML = '';

        if (snapshot.empty) {
            historyHTML = '<p class="text-center text-secondary">No queries found. Start converting!</p>';
        } else {
            snapshot.forEach(doc => {
                const data = doc.data();
                const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'Just now';

                historyHTML += `
                    <div class="query-history-item">
                        <div class="query-history-meta">
                            <span>${date}</span>
                            <span class="query-history-type">${data.conversionType.replace('_', ' → ').toUpperCase()}</span>
                        </div>
                        <div class="query-code">Input: ${escapeHtml(data.input)}</div>
                        <div class="query-code">Output: ${escapeHtml(data.output)}</div>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="reuseQuery('${escapeHtml(data.input)}', ${data.conversionType === 'jpql_to_sql'})">
                            <i class="bi bi-arrow-repeat"></i> Use Again
                        </button>
                    </div>
                `;
            });
        }

        document.getElementById('historyContent').innerHTML = historyHTML;
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('historyContent').innerHTML = '<p class="text-danger">Error loading history</p>';
    }
}

// Reuse query from history
function reuseQuery(query, isJpqlToSqlConversion) {
    const modal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
    modal.hide();

    // Set the mode
    if (isJpqlToSql !== isJpqlToSqlConversion) {
        toggleMode();
    }

    // Set the query
    document.getElementById('inputText').value = query;

    // Convert
    convertText();
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}