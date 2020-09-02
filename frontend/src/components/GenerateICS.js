import moment from 'moment';
import { toast } from 'react-toastify';
import { toSeasonString } from '../utilities';
const FileSaver = require('file-saver');
const ics = require('ics');

// Is this day during a break?
const onBreak = (day) => {
  // Fall 2020 Breaks
  const breaks = [[moment('2020-11-21T00:01'), moment('2020-11-30T08:19')]];

  for (let i = 0; i < breaks.length; i++) {
    if (day >= breaks[i][0] && day <= breaks[i][1]) return true;
  }
  return false;
};

// generate ICS file and download it
export const generateICS = (listings_all) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  // Season to export
  const cur_season = '202003';

  // Fall 2020 period
  const period = [moment('2020-08-31T08:20'), moment('2020-12-04T17:30')];

  // Only get courses for the current season that have valid times
  let listings = [];
  listings_all.forEach((listing) => {
    if (
      !listing['course.times_summary'] ||
      listing['course.times_summary'] === 'TBA'
    )
      return;
    if (listing.season_code === cur_season) listings.push(listing);
  });

  // Convert season code to season string
  const season_string = toSeasonString(cur_season);
  if (!listings.length) {
    toast.error(
      `Worksheet for ${season_string[2]}, ${season_string[1]} is empty`
    );
    return;
  }

  // List of events to export to ICS
  let events = [];
  // Iterate through each day in the current day
  for (let day = period[0]; day <= period[1]; day.add(1, 'day')) {
    // Skip weekends and breaks
    if (day.day() === 6 || day.day() === 0) continue;
    if (onBreak(day)) continue;
    // Get current day of the week in string form
    const weekday = weekdays[day.day() - 1];
    // Iterate through listings in the worksheet
    for (const listing of listings) {
      const info = listing['course.times_by_day.' + weekday];
      // Continue if the course doesn't take place on this day of the week
      if (info === undefined) continue;
      // Get start and end times of the listing
      let start = moment(info[0][0], 'HH:mm')
        .dayOfYear(day.dayOfYear())
        .year(day.year());
      let end = moment(info[0][1], 'HH:mm')
        .dayOfYear(day.dayOfYear())
        .year(day.year());
      // Correct hour
      if (start.hour() < 8) start.add(12, 'h');
      if (end.hour() < 8) end.add(12, 'h');
      // Calculate duration
      const duration = end.diff(start, 'minutes');
      // Add listing to evenets list
      events.push({
        title: listing['course_code'],
        description: listing['course.title'],
        location: listing['course.locations_summary'],
        start: [
          start.year(),
          start.month() + 1,
          start.date(),
          start.hour(),
          start.minute(),
        ],
        duration: { minutes: duration },
      });
    }
  }

  // Export to ICS
  ics.createEvents(events, (error, value) => {
    if (error) {
      console.log(error);
      toast.error('Error Generating ICS File');
      return;
    }
    // Download to user's computer
    let blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    FileSaver.saveAs(
      blob,
      `${moment().format('YYYY-MM-DD--hh-mma')}_worksheet.ics`
    );
  });
};
