<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFL Squares Live</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>🏈 Football Squares Live</h1>
            <div id="box-score-container">
                <div id="box-score">Connecting to MSN Sports...</div>
                <div id="game-status">--</div>
            </div>
        </header>

        <div class="main-layout">
            <aside class="sidebar">
                <h3>Participants</h3>
                <div id="participant-list">
                    </div>
            </aside>

            <section class="grid-section">
                <div class="axis-label top-label">AWAY TEAM (Last Digit)</div>
                <div class="grid-flex">
                    <div class="axis-label left-label">HOME TEAM</div>
                    <div id="squares-grid"></div>
                </div>
            </section>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>