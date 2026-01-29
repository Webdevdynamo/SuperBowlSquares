<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>NFL Squares Live</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <header class="main-header">
            <h1>🏈 Football Squares</h1>
            <div id="box-score-container">
                <div id="box-score">Connecting...</div>
                <div id="game-status">--</div>
            </div>
        </header>

        <div class="content-wrapper">
            <section class="grid-section">
                <div class="axis-label top-label">AWAY TEAM</div>
                <div class="scroll-container">
                    <div class="grid-flex">
                        <div class="axis-label left-label">HOME</div>
                        <div id="squares-grid"></div>
                    </div>
                </div>
                <p class="mobile-hint">← Swipe to view full grid →</p>
            </section>

            <aside class="sidebar">
                <h3>Participants</h3>
                <div id="participant-list"></div>
            </aside>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>