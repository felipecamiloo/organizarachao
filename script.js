const attackers = [];
const setters = [];
let possibleNames = ["Brito", "Danilo", "Divinin", "Edivaldo", "Eduardo", "Felipe", "Fábio", "Jean", "Jv", "Marco", "Rogério", "Ronaldo", "Otávio", "Paula", "Ricardo", "Hugo", "Elena", "Tiago"];

function renderPossibleNames() {
  const nameList = document.getElementById('nameList');
  nameList.innerHTML = '';
  possibleNames.forEach(name => {
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.onclick = () => addPlayer(name);
    nameList.appendChild(nameSpan);
  });
}

function addPlayer(playerName = document.getElementById('playerName').value) {
  if (playerName && possibleNames.includes(playerName)) {
    attackers.push({ name: playerName, type: 'attacker' });
    possibleNames = possibleNames.filter(name => name !== playerName);
    updatePlayerList();
    renderPossibleNames();
    document.getElementById('playerName').value = '';
  }
}

function updatePlayerList() {
  const attackerList = document.getElementById('attackerList');
  const setterList = document.getElementById('setterList');
  attackerList.innerHTML = '';
  setterList.innerHTML = '';

  attackers.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${player.name}`;
    listItem.classList.add('attacker');
    listItem.onclick = () => moveToSetter(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = (event) => {
      event.stopPropagation();
      deletePlayer(index, 'attacker');
    };

    listItem.appendChild(deleteBtn);
    attackerList.appendChild(listItem);
  });

  setters.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${player.name}`;
    listItem.classList.add('setter');
    listItem.onclick = () => moveToAttacker(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = (event) => {
      event.stopPropagation();
      deletePlayer(index, 'setter');
    };

    listItem.appendChild(deleteBtn);
    setterList.appendChild(listItem);
  });
}

function moveToSetter(index) {
  const player = attackers.splice(index, 1)[0];
  player.type = 'setter';
  setters.push(player);
  updatePlayerList();
}

function moveToAttacker(index) {
  const player = setters.splice(index, 1)[0];
  player.type = 'attacker';
  attackers.push(player);
  updatePlayerList();
}

function deletePlayer(index, type) {
  let player;
  if (type === 'attacker') {
    player = attackers.splice(index, 1)[0];
  } else {
    player = setters.splice(index, 1)[0];
  }
  possibleNames.push(player.name);
  possibleNames.sort();
  updatePlayerList();
  renderPossibleNames();
}

function startGame() {
  const team1 = [];
  const team2 = [];

  if (setters.length >= 2 && attackers.length >= 6) {
    team1.push(setters.shift(), ...attackers.splice(0, 3));
    team2.push(setters.shift(), ...attackers.splice(0, 3));
  }

  displayTeams(team1, team2);
  updatePlayerList();
}

function displayTeams(team1, team2) {
  const teamsContainer = document.getElementById('teamsContainer');
  teamsContainer.innerHTML = '';

  const team1Div = document.createElement('div');
  team1Div.classList.add('team');
  const team1Title = document.createElement('h2');
  team1Title.textContent = 'Time 1';
  team1Div.appendChild(team1Title);
  const team1List = document.createElement('ul');
  team1.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${player.name}`;
    listItem.classList.add(player.type);
    team1List.appendChild(listItem);
  });
  team1Div.appendChild(team1List);

  const team1Buttons = document.createElement('div');
  team1Buttons.classList.add('win-buttons');
  const team1WinButton = document.createElement('button');
  team1WinButton.textContent = 'Venceu';
  team1WinButton.onclick = () => endGame('team2');
  team1Buttons.appendChild(team1WinButton);
  const team1TooWinButton = document.createElement('button');
  team1TooWinButton.textContent = 'Venceu Demais';
  team1TooWinButton.onclick = () => endGameToo('team1');
  team1Buttons.appendChild(team1TooWinButton);
  team1Div.appendChild(team1Buttons);

  const team2Div = document.createElement('div');
  team2Div.classList.add('team');
  const team2Title = document.createElement('h2');
  team2Title.textContent = 'Time 2';
  team2Div.appendChild(team2Title);
  const team2List = document.createElement('ul');
  team2.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${player.name}`;
    listItem.classList.add(player.type);
    team2List.appendChild(listItem);
  });
  team2Div.appendChild(team2List);

  const team2Buttons = document.createElement('div');
  team2Buttons.classList.add('win-buttons');
  const team2WinButton = document.createElement('button');
  team2WinButton.textContent = 'Venceu';
  team2WinButton.onclick = () => endGame('team1');
  team2Buttons.appendChild(team2WinButton);
  const team2TooWinButton = document.createElement('button');
  team2TooWinButton.textContent = 'Venceu Demais';
  team2TooWinButton.onclick = () => endGameToo('team2');
  team2Buttons.appendChild(team2TooWinButton);
  team2Div.appendChild(team2Buttons);

  teamsContainer.appendChild(team1Div);
  teamsContainer.appendChild(team2Div);
}

function endGame(losingTeam) {
  const teamsContainer = document.getElementById('teamsContainer');
  const teams = teamsContainer.getElementsByClassName('team');
  const team1 = [...teams[0].getElementsByTagName('li')];
  const team2 = [...teams[1].getElementsByTagName('li')];

  const losingPlayers = losingTeam === 'team1' ? team1 : team2;

  const losingPlayerNames = losingPlayers.map(player => player.textContent.split('. ')[1]);
  const winningTeamPlayers = losingTeam === 'team1' ? team2 : team1;

  // Remove players from display
  losingPlayers.forEach(player => player.remove());
  winningTeamPlayers.forEach(player => player.remove());

  // Add losing players back to lists
  losingPlayerNames.forEach(name => {
    const playerType = losingPlayers.find(player => player.textContent.split('. ')[1] === name).classList.contains('attacker') ? 'attacker' : 'setter';
    if (playerType === 'attacker') {
      attackers.push({ name: name, type: playerType });
    } else {
      setters.push({ name: name, type: playerType });
    }
  });

  const nextTeam = [];
  if (setters.length >= 2 && attackers.length >= 6) {
    nextTeam.push(setters.shift(), ...attackers.splice(0, 3));
    if (losingTeam === 'team1') {
      displayTeams(nextTeam, team2.map(player => ({
        name: player.textContent.split('. ')[1],
        type: player.classList.contains('attacker') ? 'attacker' : 'setter'
      })));
    } else {
      displayTeams(team1.map(player => ({
        name: player.textContent.split('. ')[1],
        type: player.classList.contains('attacker') ? 'attacker' : 'setter'
      })), nextTeam);
    }
  } else {
    teamsContainer.innerHTML = '<p>Não há jogadores suficientes para continuar a partida.</p>';
  }

  updatePlayerList();
}

function endGameToo(winningTeam) {
  const teamsContainer = document.getElementById('teamsContainer');
  const teams = teamsContainer.getElementsByClassName('team');
  const team1 = [...teams[0].getElementsByTagName('li')];
  const team2 = [...teams[1].getElementsByTagName('li')];

  const winningPlayers = winningTeam === 'team1' ? team1 : team2;
  const losingPlayers = winningTeam === 'team1' ? team2 : team1;

  const winningPlayerNames = winningPlayers.map(player => ({
    name: player.textContent.split('. ')[1],
    type: player.classList.contains('attacker') ? 'attacker' : 'setter'
  }));

  const losingPlayerNames = losingPlayers.map(player => ({
    name: player.textContent.split('. ')[1],
    type: player.classList.contains('attacker') ? 'attacker' : 'setter'
  }));

  // Remove players from display
  winningPlayers.forEach(player => player.remove());
  losingPlayers.forEach(player => player.remove());

  // Create new teams from available players
  const newTeam1 = [];
  const newTeam2 = [];

  if (setters.length >= 2 && attackers.length >= 6) {
    newTeam1.push(setters.shift(), ...attackers.splice(0, 3));
    newTeam2.push(setters.shift(), ...attackers.splice(0, 3));
  } else {
    teamsContainer.innerHTML = '<p>Não há jogadores suficientes para continuar a partida.</p>';
    return;
  }

  // Display new teams
  displayTeams(newTeam1, newTeam2);
  updatePlayerList();

  // Add back the players to the list with appropriate ordering
  const sortedWinningPlayers = [...winningPlayerNames];
  const sortedLosingPlayers = [...losingPlayerNames];

  sortedWinningPlayers.reverse().forEach(player => {
    if (player.type === 'attacker') {
      attackers.unshift(player); // Add winning players to the beginning of the list
    } else {
      setters.unshift(player); // Add winning players to the beginning of the list
    }
  });

  sortedLosingPlayers.forEach(player => {
    if (player.type === 'attacker') {
      attackers.push(player); // Add losing players to the end of the list
    } else {
      setters.push(player); // Add losing players to the end of the list
    }
  });

  updatePlayerList();
}

// Initialize possible names on page load
renderPossibleNames();
