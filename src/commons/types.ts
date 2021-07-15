import {ColorValue} from 'react-native';
export interface Theme {
  container?: object;
  contentStyle?: object;
  header?: object;
  headerText?: object;
  arrowButton?: object;
  event?: object;
  eventTitle?: object;
  eventSummary?: object;
  eventTimes?: object;
  line?: object;
  lineNow?: object;
  timeLabel?: object;
  todayTextColor?: string;
  calendarBackground?: string;
  indicatorColor?: ColorValue | object;
  stylesheet?: {
    calendar?: {header?: object};
    day?: {basic?: object; period?: object};
    dot?: object;
    marking?: object;
    'calendar-list'?: {main?: object};
  };
  textSectionTitleColor?: string;
  textSectionTitleDisabledColor?: string;
  dayTextColor?: string;
  selectedDayTextColor?: string;
  monthTextColor?: string;
  selectedDayBackgroundColor?: string;
  arrowColor?: string;
  textDisabledColor?: string;
  backgroundColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  disabledArrowColor?: string;
  textDayFontFamily?: string;
  textMonthFontFamily?: string;
  textDayHeaderFontFamily?: string;
  textDayFontWeight?: string;
  textMonthFontWeight?: string;
  textDayHeaderFontWeight?: string;
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  agendaDayTextColor?: string;
  agendaDayNumColor?: string;
  agendaTodayColor?: string;
  agendaKnobColor?: string;
}
