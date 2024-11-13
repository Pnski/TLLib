import { weather, eventSymbols } from "./events.js";

const startDateTime = new Date("2024-10-17T05:45:00"); // Starting point
const eventDuration = 7.5; // Event duration in minutes

// Generate events for a specific day
function generateEventsForDay(dayIndex) {
  const eventsForDay = [];
  const dayStart = new Date(startDateTime.getTime() + dayIndex * 24 * 60 * 60 * 1000); // Start of the day
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000); // End of the day
  let currentTime = new Date(dayStart);
  let lastEventName = null; // Track the last event name to filter duplicates

  while (currentTime < dayEnd) {
    const elapsedMinutes = Math.floor(
      (currentTime.getTime() - startDateTime.getTime()) / (eventDuration * 60 * 1000)
    );
    const eventIndex = elapsedMinutes % weather.length;
    const event = weather[eventIndex];

    if (event && event.name !== lastEventName) {
      eventsForDay.push({
        time: currentTime.toTimeString().slice(0, 5), // Format as HH:mm
        symbol: eventSymbols[event.name] || event.name,
      });
      lastEventName = event.name; // Update the last event name
    }

    currentTime = new Date(currentTime.getTime() + eventDuration * 60 * 1000); // Increment time
  }

  return eventsForDay;
}


// Render a single month's calendar
function renderMonthCalendar(daysInMonth, offset, monthName) {
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
  for (let i = 0; i < daysInMonth + offset; i++) {
    if (i < offset) {
      week.push("<td></td>"); // Empty cells for offset
    } else {
      const dayIndex = i - offset;
      const dayDate = new Date(
        startDateTime.getFullYear(),
        startDateTime.getMonth(),
        startDateTime.getDate() + dayIndex
      );
      const formattedDate = dayDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "."); // Format as DD.MM.YYYY

      const events = generateEventsForDay(dayIndex);
      const eventsHtml = events
        .map((event) => `${event.time}: ${event.symbol}`)
        .join("<br>");
      week.push(
        `<td style="vertical-align: top; padding: 5px;">
          <strong>${formattedDate}</strong><br>
          ${eventsHtml}
        </td>`
      );
    }

    if ((i + 1) % 7 === 0) {
      html += `<tr>${week.join("")}</tr>`;
      week = [];
    }
  }

  if (week.length > 0) {
    html += `<tr>${week.join("")}</tr>`;
  }

  html += "</tbody></table>";
  return html;
}


// Main function to render the event calendar
function renderEventCalendar() {
	const today = new Date();

	const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
	const currentMonthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
	const currentMonthOffset = (currentMonthStart.getDay() + 6) % 7;

	const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
	const nextMonthDays = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();
	const nextMonthOffset = (nextMonthStart.getDay() + 6) % 7;

	const currentMonthCalendar = renderMonthCalendar(currentMonthDays, currentMonthOffset, currentMonthStart.toLocaleString("default", { month: "long", year: "numeric" }));

	const nextMonthCalendar = renderMonthCalendar(nextMonthDays, nextMonthOffset, nextMonthStart.toLocaleString("default", { month: "long", year: "numeric" }));

	document.getElementById("event-calendar").innerHTML = `
    <div>${currentMonthCalendar}</div>
    <div style="margin-top: 20px;">${nextMonthCalendar}</div>
  `;
}

// Docsify hook
window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat((hook) => {
	hook.doneEach(() => {
		const container = document.getElementById("event-calendar");
		if (container) {
			container.innerHTML = "";
			renderEventCalendar();
		}
	});
});

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
