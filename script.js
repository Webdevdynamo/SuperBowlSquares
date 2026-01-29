const gridElement = document.getElementById('squares-grid');
const scoreDisplay = document.getElementById('box-score');

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
        const game = await res.json();

        const away = game.teams.find(t => t.homeAway === "Away");
        const home = game.teams.find(t => t.homeAway === "Home");

        scoreDisplay.innerHTML = `${away.name} ${away.score} - ${home.score} ${home.name}`;
        
        // Highlight winning square
        document.querySelectorAll('.square').forEach(s => s.classList.remove('active-winner'));
        const winnerId = `sq-${away.lastDigit}-${home.lastDigit}`;
        const winnerSquare = document.getElementById(winnerId);
        if (winnerSquare) winnerSquare.classList.add('active-winner');

    } catch (err) {
        console.error("Score fetch failed", err);
    }
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