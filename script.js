/**
 * Football Squares - Core Logic
 * Handles Match Config, Live Score Polling, and Grid Rendering
 */

const urlParams = new URLSearchParams(window.location.search);
const currentMatchId = urlParams.get('id') || 'match_01';
const logoBase = "https://ff.spindleco.com/sbs/images/logos/";

// Game State Constants
const PAYOUT_KEYS = ['q1', 'q2', 'q3', 'final'];
let PAYOUT_VALS = { q1: 0, q2: 0, q3: 0, final: 0 };
let squareOwners = {};
let allParticipants = [];

/**
 * Initialization: Runs on page load
 */
async function init() {
    try {
        const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
        const data = await res.json();
        
        // GRACEFUL FAIL: Ensure we have at least empty objects to work with
        if (data.squares) {
            squareOwners = data.squares.grid ?? {};
            allParticipants = data.squares.participants ?? [];
        }

        // We must draw the grid even if data is missing
        renderStaticGrid();

        // Continue with the rest of the UI update
        updateScore();
        setInterval(updateScore, 60000);
    } catch (err) {
        console.error("Initial load failed. Rendering empty grid.", err);
        renderStaticGrid(); // Draw empty grid as fallback
    }
}

/**
 * Generates the 10x10 Grid (11x11 including headers)
 * Optimized for the "Fixed Left Axis" CSS layout
 */
function renderStaticGrid() {
    const gridElement = document.getElementById('squares-grid');
    if (!gridElement) return;
    gridElement.innerHTML = ''; 

    // --- TOP HEADER ROW (Inside Scroll Area) ---
    // Spacer for the top-left corner
    createSquare('', 'label', gridElement); 
    for (let i = 0; i < 10; i++) {
        createSquare(i, 'label', gridElement);
    }

    // --- GRID BODY ---
    for (let h = 0; h < 10; h++) {
        // Vertical Digit Label (Home Score Digit)
        createSquare(h, 'label', gridElement); 

        for (let a = 0; a < 10; a++) {
            const name = squareOwners[`${a}-${h}`] || '';
            const sq = createSquare(name, 'square', gridElement);
            sq.id = `sq-${a}-${h}`;
            sq.setAttribute('data-owner', name); 
            if (name) sq.style.backgroundColor = stringToColor(name);
        }
    }
}

/**
 * Main Data Fetcher
 * Pulls from api_proxy.php which merges MSN data + Squares JSON
 */
async function updateScore() {
    try {
        const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
        const data = await res.json();
        
        if (data.error) {
            console.error("Match Error:", data.error);
            return;
        }

        // Sync Global State
        PAYOUT_VALS = data.settings.payouts;
        squareOwners = data.squares.grid;
        allParticipants = data.squares.participants;

        const away = data.teams.find(t => t.homeAway === "Away");
        const home = data.teams.find(t => t.homeAway === "Home");

        if (!away || !home) return;

        // Execute visual updates on the next browser paint for max performance
        window.requestAnimationFrame(() => {
            updateLabels(data.settings.title, away, home);
            updateBoxScore(away, home);
            updateWinnersAndPayouts(away, home);
        });

    } catch (err) {
        console.error("Connection lost to API Proxy", err);
    }
}

/**
 * Updates Axis Labels (Logos and Names)
 */
function updateLabels(title, away, home) {
    const titleEl = document.getElementById('match-title');
    if (titleEl) titleEl.innerText = title;

    const topLabel = document.querySelector('.top-label');
    const leftLabel = document.querySelector('.left-label');

    topLabel.innerHTML = `
        <img src="${logoBase}${encodeURIComponent(away.fullName)} Logo.png" class="axis-logo">
        <div class="label-text">${away.fullName.toUpperCase()}</div>
    `;

    leftLabel.innerHTML = `
        <img src="${logoBase}${encodeURIComponent(home.fullName)} Logo.png" class="axis-logo">
        <div class="label-text"><span>${home.fullName.toUpperCase()}</span></div>
    `;
}

/**
 * Renders the Box Score Table
 */
function updateBoxScore(away, home) {
    const tbody = document.getElementById('box-score-body');
    if (!tbody) return;

    tbody.innerHTML = [away, home].map(t => `
        <tr>
            <td class="team-cell">
                <img src="${logoBase}${encodeURIComponent(t.fullName)} Logo.png" class="tiny-logo"> 
                ${t.shortName}
            </td>
            <td>${t.quarters[0]}</td>
            <td>${t.quarters[1]}</td>
            <td>${t.quarters[2]}</td>
            <td>${t.quarters[3]}</td>
            <td class="final-col"><strong>${t.total}</strong></td>
        </tr>
    `).join('');
}

/**
 * Handles Real-Time Grid Highlighting and Payout Calculation
 */
function updateWinnersAndPayouts(away, home, status) {
    const winners = [];
    
    // 1. Reset current grid visual state
    document.querySelectorAll('.square').forEach(s => {
        s.classList.remove('active-winner', 'past-winner');
        const badge = s.querySelector('.q-badge');
        if (badge) badge.remove();
        s.innerText = s.getAttribute('data-owner') || ''; 
    });

    // 2. Logic to determine if we should show winners
    // We check if the game is beyond the "Scheduled" state
    const isGameStarted = (status !== "Scheduled" && status !== "Pre-Game");

    // 3. Loop through 4 Quarters
    for (let i = 0; i < 4; i++) {
        const awayQScore = away.quarters[i];
        const homeQScore = home.quarters[i];
        
        // We only process a quarter if the game has started 
        // AND this specific quarter has been reached/played
        const hasQuarterStarted = (awayQScore > 0 || homeQScore > 0 || i < getCurrentQuarterIndex(away, home));

        if (isGameStarted) {
            const aDigit = awayQScore % 10;
            const hDigit = homeQScore % 10;
            const winnerName = squareOwners[`${aDigit}-${hDigit}`];
            
            // Only push to winners and draw on grid if there's been play in this quarter
            // or if it's the very first quarter and the game is live
            if (i === 0 || (awayQScore !== away.quarters[i-1] || homeQScore !== home.quarters[i-1])) {
                 winners.push(winnerName);

                 const el = document.getElementById(`sq-${aDigit}-${hDigit}`);
                 if (el) {
                    // Only mark Q4 as "Active" if it's actually the end of the game or Q4 is live
                    const isFinalQuarter = (i === 3);
                    el.classList.add(isFinalQuarter ? 'active-winner' : 'past-winner');
                    
                    const badge = document.createElement('span');
                    badge.className = 'q-badge';
                    badge.innerText = `Q${i+1}`;
                    el.appendChild(badge);
                 }
            }
        }
    }

    renderPayoutLeaderboard(winners);
}

function getCurrentQuarterIndex(away, home) {
    // Basic logic: if total > sum of first 3 quarters, we are in Q4
    // For simplicity, we can pass the "currentPlayingPeriod" from the API if needed
    return 0; 
}

/**
 * Renders the combined Participant List + Earnings
 */
function renderPayoutLeaderboard(winners) {
    const container = document.getElementById('payout-list');
    if (!container) return;

    // GRACEFUL FAIL: Handle empty participant list
    if (allParticipants.length === 0) {
        container.innerHTML = `<div class="payout-item"><em>No participants assigned yet.</em></div>`;
        return;
    }

    const earnings = {};
    winners.forEach((name, i) => {
        if (!name) return;
        earnings[name] = (earnings[name] || 0) + (PAYOUT_VALS[PAYOUT_KEYS[i]] ?? 0);
    });

    const sortedList = [...allParticipants].sort((a, b) => {
        const earnA = earnings[a.name] || 0;
        const earnB = earnings[b.name] || 0;
        return earnB - earnA || b.count - a.count;
    });

    container.innerHTML = sortedList.map(p => {
        const earned = earnings[p.name] || 0;
        return `
            <div class="participant-row ${earned > 0 ? 'has-earnings' : ''}">
                <div class="p-info">
                    <span class="p-name">${p.name}</span>
                    <span class="p-count">${p.count} Squares</span>
                </div>
                <div class="p-payout">${earned > 0 ? `$${earned}` : '--'}</div>
            </div>`;
    }).join('');
}

/**
 * Utilities
 */
function createSquare(text, className, container) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    container.appendChild(div);
    return div;
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 90%)`;
}

// Kick off the app
init();