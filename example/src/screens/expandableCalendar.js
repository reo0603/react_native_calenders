import _ from 'lodash';
import React, {Component} from 'react';
import {
  Platform,
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button
} from 'react-native';
import XDate from 'xdate';
import {ExpandableCalendar, AgendaList, CalendarProvider} from 'react-native-calendars';


const today = XDate().toString('yyyy-MM-dd');
const items = [
  {title: '2019-05-27', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {title: today, data: [{hour: '4pm', duration: '1h', title: 'Pilates ABC'}, {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}]},
  {title: '2019-06-01', data: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {title: '2019-06-02', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {title: '2019-06-03', data: [{}]},
  {title: '2019-06-04', data: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
  {title: '2019-06-05', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {title: '2019-06-06', data: [{}]},
  {title: '2019-06-07', data: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
  {title: '2019-06-08', data: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {title: '2019-06-09', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]}
];

export default class ExpandableCalendarScreen extends Component {
  
  onDateChanged = (/**date, updateSource*/) => {
    // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // fetch and set data for date + week ahead
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  renderItem = ({item}) => {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem();
    }

    const id = item.title;
    const props = {
      hour: item.hour,
      duration: item.duration,
      title: item.title,
      button: {label: 'info', onPress: () => Alert.alert('show more')},
      onPress: () => Alert.alert(id)
    };

    return (
      <TouchableOpacity 
        onPress={props.onPress} 
        style={styles.item}
      >
        <View>
          <Text style={styles.itemHourText}>{props.hour}</Text>
          <Text style={styles.itemDurationText}>{props.duration}</Text>
        </View>
        <Text style={styles.itemTitleText}>{props.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button title={props.button.label} onPress={props.button.onPress}/>
        </View>
      </TouchableOpacity>
    );
  }

  getMarkedDates = () => {
    const marked = {};
    items.forEach(item => {
      // only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = {marked: true};
      }
    });
    return marked;
  }

  getTheme = () => {
    const themeColor = '#0059ff';
    const lightThemeColor = '#e6efff';
    const disabledColor = '#a6acb1';
    const black = '#20303c';
    const white = '#ffffff';
    
    return {
      // arrows
      arrowColor: black,
      arrowStyle: {padding: 0},
      // month
      monthTextColor: black,
      textMonthFontSize: 16,
      textMonthFontFamily: 'HelveticaNeue',
      textMonthFontWeight: 'bold',
      // day names
      textSectionTitleColor: black,
      textDayHeaderFontSize: 12,
      textDayHeaderFontFamily: 'HelveticaNeue',
      textDayHeaderFontWeight: 'normal',
      // today
      todayBackgroundColor: lightThemeColor,
      todayTextColor: themeColor,
      // dates
      dayTextColor: themeColor,
      textDayFontSize: 18,
      textDayFontFamily: 'HelveticaNeue',
      textDayFontWeight: '500',
      textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
      // selected date
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: white,
      // disabled date
      textDisabledColor: disabledColor,
      // dot (marked date)
      dotColor: themeColor,
      selectedDotColor: white,
      disabledDotColor: disabledColor,
      dotStyle: {marginTop: -2}
    };
  }

  render() {    
    const style = {paddingLeft: 20, paddingRight: 20};

    return (
      <CalendarProvider date={items[0].title} onDateChanged={this.onDateChanged} theme={{todayButtonTextColor: '#0059ff'}} showTodayButton>
        <ExpandableCalendar 
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={'open'} // ExpandableCalendar.positions.OPEN - can't find static positions
          firstDay={1}
          markedDates={this.getMarkedDates()} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
          calendarStyle={style}
          theme={this.getTheme()}
          leftArrowImageSource={require('../img/previous.png')}
          rightArrowImageSource={require('../img/next.png')}
          headerStyle={style}
        />
        <AgendaList
          data={items}
          sections={items}
          renderItem={this.renderItem}
          // sectionStyle={{backgroundColor: '#f0f4f7', color: '#79838a'}}
        />
      </CalendarProvider>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0', 
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey', 
    fontSize: 12, 
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black', 
    marginLeft: 16, 
    fontWeight: 'bold', 
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1, 
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52, 
    justifyContent: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0' 
  },
  emptyItemText: {
    color: '#79838a',
    fontSize: 14
  }
});
