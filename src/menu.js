const handleTeamFormSubmit = (team) => {
    const teamInput = document.getElementById(`${team === 'teamA' ? 'team-a' : 'team-b'}-name`);
    if (teamInput.value === '') {
        alert('This field cannot be empty.');
        return;
    }
    gameArea[team].teamName = teamInput.value;
    gameArea[team].troops.forEach((s, index) => {
        s.name = `${teamInput.value}${index + 1}`
    })
    alert(`${team === 'teamA' ? 'Team A' : 'Team B'}'s name set to ${teamInput.value}`)
    teamInput.value = ''
}

document.getElementById("team-a-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("teamA");
});

document.getElementById("team-b-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("teamB");
});

const setTeamImage = (event, team) => {
    let reader = new FileReader();
    reader.onload = () => {
        gameArea[`team${team.toUpperCase()}`].teamImg = reader.result;
        gameArea[`team${team.toUpperCase()}`].troops.forEach(s => s.troopImg = reader.result);
    };

    if (!event.target.files[0].type.match('image/*')) {
        alert("Please select an image file.");
        return;
    }

    reader.readAsDataURL(event.target.files[0]);
};

const resetGame = () => {
    gameArea.teamA.troops = [];
    gameArea.teamB.troops = [];
    gameArea.verticalPosA = gameArea.verticalPosB = 50;
    gameArea.teamA.teamName = 'A'
    gameArea.teamB.teamName = 'B'
    gameArea.teamA.teamImg = ''
    gameArea.teamB.teamImg = ''
    document.getElementById('img-input-team-a').value = ''
    document.getElementById('img-input-team-b').value = ''
}

const clearImage = (team) => {
    document.getElementById(`img-input-team-${team}`).value = ''
    gameArea[`team${team.toUpperCase()}`].teamImg = ''
    gameArea[`team${team.toUpperCase()}`].troops.forEach((soldier) => soldier.troopImg = '')
}

const toggleMenuButtons = (bool) => {
    $(".menu-button-group button").prop('disabled', bool);
    $(".team-sections button").prop('disabled', bool);
    $(".team-sections input").prop('disabled', bool)
}