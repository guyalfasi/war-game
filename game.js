const gameArea = {
    canvas: document.getElementById("canvas"),
    statusText: document.getElementById("status-text"),
    teamA: {teamName: 'A', troops: []},
    teamB: {teamName: 'B', troops: []},
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

const moveTo = (soldier, targetX, targetY, speed) => new Promise(resolve => {
    const animateMove = () => {
        let dx = targetX - soldier.x;
        let dy = targetY - soldier.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance > speed) {
            soldier.x += dx / distance * speed;
            soldier.y += dy / distance * speed;
            requestAnimationFrame(animateMove); 
        } else {
            soldier.x = targetX;
            soldier.y = targetY;
            resolve();
        }
    };
    animateMove();
});

const updateGameArea = () => {
    gameArea.clear();
    gameArea.teamA.troops.forEach(soldier => gameArea.drawSoldier(soldier))
    gameArea.teamB.troops.forEach(soldier => gameArea.drawSoldier(soldier))
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

const startWar = async () => {
    if(!gameArea.teamA.troops.length && !gameArea.teamB.troops.length) {
        alert('Unable to start war; both teams are empty');
        return;
    }
    if(!gameArea.teamA.troops.length || !gameArea.teamB.troops.length) {
        alert('Unable to start war; one team is empty');
        return;
    }
    const savedTeams = {
        teamA: JSON.parse(JSON.stringify(gameArea.teamA.troops)),
        teamB: JSON.parse(JSON.stringify(gameArea.teamB.troops))
    };
    $(() => {
        $(".button-group button").prop('disabled', true);
    })
    gameArea.statusText.innerHTML = `Team ${gameArea.teamA.teamName} vs Team ${gameArea.teamB.teamName}`;
    await delay(2000);
    let teamWinner = await warLoop();
    gameArea.statusText.innerHTML = `Team ${teamWinner} won`;
    await delay(3000);
    gameArea.teamA.troops = savedTeams.teamA;
    gameArea.teamB.troops = savedTeams.teamB;
    gameArea.statusText.innerHTML = ``;
    $(() => {
        $(".button-group button").prop('disabled', false);
    })
}

const fight = (soldier1, soldier2) => Math.random() > 0.5 ? soldier1 : soldier2;

const warLoop = async () => {
    do {
        let fighterA = gameArea.teamA.troops[Math.floor(Math.random() * gameArea.teamA.troops.length)];
        let fighterB = gameArea.teamB.troops[Math.floor(Math.random() * gameArea.teamB.troops.length)];
        if(!fighterA || !fighterB) break;
        fighterAPos = [fighterA.x, fighterA.y]
        fighterBPos = [fighterB.x, fighterB.y]
        await moveTo(fighterA, 200, 150, 2);
        await moveTo(fighterB, 280, 150, 2);
        gameArea.statusText.innerHTML = `${fighterA.name} vs ${fighterB.name}`;
        await delay(1000);
        let winner = fight(fighterA, fighterB);
        switch (winner) {
            case fighterA:
                gameArea.teamB.troops = gameArea.teamB.troops.filter(soldier => soldier !== fighterB);
                await delay(1000);
                await moveTo(fighterA, fighterAPos[0], fighterAPos[1], 2)
                break;
            case fighterB:
                gameArea.teamA.troops = gameArea.teamA.troops.filter(soldier => soldier !== fighterA);
                await delay(1000);
                await moveTo(fighterB, fighterBPos[0], fighterBPos[1], 2)
                break;
            default:
                break;
        }
        gameArea.statusText.innerHTML = `${winner.name} won`;
        await delay(1000);
    } while (gameArea.teamA.troops.length && gameArea.teamB.troops.length);
    return gameArea.teamA.troops.length ? gameArea.teamA.teamName : gameArea.teamB.teamName;
}

const handleTeamFormSubmit = (teamId, teamNameProperty) => {
    const teamInput = document.getElementById(teamId + "-name");
    if (teamInput.value === '') {
        alert('This field cannot be empty.');
        return;
    }
    gameArea[teamNameProperty].teamName = teamInput.value;
    alert(`${teamId === 'team-a' ? 'Team A' : 'Team B'}'s name set to ${teamInput.value}`)
    teamInput.value = ''
}

const startGame = () => gameArea.start();