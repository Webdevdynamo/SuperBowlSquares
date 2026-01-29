const logoBase = "https://ff.spindleco.com/sbs/images/logos/";
let squareOwners = {}; 
let allParticipants = []; // Store participants from JSON globaly

// Get Match ID from URL
const urlParams = new URLSearchParams(window.location.search);
const currentMatchId = urlParams.get('id') || 'match_01';

let matchSettings = {};

async function init() {
    // 1. Fetch everything for this specific match via the proxy
    const response = await fetch(`api_proxy.php?id=${currentMatchId}`);
    const data = await response.json();

    matchSettings = data.matchInfo; 
    squareOwners = data.squares.grid;
    allParticipants = data.squares.participants;

    // Update Page Title and Cost Info
    document.querySelector('h1').innerText = matchSettings.title;
    
    // 2. Render Grid (Using existing createSquare logic)
    renderGrid(); 
    
    // 3. Initial Score Update
    updateUI(data.gameData);

    // 4. Start Polling
    setInterval(refreshMatchData, 60000);
}

async function refreshMatchData() {
    const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
    const data = await res.json();
    updateUI(data.gameData);
}

function createSquare(text, className, container) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    container.appendChild(div);
    return div;
}

let PAYOUTS = {}; 

async function updateScore() {
    try {
        const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
        const data = await res.json();
        
        // 1. Check if settings exist before trying to access the title
        if (data.settings && data.settings.title) {
            document.getElementById('match-title').innerText = data.settings.title;
            PAYOUTS = data.settings.payouts;
        }

        // 2. Map the rest of the data
        allParticipants = data.squares.participants;
        squareOwners = data.squares.grid;

        // ... continue with team and grid logic
    } catch (err) {
        console.error("Update failed:", err);
    }
}

function updatePayoutLeaderboard(winners) {
    const earnings = {};
    const keys = ['q1', 'q2', 'q3', 'final'];
    
    // Calculate who won which quarter
    winners.forEach((name, i) => {
        if (!name) return;
        earnings[name] = (earnings[name] || 0) + PAYOUTS[keys[i]];
    });

    // Generate the combined list
    const container = document.getElementById('payout-list');
    
    // Sort by earnings first, then by square count
    const sortedList = [...allParticipants].sort((a, b) => {
        const earnA = earnings[a.name] || 0;
        const earnB = earnings[b.name] || 0;
        return earnB - earnA || b.count - a.count;
    });

    container.innerHTML = sortedList.map(p => {
        const currentEarnings = earnings[p.name] || 0;
        const earningClass = currentEarnings > 0 ? 'has-earnings' : '';
        
        return `
            <div class="participant-row ${earningClass}">
                <div class="p-info">
                    <span class="p-name">${p.name}</span>
                    <span class="p-count">${p.count} Squares</span>
                </div>
                <div class="p-payout">
                    ${currentEarnings > 0 ? `$${currentEarnings}` : '--'}
                </div>
            </div>
        `;
    }).join('');
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 90%)`;
}

init();