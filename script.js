// Get DOM elements
const form = document.getElementById('checkInForm');
const attendeeCount = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const greeting = document.getElementById('greeting');

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
  greeting.textContent = '🎉 Congratulations! We\'ve reached our attendance goal! Thank you all for participating!';
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
    greeting.textContent = `Welcome ${name} to ${teamNames[team]}! Thank you for joining us.`;
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

  // Reset form
  form.reset();
});
