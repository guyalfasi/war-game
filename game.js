const gameArea = {
    canvas: document.getElementById("canvas"),
    statusText: document.getElementById("status-text"),
    teamA: [],
    teamB: [],
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
    }
};

const updateGameArea = () => {
    gameArea.clear();
    gameArea.teamA.forEach(soldier => gameArea.drawSoldier(soldier))
    gameArea.teamB.forEach(soldier => gameArea.drawSoldier(soldier))
};

const clearTeams = () => {
    gameArea.teamA = gameArea.teamB = [];
    gameArea.verticalPosA = gameArea.verticalPosB = 50;
}

const addSoldier = (name, team) => { // todo: add customization
    if((team === 'a' && gameArea.teamA.length >= 5) || (team === 'b' && gameArea.teamB.length >= 5)) {
        alert(`Max number of team members on team ${team} reached`);
        return;
    };
    switch (team) {
        case 'a':
            gameArea.teamA.push({name: name, color: 'blue', x: 40, y: gameArea.verticalPosA});
            gameArea.verticalPosA += 50;
            break;
        case 'b':
            gameArea.teamB.push({name: name, color: 'red', x: 440, y: gameArea.verticalPosB});
            gameArea.verticalPosB += 50;
            break;
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const startWar = async () => {
    if(!gameArea.teamA.length && !gameArea.teamB.length) {
        alert('Unable to start war; both teams are empty');
        return;
    }
    if(!gameArea.teamA.length || !gameArea.teamB.length) {
        alert('Unable to start war; one team is empty');
        return;
    }
    const savedTeams = { teamA: gameArea.teamA, teamB: gameArea.teamB }
    $(() => {
        $(".button-group button").prop('disabled', true);
    })
    let teamWinner = await warLoop();
    gameArea.statusText.innerHTML = `${teamWinner} won`;
    await delay(3000);
    gameArea.teamA = savedTeams.teamA;
    gameArea.teamB = savedTeams.teamB;
    gameArea.statusText.innerHTML = `War`;
    $(() => {
        $(".button-group button").prop('disabled', false);
    })
}

const fight = (soldier1, soldier2) => Math.random() > 0.5 ? soldier1 : soldier2;

const warLoop = async () => {
    do {
        let fighterA = gameArea.teamA[Math.floor(Math.random() * gameArea.teamA.length)];
        let fighterB = gameArea.teamB[Math.floor(Math.random() * gameArea.teamB.length)];
        if(!fighterA || !fighterB) break;
        gameArea.statusText.innerHTML = `${fighterA.name} vs ${fighterB.name}`;
        await delay(1000);
        let winner = fight(fighterA, fighterB);
        switch (winner) {
            case fighterA:
                gameArea.teamB = gameArea.teamB.filter(soldier => soldier !== fighterB);
                break;
            case fighterB:
                gameArea.teamA = gameArea.teamA.filter(soldier => soldier !== fighterA);
                break;
            default:
                break;
        }
        gameArea.statusText.innerHTML = `${winner.name} won`;
        await delay(1000);
    } while (gameArea.teamA.length && gameArea.teamB.length);

    return gameArea.teamA.length ? 'Team A' : 'Team B';
}


const startGame = () => gameArea.start();