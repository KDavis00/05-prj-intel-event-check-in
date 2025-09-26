// Get DOM elements
const form = document.getElementById('checkInForm');
const attendeeCount = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const greeting = document.getElementById('greeting');
const attendeeList = document.getElementById('attendeeList');

// Initialize variables
const maxAttendees = 50;
let currentAttendees = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0
};

// Track attendees and their teams
let attendeeRegistry = {};

// Load data from local storage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('eventData');
  if (savedData) {
    const data = JSON.parse(savedData);
    currentAttendees = data.currentAttendees;
    teamCounts = data.teamCounts;
    attendeeRegistry = data.attendeeRegistry;
    
    // Update UI with saved data
    updateProgress();
    updateTeamStats();
    updateAttendeeList();
  }
}

// Save data to local storage
function saveToLocalStorage() {
  const data = {
    currentAttendees,
    teamCounts,
    attendeeRegistry
  };
  localStorage.setItem('eventData', JSON.stringify(data));
}

// Function to update attendee list
function updateAttendeeList() {
  attendeeList.innerHTML = '';
  Object.entries(attendeeRegistry).forEach(([name, team]) => {
    const attendeeCard = document.createElement('div');
    attendeeCard.className = 'attendee-card';
    attendeeCard.innerHTML = `
      <span class="attendee-name">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
      <span class="attendee-team">${teamNames[team]}</span>
    `;
    attendeeList.appendChild(attendeeCard);
  });
}

// Team name mapping for friendly display
const teamNames = {
  water: 'Team Water Wise',
  zero: 'Team Net Zero',
  power: 'Team Renewables'
};

// Function to update progress bar
function updateProgress() {
  const progress = (currentAttendees / maxAttendees) * 100;
  progressBar.style.width = `${progress}%`;
  attendeeCount.textContent = currentAttendees;
}

// Function to update team statistics
function updateTeamStats(team) {
  teamCounts[team]++;
  const teamCount = document.getElementById(`${team}Count`);
  teamCount.textContent = teamCounts[team];
  
  // Find team with most attendees
  const maxTeamCount = Math.max(...Object.values(teamCounts));
  
  // Reset all team cards to default style
  document.querySelectorAll('.team-card').forEach(card => {
    card.style.border = 'none';
  });
  
  // Highlight teams with highest count
  Object.entries(teamCounts).forEach(([teamName, count]) => {
    if (count === maxTeamCount && count > 0) {
      const teamCard = document.querySelector(`.team-card.${teamName}`);
      teamCard.style.border = '2px solid #0071c5';
    }
  });
}

// Function to show celebration message
function showCelebration() {
  // Find winning team(s)
  const maxCount = Math.max(...Object.values(teamCounts));
  const winningTeams = Object.entries(teamCounts)
    .filter(([_, count]) => count === maxCount)
    .map(([team, _]) => teamNames[team]);
  
  const winningTeamMessage = winningTeams.length === 1 
    ? `${winningTeams[0]} wins with ${maxCount} attendees!` 
    : `It's a tie between ${winningTeams.join(' and ')} with ${maxCount} attendees each!`;
  
  greeting.textContent = `🎉 Congratulations! We've reached our attendance goal! ${winningTeamMessage}`;
  greeting.style.display = 'block';
  greeting.className = 'success-message';
  
  document.querySelectorAll('.team-card').forEach(card => {
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.3s ease';
  });
}

// Handle form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form values
  const nameInput = document.getElementById('attendeeName');
  const teamSelect = document.getElementById('teamSelect');
  const name = nameInput.value.trim().toLowerCase(); // Normalize name for comparison
  const team = teamSelect.value;

  // Check if attendee already exists
  if (attendeeRegistry[name]) {
    // If trying to check in to a different team
    if (attendeeRegistry[name] !== team) {
      // Update team counts
      teamCounts[attendeeRegistry[name]]--;
      teamCounts[team]++;
      
      // Update team displays
      document.getElementById(`${attendeeRegistry[name]}Count`).textContent = teamCounts[attendeeRegistry[name]];
      document.getElementById(`${team}Count`).textContent = teamCounts[team];
      
      // Show team switch message
      greeting.textContent = `${name.charAt(0).toUpperCase() + name.slice(1)}, you have been switched from ${teamNames[attendeeRegistry[name]]} to ${teamNames[team]}.`;
      greeting.style.display = 'block';
      greeting.className = 'success-message';
      
      // Update registry
      attendeeRegistry[name] = team;
    } else {
      // Same team check-in attempt
      greeting.textContent = `${name.charAt(0).toUpperCase() + name.slice(1)}, you are already checked in to ${teamNames[team]}.`;
      greeting.style.display = 'block';
      greeting.className = 'success-message';
    }
    
    form.reset();
    return;
  }

  // Register new attendee
  attendeeRegistry[name] = team;
  
  // Update attendee count
  currentAttendees++;
  
  // Show personalized greeting
  if (currentAttendees < maxAttendees) {
    greeting.textContent = `Welcome ${name} from ${teamNames[team]}! Thank you for joining us.`;
    greeting.style.display = 'block';
    greeting.className = 'success-message';
  }

  // Update progress and team stats
  updateProgress();
  updateTeamStats(team);

  // Check if we've reached the attendance goal
  if (currentAttendees === maxAttendees) {
    showCelebration();
  }

  // Update attendee list
  updateAttendeeList();
  
  // Save data to local storage
  saveToLocalStorage();
  
  // Reset form
  form.reset();
});

// Load saved data when page loads
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
