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

document.getElementById("team-a-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("team-a", "teamA");
});

document.getElementById("team-b-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleTeamFormSubmit("team-b", "teamB");
});