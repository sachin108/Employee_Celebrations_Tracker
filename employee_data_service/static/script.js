document.addEventListener('DOMContentLoaded', function() {
    // Fetch upcoming events data from the API endpoint
    fetch('http://localhost:8000/api/upcoming-events/30/')
      .then(response => response.json())
      .then(data => {
        // Extract upcoming birthdays and work anniversaries from the API response
        const upcomingBirthdays = data.upcoming_birthdays;
        const upcomingAnniversaries = data.upcoming_work_anniversaries;
  
        // Update the UI with the upcoming birthdays
        const birthdaysList = document.getElementById('birthdays-list');
        upcomingBirthdays.forEach(event => {
          const listItem = document.createElement('li');
          listItem.innerText = `${event.name} - ${event.birthdate}`;
          birthdaysList.appendChild(listItem);
        });
  
        // Update the UI with the upcoming work anniversaries
        const anniversariesList = document.getElementById('work-anniversaries-list');
        upcomingAnniversaries.forEach(event => {
          const listItem = document.createElement('li');
          listItem.innerText = `${event.name} - ${event.hire_date}`;
          anniversariesList.appendChild(listItem);
        });
      })
      .catch(error => console.log(error));
  });
  