/**
 * Represents the main game area and its properties, including the canvas element, team information, and image cache.
 * It provides methods to start the game loop, clear the canvas, draw soldiers and death effects, and load images into the cache.
 * 
 * @property {HTMLCanvasElement} canvas - The canvas element
 * @property {Object} teamA - Team A and its troops and team image 
 * @property {Object} teamB - Same as above except for team B
 * @property {Array} deathEffects - An array to store death effects to be drawn on the canvas
 * @property {Object} imageCache - A cache to store loaded team images
 * @property {number} verticalPosA - The vertical starting position for team A
 * @property {number} verticalPosB  - The vertical starting position for team B
 * @property {boolean} isAuto - Flag if the game is currently automatic or not
 */
const gameArea = {
    canvas: document.getElementById("canvas"),
    teamA: { teamName: 'A', troops: [], teamImg: '' },
    teamB: { teamName: 'B', troops: [], teamImg: '' },
    deathEffects: [],
    imageCache: {},
    verticalPosA: 50,
    verticalPosB: 50,
    isAuto: false,
    /**
     * Initializes the game area and sets up the animation frame loop
     */
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
    /**
     * Clears the game area
     */
    clear: () => {
        gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    },
    /**
     * Draws a soldier on the canvas. If soldier has no related team image, draw him as a red/blue circle based on the team
     * @param {object} soldier The soldier to draw
     */
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
        context.fillStyle = 'red';
        context.fill();
    },
    /**
     * Loads a image from the inputted URL and saves it on the cache for future use
     * @param {string} imageUrl URL of the image 
     */
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

/**
 * Updates the game canvas area for each object and effect displayed inside
 */
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

/**
 * Creates a new soldier object and adds him to a team defined in the parameter
 * @param {string} team The team to add the soldier on
 */
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

/**
 * Removes a soldier from a team defined in the parameter
 * @param {string} team 
 */
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

/**
 * Toggles automatic mode on the game
 */
const handleAutoToggle = () => {
    gameArea.isAuto = !gameArea.isAuto
    gameArea.isAuto ? $('#auto-status').html('Auto mode: ON') : $('#auto-status').html('Auto mode: OFF')
}

const startGame = () => gameArea.start();