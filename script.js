const logoBase = "https://ff.spindleco.com/sbs/images/logos/";
const PAYOUTS = { q1: 25, q2: 25, q3: 25, final: 50 };
let squareOwners = {}; 

async function init() {
    try {
        const response = await fetch('squares.json');
        const data = await response.json();
        squareOwners = data.grid; 

        const gridElement = document.getElementById('squares-grid');
        gridElement.innerHTML = ''; 

        // 1. Create Top-Left Corner
        createSquare('', 'label', gridElement);

        // 2. Create Header Row (Away Digits)
        for (let i = 0; i < 10; i++) createSquare(i, 'label', gridElement);

        // 3. Create Grid Body (Home Label + 10 Squares per row)
        for (let h = 0; h < 10; h++) {
            createSquare(h, 'label', gridElement); 
            for (let a = 0; a < 10; a++) {
                const name = squareOwners[`${a}-${h}`] || '';
                const sq = createSquare(name, 'square', gridElement);
                sq.id = `sq-${a}-${h}`;
                sq.setAttribute('data-owner', name); 
                if (name) sq.style.backgroundColor = stringToColor(name);
            }
        }

        updateScore();
        setInterval(updateScore, 60000); // Update every minute
    } catch (err) {
        console.error("Initialization failed:", err);
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
        const res = await fetch('api_proxy.php');
        const data = await res.json();
        
        if (!data.teams || data.teams.length < 2) return;

        const away = data.teams.find(t => t.homeAway === "Away");
        const home = data.teams.find(t => t.homeAway === "Home");

        // RESTORE: Team Names and Logos on Grid Axis
        document.querySelector('.top-label').innerHTML = `
            <img src="${logoBase}${encodeURIComponent(away.fullName)} Logo.png" class="axis-logo">
            <div class="label-text">${away.fullName.toUpperCase()}</div>
        `;
        document.querySelector('.left-label').innerHTML = `
            <img src="${logoBase}${encodeURIComponent(home.fullName)} Logo.png" class="axis-logo">
            <div class="label-text"><span>${home.fullName.toUpperCase()}</span></div>
        `;

        // Update Box Score Table
        const tbody = document.getElementById('box-score-body');
        tbody.innerHTML = [away, home].map(t => `
            <tr>
                <td class="team-cell">
                    <img src="${logoBase}${encodeURIComponent(t.fullName)} Logo.png" class="tiny-logo"> 
                    ${t.shortName}
                </td>
                <td>${t.quarters[0]}</td><td>${t.quarters[1]}</td><td>${t.quarters[2]}</td><td>${t.quarters[3]}</td>
                <td class="final-col"><strong>${t.total}</strong></td>
            </tr>
        `).join('');

        // Reset all squares and restore owner names
        const winners = [];
        document.querySelectorAll('.square').forEach(s => {
            s.classList.remove('active-winner', 'past-winner');
            s.innerText = s.getAttribute('data-owner'); 
        });

        // Calculate Quarter Winners (0-3 for Q1-Q4)
        for (let i = 0; i < 4; i++) {
            const aDigit = away.quarters[i] % 10;
            const hDigit = home.quarters[i] % 10;
            const winnerName = squareOwners[`${aDigit}-${hDigit}`];
            winners.push(winnerName);

            const el = document.getElementById(`sq-${aDigit}-${hDigit}`);
            if (el) {
                // If the game is over or this is the final quarter, it's active gold.
                // Otherwise, mark as past blue.
                el.classList.add(i === 3 ? 'active-winner' : 'past-winner');
                
                const badge = document.createElement('span');
                badge.className = 'q-badge';
                badge.innerText = `Q${i+1}`;
                el.appendChild(badge);
            }
        }
        updatePayoutLeaderboard(winners);
    } catch (err) {
        console.error("Score update failed:", err);
    }
}

function updatePayoutLeaderboard(winners) {
    const playerWins = {};
    const keys = ['q1', 'q2', 'q3', 'final'];
    winners.forEach((name, i) => {
        if (!name) return;
        playerWins[name] = (playerWins[name] || 0) + PAYOUTS[keys[i]];
    });

    document.getElementById('payout-list').innerHTML = Object.entries(playerWins)
        .sort((a,b) => b[1] - a[1])
        .map(([name, total]) => `
            <div class="payout-item">
                <span>${name}</span>
                <span class="payout-amount">$${total}</span>
            </div>
        `).join('');
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 90%)`;
}

init();