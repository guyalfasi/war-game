const gameArea = {
    canvas: document.getElementById("canvas"),
    teamA: {teamName: 'A', troops: []},
    teamB: {teamName: 'B', troops: []},
    explosions: [],
    verticalPosA: 50,
    verticalPosB: 50,
    start: () => {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawSoldier: (soldier) => {
        const context = this.context;
        context.beginPath();
        context.arc(soldier.x, soldier.y, 20, 0, 2 * Math.PI);
        context.fillStyle = soldier.color;
        context.fill();
    },
    drawExplosion: (explosion) => {
        const context = this.context;
        context.beginPath();
        context.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
        context.fillStyle = 'red'; // its blood btw
        context.fill();
    }
};

const updateGameArea = () => {
    gameArea.clear();
    gameArea.teamA.troops.forEach(soldier => gameArea.drawSoldier(soldier));
    gameArea.teamB.troops.forEach(soldier => gameArea.drawSoldier(soldier));
    gameArea.explosions.forEach(explosion => {
        gameArea.drawExplosion(explosion);
        explosion.radius += 2; 
        if (explosion.radius > 30) {
            gameArea.explosions = gameArea.explosions.filter(e => e !== explosion);
        }
    });
};

const resetTeams = () => {
    gameArea.teamA.troops = [];
    gameArea.teamB.troops = [];
    gameArea.verticalPosA = gameArea.verticalPosB = 50;
    gameArea.teamA.teamName = 'A'
    gameArea.teamB.teamName = 'B'
}

const addSoldier = (name, team) => { // todo: add customization
    if((team === 'a' && gameArea.teamA.troops.length >= 5) || (team === 'b' && gameArea.teamB.troops.length >= 5)) {
        alert(`Max number of team members on team ${team} reached`);
        return;
    };
    switch (team) {
        case 'a':
            gameArea.teamA.troops.push({name: name, color: 'blue', x: 40, y: gameArea.verticalPosA});
            gameArea.verticalPosA += 50;
            break;
        case 'b':
            gameArea.teamB.troops.push({name: name, color: 'red', x: 440, y: gameArea.verticalPosB});
            gameArea.verticalPosB += 50;
            break;
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const startGame = () => gameArea.start();