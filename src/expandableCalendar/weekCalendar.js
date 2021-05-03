import _ from 'lodash';
import React, {Component} from 'react';
import {FlatList, View, Text} from 'react-native';
import {Map} from 'immutable';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import styleConstructor from './style';
import CalendarList from '../calendar-list';
import Week from '../expandableCalendar/week';
import asCalendarConsumer from './asCalendarConsumer';
import {weekDayNames, getWeekDates} from '../dateutils';
import {extractComponentProps} from '../component-updater';

const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;
const NUMBER_OF_PAGES = 2; // must be a positive number
const applyAndroidRtlFix = commons.isAndroid && commons.isRTL;

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class WeekCalendar extends Component {
  static displayName = 'WeekCalendar';

  static propTypes = {
    ...CalendarList.propTypes,
    /** the current date */
    current: PropTypes.any,
    /** whether to have shadow/elevation for the calendar */
    allowShadow: PropTypes.bool,
    /** whether to hide the names of the week days */
    hideDayNames: PropTypes.bool
  };

  static defaultProps = {
    firstDay: 0,
    allowShadow: true
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.list = React.createRef();
    this.page = NUMBER_OF_PAGES;
    // On Android+RTL there's an initial scroll that cause issues
    this.firstAndroidRTLScrollIgnored = !applyAndroidRtlFix;

    this.state = {
      items: this.getDatesArray()
    };
  }

  componentDidUpdate(prevProps) {
    const {firstDay, context} = this.props;
    const {updateSource, date, prevDate} = context;

    const weekDates = getWeekDates(date, firstDay, 'yyyy-MM-dd');
    const isSameWeek = _.includes(weekDates, prevDate);

    if (date !== prevProps.context.date && updateSource !== UPDATE_SOURCES.WEEK_SCROLL && !isSameWeek) {
      this.setState({items: this.getDatesArray()});
      this.list.current.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
    }
  }

  get containerWidth() {
    return this.props.calendarWidth || commons.screenWidth;
  }

  getDatesArray() {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(index);
      array.push(d);
    }
    return array;
  }

  getDate(weekIndex) {
    const {current, context, firstDay} = this.props;
    const d = XDate(current || context.date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }

    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return newDate.toString('yyyy-MM-dd');
  }

  getMarkedDates = () => {
    const {context, markedDates} = this.props;
    if (markedDates) {
      const marked = _.cloneDeep(markedDates);

      if (marked[context.date]) {
        marked[context.date].selected = true;
      } else {
        marked[context.date] = {selected: true};
      }
      return marked;
    }
    return {[context.date]: {selected: true}};
  };

  getWeekStyle = memoize((width, style) => {
    return [{width}, style];
  });

  onDayPress = value => {
    _.invoke(this.props.context, 'setDate', value.dateString, UPDATE_SOURCES.DAY_PRESS);
  };

  onScroll = ({
    nativeEvent: {
      contentOffset: {x}
    }
  }) => {
    if (!this.firstAndroidRTLScrollIgnored) {
      this.firstAndroidRTLScrollIgnored = true;
      return;
    }

    // Fix reversed offset on Android+RTL
    if (applyAndroidRtlFix) {
      const numOfPages = this.state.items.length - 1;
      const overallWidth = numOfPages * this.containerWidth;
      x = overallWidth - x;
    }

    const newPage = Math.round(x / this.containerWidth);

    if (this.page !== newPage) {
      const {items} = this.state;
      this.page = newPage;

      _.invoke(this.props.context, 'setDate', items[this.page], UPDATE_SOURCES.WEEK_SCROLL);

      if (this.page === items.length - 1) {
        for (let i = 0; i <= NUMBER_OF_PAGES; i++) {
          items[i] = items[i + NUMBER_OF_PAGES];
        }
        this.setState({items: [...items]});
      } else if (this.page === 0) {
        for (let i = items.length - 1; i >= NUMBER_OF_PAGES; i--) {
          items[i] = items[i - NUMBER_OF_PAGES];
        }
        this.setState({items: [...items]});
      }
    }
  };

  onMomentumScrollEnd = () => {
    const {items} = this.state;
    const isFirstPage = this.page === 0;
    const isLastPage = this.page === items.length - 1;

    if (isFirstPage || isLastPage) {
      this.list.current.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
      this.page = NUMBER_OF_PAGES;
      const newWeekArray = this.getDatesArray();

      if (isLastPage) {
        for (let i = NUMBER_OF_PAGES + 1; i < items.length; i++) {
          items[i] = newWeekArray[i];
        }
      } else {
        for (let i = 0; i < NUMBER_OF_PAGES; i++) {
          items[i] = newWeekArray[i];
        }
      }

      setTimeout(() => {
        this.setState({items: [...items]});
      }, 100);
    }
  };

  renderItem = ({item}) => {
    const {style, onDayPress, markedDates, ...others} = extractComponentProps(Week, this.props);

    const weekDates = getWeekDates(item, others.firstDay, 'yyyy-MM-dd');
    const currentWeek = _.includes(weekDates, this.props.context.date);
    const fixedMarkedDates = currentWeek ? this.getMarkedDates() : markedDates;

    return (
      <Week
        {...others}
        key={item}
        current={item}
        style={this.getWeekStyle(this.containerWidth, style)}
        markedDates={fixedMarkedDates}
        onDayPress={onDayPress || this.onDayPress}
      />
    );
  };

  getItemLayout = (data, index) => {
    return {
      length: this.containerWidth,
      offset: this.containerWidth * index,
      index
    };
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    const {allowShadow, firstDay, hideDayNames, current, context} = this.props;
    const {items} = this.state;
    let weekDaysNames = weekDayNames(firstDay);
    const extraData = Map({
      current,
      date: context.date,
      firstDay
    });
    return (
      <View
        testID={this.props.testID}
        style={[allowShadow && this.style.containerShadow, !hideDayNames && this.style.containerWrapper]}
      >
        {!hideDayNames && (
          <View style={[this.style.week, this.style.weekCalendar]}>
            {/* {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>} */}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                style={this.style.dayHeader}
                numberOfLines={1}
                accessibilityLabel={''}
                // accessible={false} // not working
                // importantForAccessibility='no'
              >
                {day}
              </Text>
            ))}
          </View>
        )}
        <FlatList
          ref={this.list}
          data={items}
          extraData={extraData}
          style={this.style.container}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          initialScrollIndex={NUMBER_OF_PAGES}
          getItemLayout={this.getItemLayout}
          onScroll={this.onScroll}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        />
      </View>
    );
  }
}

export default asCalendarConsumer(WeekCalendar);
