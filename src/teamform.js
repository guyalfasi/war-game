const handleTeamFormSubmit = (teamId, teamNameProperty) => {
    const teamInput = document.getElementById(teamId + "-name");
    if (teamInput.value === '') {
        alert('This field cannot be empty.');
        return;
    }
    gameArea[teamNameProperty].teamName = teamInput.value;
    gameArea[teamNameProperty].troops.forEach((s, index) => {
        s.name = `${teamInput.value}${index + 1}`
    })
    alert(`${teamId === 'team-a' ? 'Team A' : 'Team B'}'s name set to ${teamInput.value}`)
    teamInput.value = ''
}

document.getElementById("team-a-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("team-a", "teamA");
});

document.getElementById("team-b-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("team-b", "teamB");
});

const setTeamImage = (event, team) => {
    let reader = new FileReader();
    reader.onload = () => {
        switch (team) {
            case 'a':
                console.log("set image to team a");
                gameArea.teamA.teamImg = reader.result;
                gameArea.teamA.troops.forEach(s => s.troopImg = reader.result);
                break;
            case 'b':
                console.log("set image to team b");
                gameArea.teamB.teamImg = reader.result;
                gameArea.teamB.troops.forEach(s => s.troopImg = reader.result);
                break;
            default:
                break;
        }
    };

    if (!event.target.files[0].type.match('image/*')) {
        alert("Please select an image file.");
        return;
    }

    reader.readAsDataURL(event.target.files[0]);
};
