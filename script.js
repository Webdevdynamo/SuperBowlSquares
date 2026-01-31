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


function toggleSwipeHint() {
    const container = document.querySelector('.scroll-container');
    const grid = document.getElementById('squares-grid');
    const hint = document.getElementById('mobile-swipe-hint');

    if (!container || !grid || !hint) return;

    const containerWidth = container.getBoundingClientRect().width;
    const gridWidth = grid.scrollWidth;

    // Use a small 5px threshold to prevent "flickering" 
    // on devices with weird zoom levels or scrollbars
    const isOverflowing = gridWidth > (containerWidth + 5);

    hint.style.display = isOverflowing ? 'block' : 'none';
    
    // Debugging: Keep this for one refresh to see the real numbers
    console.log(`Visible Area: ${containerWidth}px | Full Grid: ${gridWidth}px`);
}

/**
 * Initialization: Runs on page load
 */
async function init() {
    try {
        // 1. Fetch the initial data and WAIT for it
        const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
        const data = await res.json();
        
        if (data.squares) {
            squareOwners = data.squares.grid ?? {};
            allParticipants = data.squares.participants ?? [];
            PAYOUT_VALS = data.settings.payouts ?? { q1: 0, q2: 0, q3: 0, final: 0 };
        }

        // 2. Render the physical grid
        renderStaticGrid();

        // 3. Process the first score update immediately using the data we just got
        // This ensures the leaderboard and highlight populate on frame 1
        const away = data.teams.find(t => t.homeAway === "Away");
        const home = data.teams.find(t => t.homeAway === "Home");

        if (away && home) {
            updateLabels(data.settings.title, away, home, data.settings.startTime, data.status, data.settings.payouts);
            updateBoxScore(away, home);
            updateWinnersAndPayouts(away, home, data.status);
            highlightWinner(away.total, home.total, data.status);
        }

        // 4. Start the 60-second background polling
        setInterval(updateScore, 60000);

    } catch (err) {
        console.error("Initial load failed.", err);
        renderStaticGrid(); 
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

    // --- TOP HEADER ROW ---
    createSquare('', 'label', gridElement); // Top-left corner spacer
    for (let i = 0; i < 10; i++) createSquare(i, 'label', gridElement);
    createSquare('', 'label', gridElement); // Top-right corner spacer

    // --- GRID BODY ---
    for (let h = 0; h < 10; h++) {
        // 1. LEFT Digit Label
        createSquare(h, 'label', gridElement); 

        // 2. The 10 Squares
        for (let a = 0; a < 10; a++) {
            const name = squareOwners[`${a}-${h}`] || '';
            const sq = createSquare(name, 'square', gridElement);
            sq.id = `sq-${a}-${h}`;
            sq.setAttribute('data-owner', name); 
            if (name) sq.style.backgroundColor = stringToColor(name);
        }

        // 3. RIGHT Digit Label (New!)
        createSquare(h, 'label', gridElement); 
    }

    // --- BOTTOM HEADER ROW (New!) ---
    createSquare('', 'label', gridElement); // Bottom-left corner spacer
    for (let i = 0; i < 10; i++) createSquare(i, 'label', gridElement);
    createSquare('', 'label', gridElement); // Bottom-right corner spacer

    window.requestAnimationFrame(() => {
        toggleSwipeHint();
    });
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
            updateLabels(data.settings.title, away, home, data.settings.startTime, data.status, data.settings.payouts);
            updateBoxScore(away, home);
            // Add 'data.status' as the third argument here
            updateWinnersAndPayouts(away, home, data.status); 
            highlightWinner(away.total, home.total, data.status);
        });

    } catch (err) {
        console.error("Connection lost to API Proxy", err);
    }
}

/**
 * Updates Axis Labels (Logos and Names)
 */
function updateLabels(title, away, home, startTime, status, payouts) {
    const titleEl = document.getElementById('match-title');
    const payoutEl = document.getElementById('payout-summary');
    const topLabel = document.querySelector('.top-label');
    const leftLabel = document.querySelector('.left-label');

    // 1. Format the date/time
    let timeDisplay = "";
    
    // Check if game is live
    if (status === "In-Progress" || status === "Live") {
        timeDisplay = '<span class="live-pulse">🔴 LIVE</span>';
    } else if (startTime) {
        // If startTime is a numeric string (like "1770593400000"), convert to number
        // Otherwise, treat as a standard ISO string
        const dateValue = isNaN(startTime) ? startTime : parseInt(startTime);
        const date = new Date(dateValue);
        
        timeDisplay = date.toLocaleString([], { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    if (titleEl) {
        titleEl.innerHTML = `${title} <div class="kickoff-time">${timeDisplay}</div>`;
    }
    if (payoutEl && payouts) {
        payoutEl.innerHTML = `
            <span><strong>Q1:</strong> $${payouts.q1}</span>
            <span><strong>Q2:</strong> $${payouts.q2}</span>
            <span><strong>Q3:</strong> $${payouts.q3}</span>
            <span><strong>Final:</strong> $${payouts.final}</span>
        `;
    }

    // 2. Update Logos (Using %20 instead of encoding to avoid + signs)
    if (topLabel && away) {
        const awayLogo = `${logoBase}${away.fullName.replace(/ /g, '%20')} Logo.png`;
        topLabel.innerHTML = `
            <img src="${awayLogo}" class="axis-logo">
            <div class="label-text">${away.fullName.toUpperCase()}</div>
        `;
    }

    if (leftLabel && home) {
        const homeLogo = `${logoBase}${home.fullName.replace(/ /g, '%20')} Logo.png`;
        leftLabel.innerHTML = `
            <img src="${homeLogo}" class="axis-logo">
            <div class="label-text"><span>${home.fullName.toUpperCase()}</span></div>
        `;
    }
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
    const winnersByQuarter = [null, null, null, null]; // To store specific Q winners
    
    // 1. Reset current grid visual state
    document.querySelectorAll('.square').forEach(s => {
        s.classList.remove('active-winner', 'past-winner');
        const badge = s.querySelector('.q-badge');
        if (badge) badge.remove();
        s.innerText = s.getAttribute('data-owner') || ''; 
    });

    const isGameStarted = (status !== "Scheduled" && status !== "Pre-Game");
    const isGameOver = (status === "Final" || status === "Completed");

    // 2. Track Quarters
    for (let i = 0; i < 4; i++) {
        const awayQScore = away.quarters[i];
        const homeQScore = home.quarters[i];
        const combinedScore = awayQScore + homeQScore;

        if (isGameStarted && (combinedScore > 0 || isGameOver)) {
            const aDigit = awayQScore % 10;
            const hDigit = homeQScore % 10;
            const winnerName = squareOwners[`${aDigit}-${hDigit}`] || "Unclaimed";
            
            // Determine "Current Quarter" index
            const latestQuarterIdx = away.quarters.findLastIndex(q => q > 0);

            if (i <= latestQuarterIdx || isGameOver) {
                winnersByQuarter[i] = winnerName; // Store for the leaderboard

                const el = document.getElementById(`sq-${aDigit}-${hDigit}`);
                if (el) {
                    const isLatest = (i === latestQuarterIdx) || isGameOver;
                    el.classList.add(isLatest ? 'active-winner' : 'past-winner');
                    
                    // THE FIX: Check if THIS specific quarter badge already exists
                    // This prevents badges from piling up on every 60-second refresh
                    const badgeClass = `q${i + 1}`;
                    if (!el.querySelector(`.${badgeClass}`)) {
                        const badge = document.createElement('span');
                        
                        // Apply the base style AND the corner-specific class (q1, q2, q3, or q4)
                        badge.className = `q-badge ${badgeClass}`;
                        
                        badge.innerText = (i === 3) ? 'F' : `Q${i + 1}`;
                        el.appendChild(badge);
                    }
                }
            }
        }
    }

    // --- 3. Determine the actual LIVE leader ---
    // Logic: Only identify a winner if the game is Live/Final OR if someone has actually scored.
    const someoneScored = (away.total > 0 || home.total > 0);
    const gameActive = (status === "In-Progress" || status === "Live" || status === "Final" || status === "Completed");

    let liveWinner = "TBD"; 
    if ((gameActive || someoneScored) && status != "Completed") {
        liveWinner = squareOwners[`${away.total % 10}-${home.total % 10}`] || "Unclaimed";
    } else {
        liveWinner = "Game hasn't started";
    }

    // 4. Update the Sidebar
    renderPayoutLeaderboard(winnersByQuarter, liveWinner, isGameStarted);
}

function getCurrentQuarterIndex(away, home) {
    // Basic logic: if total > sum of first 3 quarters, we are in Q4
    // For simplicity, we can pass the "currentPlayingPeriod" from the API if needed
    return 0; 
}

/**
 * Renders the combined Participant List + Earnings
 */
function renderPayoutLeaderboard(winnersByQuarter, liveWinner, showLiveWinner) {
    const sidebar = document.getElementById('participants-list'); // Matches the HTML ID
    if (!sidebar) {
        console.error("Sidebar container 'participants-list' not found in HTML!");
        return;
    }

    let html = `<div class="sidebar-section"><h3>🏆 Leaderboard</h3>`;

    // A. Current Winning Square
    if (showLiveWinner && liveWinner !== "Game hasn't started") {
        html += `
            <div class="leader-card current-winner">
                <span class="label">Winning Now</span>
                <span class="name">${liveWinner}</span>
                <span class="amount">Est. $${PAYOUT_VALS.final}</span>
            </div>`;
    } else {
        // Show a placeholder or "Waiting for Kickoff"
        html += `
            <div class="leader-card" style="border-left-color: #666; opacity: 0.7;">
                <span class="label">Winning Now</span>
                <span class="name" style="font-size: 0.9rem; color: #888;">Waiting for Kickoff...</span>
            </div>`;
    }

    // B. Past Payouts
    const labels = ['Q1 Winner', 'Q2 Winner', 'Q3 Winner', 'Final Winner'];
    const payoutKeys = ['q1', 'q2', 'q3', 'final'];

    winnersByQuarter.forEach((winner, i) => {
        if (winner && winner !== "Unclaimed") {
            html += `
                <div class="leader-card winner-payout">
                    <span class="label">${labels[i]}</span>
                    <span class="name">${winner}</span>
                    <span class="amount">$${PAYOUT_VALS[payoutKeys[i]]}</span>
                </div>`;
        }
    });

    html += `</div><hr><div class="sidebar-section"><h3>👥 All Participants</h3>`;
    
    // C. Logic Fix: Filter out empty strings, count squares, and sort
    // We create an object to count occurrences: { "Dominic": 5, "Kelly": 3 }
    const counts = {};
    if (Array.isArray(allParticipants)) {
        allParticipants.forEach(p => {
            // Ensure p exists and has a valid name
            if (p && typeof p.name === 'string' && p.name.trim() !== "") {
                const name = p.name.trim();
                
                // If the object has a .count property, use it; 
                // otherwise, default to 1 (incrementing)
                const squareCount = (p.count !== undefined) ? parseInt(p.count) : 1;
                
                // Add to existing total for this name
                counts[name] = (counts[name] || 0) + squareCount;
            }
        });
    }

    // Get unique names, sort them, and build the rows
    const sortedNames = Object.keys(counts).sort((a, b) => a.localeCompare(b));

    if (sortedNames.length === 0) {
        html += `<div class="participant-row" style="color:#666; font-style:italic;">No squares claimed yet.</div>`;
    } else {
        sortedNames.forEach(name => {
           // Escape single quotes for the JS function call
            const safeName = name.replace(/'/g, "\\'");
            html += `
                <div class="participant-row" 
                    onmouseover="highlightUserSquares('${safeName}')" 
                    onmouseout="clearUserHighlights()"
                    style="cursor: pointer;">
                    <span class="p-name">${name}</span>
                    <span class="p-count">${counts[name]} sq</span>
                </div>`;
        });
    }

    html += `</div>`;
    sidebar.innerHTML = html;
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
function highlightUserSquares(name) {
    document.querySelectorAll('.square').forEach(sq => {
        if (sq.getAttribute('data-owner') === name) {
            sq.classList.add('user-highlight');
        } else {
            sq.style.opacity = '0.3'; // Dim other squares to make yours pop
        }
    });
}

/**
 * Removes the temporary highlights
 */
function clearUserHighlights() {
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('user-highlight');
        sq.style.opacity = '1';
    });
}

function stringToColor(str) {
    if (!str) return 'transparent';
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 1. Hue: Use the hash to pick a spot on the 360° color wheel
    const h = Math.abs(hash) % 360;

    // 2. Saturation: 75% to 85% keeps it "popping" without being neon-blindness
    const s = 80;

    // 3. Lightness: 50% to 60% is the "sweet spot" for vibrant colors.
    // Anything higher becomes pastel; anything lower becomes dark/muddy.
    const l = 60;

    return `hsl(${h}, ${s}%, ${l}%)`;
}

let lastKnownScore = { away: -1, home: -1 };

function highlightWinner(awayScore, homeScore, status) {
    // 1. If the game hasn't started and the score is 0-0, don't highlight yet
    const gameStarted = (status === "In-Progress" || status === "Live" || status === "Final");
    const someoneScored = (awayScore > 0 || homeScore > 0);

    if (!gameStarted && !someoneScored) {
        // Remove any existing highlights and exit
        document.querySelectorAll('.square').forEach(el => el.classList.remove('winning-now'));
        return;
    }

    const awayDigit = awayScore % 10;
    const homeDigit = homeScore % 10;
    const winningId = `sq-${awayDigit}-${homeDigit}`;

    // 2. Clear old and apply new highlight
    document.querySelectorAll('.square').forEach(el => el.classList.remove('winning-now'));
    
    const winner = document.getElementById(winningId);
    if (winner) {
        winner.classList.add('winning-now');

        // 3. Celebration Check
        const isFirstLoad = (lastKnownScore.away === -1);
        const scoreChanged = (awayScore !== lastKnownScore.away || homeScore !== lastKnownScore.home);

        if (scoreChanged) {
            if (!isFirstLoad) {
                triggerCelebration(winner);
            }
            lastKnownScore = { away: awayScore, home: homeScore };
        }
    }
}

function triggerCelebration(element) {
    // Flash the header or the square
    document.body.classList.add('score-changed');
    setTimeout(() => document.body.classList.remove('score-changed'), 1000);
    
    // You could add a sound effect here: 
    // new Audio('assets/stadium-horn.mp3').play();
}

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
        console.log("DEBUG: Simulating score change...");
        // Randomly simulate a score for testing
        const testAway = Math.floor(Math.random() * 30);
        const testHome = Math.floor(Math.random() * 30);
        highlightWinner(testAway, testHome);
    }
});

// Kick off the app
init();