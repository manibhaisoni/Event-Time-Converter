
import { TimezoneOption } from './types';

// Extracting a subset of common timezones for the selector
// Use any cast for Intl to resolve TypeScript error regarding supportedValuesOf which is available in modern browsers
export const COMMON_TIMEZONES: TimezoneOption[] = (Intl as any).supportedValuesOf('timeZone').map((tz: string) => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset'
  });
  const parts = formatter.formatToParts(now);
  const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
  
  return {
    value: tz,
    label: tz.replace(/_/g, ' '),
    offset: offset
  };
}).sort((a: TimezoneOption, b: TimezoneOption) => a.label.localeCompare(b.label));

export const LOCAL_STORAGE_KEY = 'chronos_saved_events';
