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

    toggleMenuButtons(true);
    $("#status-text").html(`Team ${gameArea.teamA.teamName} vs Team ${gameArea.teamB.teamName}`)
    await delay(2000);
    
    let teamWinner = await warLoop();
    $("#status-text").html(`Team ${teamWinner} won`)
    await delay(3000);
    
    gameArea.teamA.troops = savedTeams.teamA;
    gameArea.teamB.troops = savedTeams.teamB;
    $("#status-text").html("")
    toggleMenuButtons(false);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fight = (soldier1, soldier2) => Math.random() > 0.5 ? soldier1 : soldier2;

const handleDuel = (fighterA, fighterB) => new Promise(resolve => {
    let inputTimeout;
    const handleKeyPress = (event) => {
        clearTimeout(inputTimeout);
        switch (event.key.toUpperCase()) {
            case 'A':
                resolve(fighterA);
                break;
            case 'L':
                resolve(fighterB);
                break;
            default:
                break;
        }
        document.removeEventListener('keydown', handleKeyPress);
    };
    document.addEventListener('keydown', handleKeyPress);

    inputTimeout = setTimeout(() => {
        document.removeEventListener('keydown', handleKeyPress);
        resolve(null); 
    }, 2000); 
});

const warLoop = async () => {
    do {
        let fighterA = gameArea.teamA.troops[Math.floor(Math.random() * gameArea.teamA.troops.length)];
        let fighterB = gameArea.teamB.troops[Math.floor(Math.random() * gameArea.teamB.troops.length)];

        if(!fighterA || !fighterB) break;
        
        fighterAPos = [fighterA.x, fighterA.y]
        fighterBPos = [fighterB.x, fighterB.y]
        
        await moveTo(fighterA, 200, 150, 2);
        await moveTo(fighterB, 280, 150, 2);
        
        $("#status-text").html(`${fighterA.name} vs ${fighterB.name}`)
        let winner;
        await delay(1000);

        while (!winner) {
            if (gameArea.isAuto) {
                winner = fight(fighterA, fighterB);
                $("#status-text").html(`${winner.name} won`);
            } else {
                let earlyPressDetected = false;
                $("#status-text").html(`Wait... Team ${gameArea.teamA.teamName}: Press A, Team ${gameArea.teamB.teamName}: Press L`);
                
                const handleEarlyPress = async (event) => {
                    if (['A', 'L'].includes(event.key.toUpperCase())) {
                        earlyPressDetected = true;
                        $("#status-text").html(`Pressed too early, restarting duel`);
                        await delay(2000);
                        document.removeEventListener('keydown', handleEarlyPress);
                    }
                }
                
                document.addEventListener("keydown", handleEarlyPress);
                
                await delay(Math.floor(Math.random() * 15 * 1000 + 5)); // fix: early press handler takes longer than excepted to respond due to this

                if (earlyPressDetected) {
                    continue;
                }

                document.removeEventListener('keydown', handleEarlyPress);
                
                $("#status-text").html("Draw!");
                winner = await handleDuel(fighterA, fighterB);

                if (!winner) {
                    $("#status-text").html("Tie, no one pressed the button. Restarting duel");
                    await delay(2000);
                    continue;
                }
                $("#status-text").html(`${winner.name} won`);
            }
        }


        switch (winner) {
            case fighterA:
                gameArea.deathEffects.push({
                    x: fighterB.x,
                    y: fighterB.y,
                    radius: 8
                });
                gameArea.teamB.troops = gameArea.teamB.troops.filter(soldier => soldier !== fighterB);
                await delay(1000);
                await moveTo(fighterA, fighterAPos[0], fighterAPos[1], 2)
                break;
            case fighterB:
                gameArea.deathEffects.push({
                    x: fighterA.x,
                    y: fighterA.y,
                    radius: 8
                });
                gameArea.teamA.troops = gameArea.teamA.troops.filter(soldier => soldier !== fighterA);
                await delay(1000);
                await moveTo(fighterB, fighterBPos[0], fighterBPos[1], 2)
                break;
            default:
                break;
        }
    } while (gameArea.teamA.troops.length && gameArea.teamB.troops.length);
    return gameArea.teamA.troops.length ? gameArea.teamA.teamName : gameArea.teamB.teamName;
}

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
