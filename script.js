const urlParams = new URLSearchParams(window.location.search);
const currentMatchId = urlParams.get('id') || 'match_01';
const logoBase = "https://ff.spindleco.com/sbs/images/logos/";

let PAYOUTS = {}; 
let squareOwners = {};
let allParticipants = [];

async function init() {
    // Initial fetch to set up the grid
    await updateScore(); 
    
    // Set up the grid once we have the square owners
    renderStaticGrid();

    // Start Polling for live score updates
    setInterval(updateScore, 60000);
}

function renderStaticGrid() {
    const gridElement = document.getElementById('squares-grid');
    if (!gridElement) return;
    gridElement.innerHTML = ''; 

    // 1. Create the Top Header Row within the grid (Digits 0-9)
    // We add one empty spacer first to align with the vertical labels
    createSquare('', 'label', gridElement); 
    for (let i = 0; i < 10; i++) createSquare(i, 'label', gridElement);

    // 2. Create the Grid Rows
    for (let h = 0; h < 10; h++) {
        // This is the digit label (0-9) that sits inside the scroll area
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

function createSquare(text, className, container) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    container.appendChild(div);
    return div;
}

async function updateScore() {
    try {
        const res = await fetch(`api_proxy.php?id=${currentMatchId}`);
        const data = await res.json();
        
        if (data.error) return;

        // Immediately update global data
        PAYOUTS = data.settings.payouts;
        squareOwners = data.squares.grid;
        allParticipants = data.squares.participants;

        const away = data.teams.find(t => t.homeAway === "Away");
        const home = data.teams.find(t => t.homeAway === "Home");

        // UI Updates wrapped in requestAnimationFrame for "Real-Time" feel
        window.requestAnimationFrame(() => {
            renderHeaderAndTable(data, away, home);
            renderWinnerMarkers(away, home);
            updatePayoutLeaderboard(calculateWinners(away, home));
        });

    } catch (err) {
        console.error("Update failed", err);
    }
}

function renderWinnerMarkers(away, home) {
    // 1. Clean slate for all squares
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(s => {
        s.classList.remove('active-winner', 'past-winner');
        // Remove existing badges to prevent duplicates
        const oldBadge = s.querySelector('.q-badge');
        if (oldBadge) oldBadge.remove();
    });

    // 2. Apply markers for all 4 quarters
    for (let i = 0; i < 4; i++) {
        const aDigit = away.quarters[i] % 10;
        const hDigit = home.quarters[i] % 10;
        const el = document.getElementById(`sq-${aDigit}-${hDigit}`);

        if (el) {
            const isCurrent = (i === 3); // Q4/Final is active
            el.classList.add(isCurrent ? 'active-winner' : 'past-winner');
            
            const badge = document.createElement('span');
            badge.className = 'q-badge';
            badge.innerText = `Q${i+1}`;
            el.appendChild(badge);
        }
    }
}

function updatePayoutLeaderboard(winners) {
    const earnings = {};
    const keys = ['q1', 'q2', 'q3', 'final'];
    winners.forEach((name, i) => {
        if (!name) return;
        earnings[name] = (earnings[name] || 0) + PAYOUTS[keys[i]];
    });

    const container = document.getElementById('payout-list');
    if (!container) return;

    const sortedList = [...allParticipants].sort((a, b) => (earnings[b.name] || 0) - (earnings[a.name] || 0));

    container.innerHTML = sortedList.map(p => {
        const currentEarnings = earnings[p.name] || 0;
        return `
            <div class="participant-row ${currentEarnings > 0 ? 'has-earnings' : ''}">
                <div class="p-info">
                    <span class="p-name">${p.name}</span>
                    <span class="p-count">${p.count} Squares</span>
                </div>
                <div class="p-payout">${currentEarnings > 0 ? `$${currentEarnings}` : '--'}</div>
            </div>`;
    }).join('');
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 90%)`;
}

init();