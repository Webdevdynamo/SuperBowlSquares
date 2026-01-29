const gridElement = document.getElementById('squares-grid');
const scoreDisplay = document.getElementById('box-score');

// Add these constants to the top of script.js
const PAYOUTS = { q1: 25, q2: 25, q3: 25, final: 50 }; 

function updatePayoutLeaderboard(winners) {
    const playerWins = {};
    
    // winners is an array like ["Landon", "Amber", "Joe", "Landon"]
    winners.forEach((name, index) => {
        if (!name) return;
        const keys = ['q1', 'q2', 'q3', 'final'];
        const amount = PAYOUTS[keys[index]];
        playerWins[name] = (playerWins[name] || 0) + amount;
    });

    const container = document.getElementById('payout-list');
    container.innerHTML = Object.entries(playerWins)
        .sort((a, b) => b[1] - a[1])
        .map(([name, total]) => `
            <div class="payout-item">
                <span>${name}</span>
                <span class="payout-amount">$${total}</span>
            </div>
        `).join('');
}

// 1. Generate the Grid
async function init() {
    // Fetch local square ownership
    const response = await fetch('squares.json');
    const data = await response.json();
    const owners = data.grid; // e.g., {"0-7": "Alice"}
    
    renderParticipants(data.participants);
    
    // Create Header Row (Away Digits)
    createSquare('', 'label');
    for (let i = 0; i < 10; i++) createSquare(i, 'label');

    // Create Rows
    for (let h = 0; h < 10; h++) {
        createSquare(h, 'label'); // Side Label (Home Digit)
        for (let a = 0; a < 10; a++) {
            const ownerName = owners[`${a}-${h}`] || '';
            const sq = createSquare(ownerName, 'square');
            sq.id = `sq-${a}-${h}`; // sq-away-home
            if(ownerName) sq.style.backgroundColor = stringToColor(ownerName);
        }
    }

    // Start Polling
    updateScore();
    setInterval(updateScore, 60000);
}

function createSquare(text, className) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    gridElement.appendChild(div);
    return div;
}

// 2. Fetch Score from PHP Proxy
async function updateScore() {
    try {
        const res = await fetch('api_proxy.php');
        const data = await res.json();
        if (!data.teams || data.teams.length < 2) return;

        const away = data.teams.find(t => t.homeAway === "Away");
        const home = data.teams.find(t => t.homeAway === "Home");
        const logoBase = "https://ff.spindleco.com/sbs/images/logos/";

        // 1. Render Box Score Table
        const tbody = document.getElementById('box-score-body');
        const teams = [away, home];
        tbody.innerHTML = teams.map(t => `
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

        // 2. Identify Quarter Winners
        document.querySelectorAll('.square').forEach(s => {
            s.classList.remove('active-winner', 'past-winner');
            s.innerHTML = s.getAttribute('data-owner') || ''; // Reset text
        });

        // Loop through 4 quarters
        for (let i = 0; i < 4; i++) {
            const aDigit = away.quarters[i] % 10;
            const hDigit = home.quarters[i] % 10;
            const targetId = `sq-${aDigit}-${hDigit}`;
            const el = document.getElementById(targetId);

            if (el) {
                // If it's the latest quarter with a score, make it Active
                // Otherwise, mark as Past Winner
                const isCurrent = (i === 3) || (away.quarters[i+1] === away.quarters[i] && home.quarters[i+1] === home.quarters[i] && data.status !== "Final");
                
                el.classList.add(i === 3 ? 'active-winner' : 'past-winner');
                
                // Add a small badge for the quarter
                const badge = document.createElement('span');
                badge.className = 'q-badge';
                badge.innerText = `Q${i+1}`;
                el.appendChild(badge);
            }
        }

    } catch (err) { console.error(err); }
}

function renderParticipants(list) {
    const container = document.getElementById('participant-list');
    container.innerHTML = list.map(p => 
        `<div class="participant-item"><strong>${p.name}</strong>: ${p.count} squares</div>`
    ).join('');
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 90%)`;
}

init();