
export interface GlobalEvent {
  id: string;
  name: string;
  sourceDate: string; // ISO format
  sourceTime: string; // HH:mm format
  sourceTimezone: string;
  createdAt: number;
}

export interface ConvertedTime {
  localDate: string;
  localTime: string;
  dayDiff: 'Same day' | 'Next day' | 'Previous day';
  diffHours: number;
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}
