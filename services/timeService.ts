
import { DateTime } from 'https://cdn.skypack.dev/luxon';
import { ConvertedTime } from '../types';

export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertEventTime = (
  date: string,
  time: string,
  sourceTz: string,
  targetTz: string
): ConvertedTime => {
  // Combine date and time
  const sourceDt = DateTime.fromISO(`${date}T${time}`, { zone: sourceTz });
  const targetDt = sourceDt.setZone(targetTz);

  const sourceDay = sourceDt.startOf('day');
  const targetDay = targetDt.startOf('day');

  let dayDiff: ConvertedTime['dayDiff'] = 'Same day';
  const diffInDays = targetDay.diff(sourceDay, 'days').days;

  if (diffInDays === 1) dayDiff = 'Next day';
  else if (diffInDays === -1) dayDiff = 'Previous day';

  return {
    localDate: targetDt.toLocaleString(DateTime.DATE_HUGE),
    localTime: targetDt.toLocaleString(DateTime.TIME_SIMPLE),
    dayDiff,
    diffHours: targetDt.offset / 60 - sourceDt.offset / 60
  };
};

export const formatToICS = (name: string, date: string, time: string, tz: string) => {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: tz }).toUTC();
  const stamp = dt.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const end = dt.plus({ hours: 1 }).toFormat("yyyyMMdd'T'HHmmss'Z'");
  
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${name || 'Global Event'}
DTSTART:${stamp}
DTEND:${end}
DESCRIPTION:Converted by Event Time Converter
END:VEVENT
END:VCALENDAR`;
};
