import { weather, eventSymbols } from './events.js'

const startDateTime = new Date("2024-11-01T00:00:00"); //starting point
const eventDuration = 7.5; //Event duration in minutes

// Generate events for a specific day
function generateEventsForDay(dayIndex) {
  const eventsForDay = [];
  const dayStart = new Date(startDateTime.getTime() + dayIndex * 24 * 60 * 60 * 1000); // Start of the day
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000); // End of the day
  let currentTime = new Date(dayStart);

  while (currentTime < dayEnd) {
    const elapsedMinutes = (currentTime.getTime() - startDateTime.getTime()) / (eventDuration * 60 * 1000);
    const eventIndex = Math.floor(elapsedMinutes) % events.length;
    const event = events[eventIndex];

    if (!event) break; // Safeguard against unexpected issues

    eventsForDay.push({
      time: currentTime.toTimeString().slice(0, 5), // Format as HH:mm
      symbol: eventSymbols[event.name] || event.name,
    });

    currentTime = new Date(currentTime.getTime() + eventDuration * 60 * 1000); // Increment time
  }

  return eventsForDay;
}

// Render schedule as HTML
function renderSchedule(schedule, monthName) {
  let html = `<table id="schedule-table" border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
    <thead>
      <tr>
        <th colspan="7" style="text-align: center;">${monthName}</th>
      </tr>
      <tr>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
        <th>Sun</th>
      </tr>
    </thead>
    <tbody>`;

  let week = [];
  schedule.forEach((day, index) => {
    if (day) {
      const eventsHtml = day
        .map(event => `${event.time}: ${event.symbol}`)
        .join("<br>");
      week.push(
        `<td style="vertical-align: top; padding: 5px;">${eventsHtml}</td>`
      );
    } else {
      week.push('<td style="vertical-align: top;"></td>');
    }

    if ((index + 1) % 7 === 0) {
      html += `<tr>${week.join("")}</tr>`;
      week = [];
    }
  });

  if (week.length > 0) {
    html += `<tr>${week.join("")}</tr>`;
  }

  html += "</tbody></table>";
  document.body.innerHTML += html;
}

// Generate the schedule for the current and next month
function generateSchedules() {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysInNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();

  // Generate schedule for the current month
  const currentMonthSchedule = [];
  for (let i = 0; i < daysInCurrentMonth; i++) {
    currentMonthSchedule.push(generateEventsForDay(i));
  }

  // Generate schedule for the next month
  const nextMonthSchedule = [];
  for (let i = daysInCurrentMonth; i < daysInCurrentMonth + daysInNextMonth; i++) {
    nextMonthSchedule.push(generateEventsForDay(i - daysInCurrentMonth));
  }

  // Render schedules
  renderSchedule(currentMonthSchedule, firstDayOfCurrentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
  renderSchedule(nextMonthSchedule, new Date(today.getFullYear(), today.getMonth() + 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' }));
}

// Docsify hook to regenerate calendar after rendering
window.$docsify = {
  doneEach: function () {
    document.body.innerHTML = ""; // Clear previous content
    generateSchedules();
  },
};


/* (function () {
  const events = [
    { name: "EWeatherType::Rain" },
    { name: "EWeatherType::Rain" },
    { name: "EWeatherType::Normal" },
    { name: "EWeatherType::Normal" },
    { name: "EWeatherType::Normal" },
    { name: "EWeatherType::Rain" },
    // Add more events here
  ];

  const eventDurationMinutes = 7.5; // Duration of each event
  const eventsPerDay = Math.floor((24 * 60) / eventDurationMinutes); // Number of events in a day

  // Map event names to symbols
  const eventSymbols = {
    "EWeatherType::Rain": `<span class="material-symbols-outlined">rainy</span>`,
    "EWeatherType::Normal": `<span class="material-symbols-outlined">wb_sunny</span>`,
  };

  function generateCalendars() {
    const container = document.getElementById("event-calendar");
    if (!container) return;

    // Get current and next month details
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const nextMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;

    // Render calendars for current and next month
    const currentMonthCalendar = generateCalendar(currentYear, currentMonth, "Current Month");
    const nextMonthCalendar = generateCalendar(nextMonthYear, nextMonth, "Next Month");

    container.innerHTML = `
      <div>${currentMonthCalendar}</div>
      <div style="margin-top: 20px;">${nextMonthCalendar}</div>`;
  }

  function generateCalendar(year, month, title) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Shift to Monday start

    const monthData = [];
    let eventIndex = 0;

    // Fill empty days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      monthData.push(null);
    }

    // Fill actual days with events
    for (let day = 1; day <= daysInMonth; day++) {
      monthData.push({ date: day, events: getEventsForDay(eventIndex) });
      eventIndex = (eventIndex + eventsPerDay) % events.length; // Cycle through events
    }

    // Fill empty days after the last day
    while (monthData.length % 7 !== 0) {
      monthData.push(null);
    }

    // Generate table for the calendar
    let html = `<table id="schedule-table" border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead>
    <tr>
      <th>Mon</th>
      <th>Tue</th>
      <th>Wed</th>
      <th>Thu</th>
      <th>Fri</th>
      <th>Sat</th>
      <th>Sun</th>
    </tr>
  </thead>
  <tbody>`;
  
let week = [];
monthData.forEach((day, index) => {
  if (day) {
    const eventsHtml = day.events
      .map(event => `${event.startTime}: ${eventSymbols[event.name] || "Unknown Event"}`)
      .join("<br>");
      
    week.push(
      `<td style="vertical-align: top; padding: 5px;">
        ${day.date}<br>${eventsHtml}
      </td>`
    );
  } else {
    week.push('<td style="vertical-align: top;"></td>');
  }

  if ((index + 1) % 7 === 0) {
    html += `<tr>${week.join("")}</tr>`;
    week = [];
  }
});

html += "</tbody></table>";
    return html;
  }

  function getEventsForDay(startIndex) {
    const dayEvents = [];
    let lastEventName = null;

    for (let i = 0; i < eventsPerDay; i++) {
      const eventIndex = (startIndex + i) % events.length;
      const event = events[eventIndex];
      const startTime = formatTime(i * eventDurationMinutes);

      if (event.name !== lastEventName) {
        dayEvents.push({ name: event.name, startTime });
        lastEventName = event.name;
      }
    }

    return dayEvents;
  }

  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  // Hook into Docsify to generate calendars
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat((hook) => {
    hook.doneEach(() => {
      generateCalendars();
    });
  });
})();
 */