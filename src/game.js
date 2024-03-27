const gameArea = {
    canvas: document.getElementById("canvas"),
    teamA: { teamName: 'A', troops: [], teamImg: '' },
    teamB: { teamName: 'B', troops: [], teamImg: '' },
    deathEffects: [],
    imageCache: {},
    verticalPosA: 50,
    verticalPosB: 50,
    isAuto: false,
    start: () => {
        gameArea.context = gameArea.canvas.getContext("2d");
        gameArea.lastFrameTime = Date.now();
        const animate = () => {
            const now = Date.now();
            const elapsed = now - gameArea.lastFrameTime;
            if (elapsed > 20) { // simulate the interval of 20ms
                gameArea.lastFrameTime = now - (elapsed % 20);
                updateGameArea();
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    },
    clear: () => {
        gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    },
    drawSoldier: (soldier) => {
        const context = gameArea.context;
        if (soldier.troopImg) {
            if (!gameArea.imageCache[soldier.troopImg]) {
                gameArea.loadImage(soldier.troopImg);
            }
            const img = gameArea.imageCache[soldier.troopImg];
            if (img) {
                context.drawImage(img, soldier.x - 20, soldier.y - 20, 40, 40);
            }
        } else {
            context.beginPath();
            context.arc(soldier.x, soldier.y, 20, 0, 2 * Math.PI);
            context.fillStyle = soldier.color;
            context.fill();
        }
    },
    drawDeath: (deathEffect) => {
        const context = gameArea.context;
        context.beginPath();
        context.arc(deathEffect.x, deathEffect.y, deathEffect.radius, 0, 2 * Math.PI);
        context.fillStyle = 'red'; // its blood btw
        context.fill();
    },
    loadImage: (imageUrl) => {
        if (gameArea.imageCache[imageUrl]) {
            return;
        }
        
        let img = new Image();
        img.onload = () => {
            gameArea.imageCache[imageUrl] = img;
        };
        img.src = imageUrl;
    }
};

const updateGameArea = () => {
    gameArea.clear();
    gameArea.teamA.troops.forEach(soldier => gameArea.drawSoldier(soldier));
    gameArea.teamB.troops.forEach(soldier => gameArea.drawSoldier(soldier));
    gameArea.deathEffects.forEach(deathEffect => {
        gameArea.drawDeath(deathEffect);
        deathEffect.radius += 2;
        if (deathEffect.radius > 30) {
            gameArea.deathEffects = gameArea.deathEffects.filter(e => e !== deathEffect);
        }
    });
};


const addSoldier = (team) => {
    if ((team === 'a' && gameArea.teamA.troops.length >= 5) || (team === 'b' && gameArea.teamB.troops.length >= 5)) {
        alert(`Max number of team members on team ${team} reached`);
        return;
    };
    switch (team) {
        case 'a':
            gameArea.teamA.troops.push({ name: `${gameArea.teamA.teamName}${gameArea.teamA.troops.length + 1}`, color: 'blue', x: 40, y: gameArea.verticalPosA, troopImg: gameArea.teamA.teamImg });
            gameArea.verticalPosA += 50;
            break;
        case 'b':
            gameArea.teamB.troops.push({ name: `${gameArea.teamB.teamName}${gameArea.teamB.troops.length + 1}`, color: 'red', x: 440, y: gameArea.verticalPosB, troopImg: gameArea.teamB.teamImg });
            gameArea.verticalPosB += 50;
            break;
    }
};

const removeSoldier = (team) => {
    if ((team === 'a' && !gameArea.teamA.troops.length) || (team === 'b' && !gameArea.teamB.troops.length)) {
        alert(`Cannot remove from team ${team}, it has no soldiers`);
        return;
    }
    switch (team) {
        case 'a':
            gameArea.teamA.troops.pop()
            gameArea.verticalPosA -= 50;
            break;
        case 'b':
            gameArea.teamB.troops.pop()
            gameArea.verticalPosB -= 50;
            break;
        default:
            break;
    }
}

const handleAutoToggle = () => {
    gameArea.isAuto = !gameArea.isAuto
    gameArea.isAuto ? $('#gambling-status').html('Auto mode: ON') : $('#gambling-status').html('Auto mode: OFF')
}

const startGame = () => gameArea.start();