import times from 'lodash/times';
import React, {useState, Fragment, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, Switch} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import testIDs from '../testIDs';

const INITIAL_DATE = '2022-07-06';
const GREEN = '#13ba7d';
const PINK = '#a68a9f';
const RED = '#ba1313';
enum Markings {
  DOT = 'dot',
  MULTI_DOT = 'multi-dot',
  PERIOD = 'period',
  MULTI_PERIOD = 'multi-period',
  CUSTOM = 'custom'
}

const NewCalendarScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [markingType, setMarkingType] = useState(Markings.DOT);

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  /** props */
  const [enableSwipeMonths, setEnableSwipeMonths] = useState(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [hideExtraDays, setHideExtraDays] = useState(false);
  const [hideArrows, setHideArrows] = useState(false);
  const [disabledByDefault, setDisabledByDefault] = useState(false);
  const [disableAllTouchEventsForDisabledDays, setDisableAllTouchEventsForDisabledDays] = useState(false);
  const [disableAllTouchEventsForInactiveDays, setDisableAllTouchEventsForInactiveDays] = useState(false);
  const [displayLoadingIndicator, setDisplayLoadingIndicator] = useState(false);
  const [disabledDaysIndexes, setDisabledDaysIndexes] = useState(false);
  const [dayComponent, setDayComponent] = useState(false);
  const [customHeader, setCustomHeader] = useState(false);
  const [customHeaderTitle, setCustomHeaderTitle] = useState(false);

  const toggleEnableSwipeMonths = useCallback(() => setEnableSwipeMonths(!enableSwipeMonths), [enableSwipeMonths]);
  const toggleShowWeekNumbers = useCallback(() => setShowWeekNumbers(!showWeekNumbers), [showWeekNumbers]);
  const toggleHideExtraDays = useCallback(() => setHideExtraDays(!hideExtraDays), [hideExtraDays]);
  const toggleHideArrows = useCallback(() => setHideArrows(!hideArrows), [hideArrows]);
  const toggleDisabledByDefault = useCallback(() => setDisabledByDefault(!disabledByDefault), [disabledByDefault]);
  const toggleDisableAllTouchEventsForDisabledDays = useCallback(() => setDisableAllTouchEventsForDisabledDays(!disableAllTouchEventsForDisabledDays), [disableAllTouchEventsForDisabledDays]);
  const toggleDisableAllTouchEventsForInactiveDays = useCallback(() => setDisableAllTouchEventsForInactiveDays(!disableAllTouchEventsForInactiveDays), [disableAllTouchEventsForInactiveDays]);
  const toggleDisplayLoadingIndicator = useCallback(() => setDisplayLoadingIndicator(!displayLoadingIndicator), [displayLoadingIndicator]);
  const toggleDisabledDaysIndexes = useCallback(() => setDisabledDaysIndexes(!disabledDaysIndexes), [disabledDaysIndexes]);
  const toggleDayComponent = useCallback(() => setDayComponent(!dayComponent), [dayComponent]);
  const toggleCustomHeader = useCallback(() => setCustomHeader(!customHeader), [customHeader]);
  const toggleCustomHeaderTitle = useCallback(() => setCustomHeaderTitle(!customHeaderTitle), [customHeaderTitle]);


  const getDate = (count) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const theme = useMemo(() => {
    return {
      textInactiveColor: PINK,
      textSectionTitleDisabledColor: 'grey',
      textSectionTitleColor: GREEN,
      arrowColor: 'grey'
    };
  }, []);

  const dotMarks = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: PINK,
        selectedTextColor: RED
      },
      [getDate(1)]: {
        disabled: true,
        dotColor: RED,
        marked: true
      }
    };
  }, [selected]);

  const multiDotMarks = useMemo(() => {
    return {
      [INITIAL_DATE]: {
        selected: true,
        dots: [
          {key: 'vacation', color: 'blue', selectedDotColor: RED},
          {key: 'massage', color: RED, selectedDotColor: 'white'}
        ]
      },
      [getDate(1)]: {
        disabled: true,
        dots: [
          {key: 'vacation', color: GREEN, selectedDotColor: RED},
          {key: 'massage', color: RED, selectedDotColor: GREEN}
        ]
      }
    };
  }, []);

  // const periodMarks = useMemo(() => {
  //   return {
  //     '2012-05-17': {disabled: true},
  //     '2012-05-08': {textColor: 'pink'},
  //     '2012-05-09': {textColor: 'pink'},
  //     '2012-05-14': {startingDay: true, color: GREEN, endingDay: true},
  //     '2012-05-21': {startingDay: true, color: GREEN},
  //     '2012-05-22': {endingDay: true, color: 'gray'},
  //     '2012-05-24': {startingDay: true, color: 'gray'},
  //     '2012-05-25': {color: 'gray'},
  //     '2012-05-26': {endingDay: true, color: 'gray'}
  //   };
  // }, []);

  const periodWithDotsMarks = useMemo(() => {
    return {
      [INITIAL_DATE]: {marked: true, dotColor: '#50cebb'},
      [getDate(1)]: {disabled: true, marked: true, dotColor: '#50cebb'},
      [getDate(2)]: {startingDay: true, color: '#50cebb', textColor: 'white'},
      [getDate(3)]: {
        color: '#70d7c7',
        customTextStyle: {
          color: '#FFFAAA',
          fontWeight: '700'
        }
      },
      [getDate(4)]: {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
      [getDate(5)]: {color: '#70d7c7', inactive: true},
      [getDate(6)]: {
        endingDay: true,
        color: '#50cebb',
        textColor: 'white',
        customContainerStyle: {
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5
        }
      },
      [getDate(10)]: {inactive: true, disableTouchEvent: true}
    };
  }, []);

  const multiPeriodMarks = useMemo(() => {
    return {
      [INITIAL_DATE]: {
        periods: [
          {startingDay: true, endingDay: false, color: GREEN},
          {startingDay: true, endingDay: false, color: 'orange'}
        ]
      },
      [getDate(1)]: {
        periods: [
          {startingDay: false, endingDay: true, color: GREEN},
          {startingDay: false, endingDay: true, color: 'orange'},
          {startingDay: true, endingDay: false, color: 'pink'}
        ]
      },
      [getDate(5)]: {
        periods: [
          {startingDay: true, endingDay: true, color: 'orange'},
          {color: 'transparent'},
          {startingDay: false, endingDay: false, color: 'pink'}
        ]
      }
    };
  }, []);

  const customMarks = useMemo(() => {
    return {
      [INITIAL_DATE]: {
        customStyles: {
          container: {
            backgroundColor: 'white',
            elevation: 2
          },
          text: {
            color: RED,
            marginTop: 0
          }
        }
      },
      [getDate(1)]: {
        selected: true
      },
      [getDate(2)]: {
        customStyles: {
          container: {
            backgroundColor: RED,
            elevation: 4
          },
          text: {
            color: 'white'
          }
        }
      },
      [getDate(3)]: {
        customStyles: {
          container: {
            backgroundColor: GREEN
          },
          text: {
            color: 'white'
          }
        }
      },
      [getDate(4)]: {
        customStyles: {
          container: {
            backgroundColor: 'black',
            elevation: 2
          },
          text: {
            color: 'yellow'
          }
        }
      },
      [getDate(5)]: {
        disabled: true
      },
      [getDate(6)]: {
        customStyles: {
          text: {
            color: 'black',
            fontWeight: 'bold'
          }
        }
      },
      [getDate(10)]: {
        customStyles: {
          container: {
            backgroundColor: 'pink',
            elevation: 4,
            borderColor: 'purple',
            borderWidth: 5
          },
          text: {
            marginTop: 3,
            fontSize: 11,
            color: 'black'
          }
        }
      },
      [getDate(11)]: {
        customStyles: {
          container: {
            backgroundColor: 'orange',
            borderRadius: 0
          }
        }
      }
    };
  }, []);

  const inactiveMarks = useMemo(() => {
    return {
      [INITIAL_DATE]: {
        inactive: true
      },
      [getDate(1)]: {
        inactive: true
      }
    };
  }, []);

  const markingForType = useCallback(() => {
    switch (markingType) {
      case Markings.DOT:
        return dotMarks;
      case Markings.MULTI_DOT:
        return multiDotMarks;
      case Markings.PERIOD:
        return periodWithDotsMarks; //periodMarks;
      case Markings.MULTI_PERIOD:
        return multiPeriodMarks;
      case Markings.CUSTOM:
        return customMarks;
    }
  }, [markingType, selected]);

  const renderCalendar = () => {
    return (
      <Calendar
        current={INITIAL_DATE}
        style={styles.calendar}
        theme={theme}
        onDayPress={onDayPress}
        markingType={markingType}
        markedDates={disableAllTouchEventsForInactiveDays ? inactiveMarks : markingForType()}
        // minDate={minDate} //'2012-05-10'
        // maxDate={maxDate} //'2012-05-20'
        firstDay={1}
        enableSwipeMonths={enableSwipeMonths}
        showWeekNumbers={showWeekNumbers}
        hideExtraDays={hideExtraDays}
        hideArrows={hideArrows}
        disabledByDefault={disabledByDefault}
        disableAllTouchEventsForDisabledDays={disableAllTouchEventsForDisabledDays}
        disableAllTouchEventsForInactiveDays={disableAllTouchEventsForInactiveDays}
        displayLoadingIndicator={displayLoadingIndicator}
        disabledDaysIndexes={disabledDaysIndexes ? [0, 6] : undefined}
        dayComponent={dayComponent ? CustomDay : undefined}
        customHeader={customHeader ? CustomHeader : undefined}
        customHeaderTitle={customHeaderTitle ? CustomHeaderTitle : undefined}
        onPressArrowLeft={customHeaderTitle ? onPressArrowLeft : undefined}
        onPressArrowRight={customHeaderTitle ? onPressArrowRight : undefined}
      />
    );
  };

  /** Custom Day */
  const CustomDay = ({date, state}) => {
    return (
      <View>
        <Text style={[styles.customDay, state === 'disabled' ? styles.disabledText : styles.defaultText]}>
          {date?.day}
        </Text>
      </View>
    );
  };

  /** Custom Header */
  const customHeaderProps: any = useRef();

  const setCustomHeaderNewMonth = (next = false) => {
    const add = next ? 1 : -1;
    const month = customHeaderProps?.current?.month;
    const newMonth = new Date(month.setMonth(month.getMonth() + add));
    customHeaderProps?.current?.addMonth(add);
    setCurrentMonth(newMonth.toISOString().split('T')[0]);
  };
  const moveNext = () => {
    setCustomHeaderNewMonth(true);
  };
  const movePrevious = () => {
    setCustomHeaderNewMonth(false);
  };

  const CustomHeader = React.forwardRef((props, ref) => {
    customHeaderProps.current = props;
    
    return (
      // @ts-expect-error
      <View ref={ref} {...props} style={styles.customHeader}>
        <TouchableOpacity onPress={movePrevious}>
          <Text>Previous</Text>
        </TouchableOpacity>
        <Text>Custom header!</Text>
        <Text>{currentMonth}</Text>
        <TouchableOpacity onPress={moveNext}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  });

  /** Custom Header Title */
  const [selectedValue, setSelectedValue] = useState(new Date());

  const getNewSelectedDate = useCallback(
    (date, shouldAdd) => {
      const newMonth = new Date(date).getMonth();
      const month = shouldAdd ? newMonth + 1 : newMonth - 1;
      const newDate = new Date(selectedValue.setMonth(month));
      const newSelected = new Date(newDate.setDate(1));
      return newSelected;
    },
    [selectedValue]
  );

  const onPressArrowLeft = useCallback(
    (subtract, month) => {
      const newDate = getNewSelectedDate(month, false);
      setSelectedValue(newDate);
      subtract();
    },
    [getNewSelectedDate]
  );

  const onPressArrowRight = useCallback(
    (add, month) => {
      const newDate = getNewSelectedDate(month, true);
      setSelectedValue(newDate);
      add();
    },
    [getNewSelectedDate]
  );

  const CustomHeaderTitle = (
    <TouchableOpacity style={styles.customTitleContainer} onPress={() => console.warn('Tapped!')}>
      <Text style={styles.customTitle}>{selectedValue.getMonth() + 1}-{selectedValue.getFullYear()}</Text>
    </TouchableOpacity>
  );

  /** Props Switches */
  const renderSwitch = (label: string, state: any, toggleSwitch: any) => {
    return (
      <View style={styles.switchContainer}>
        <Switch
          value={state}
          onValueChange={toggleSwitch}
          trackColor={{true: GREEN}}
        />
        <Text style={styles.switchText}>{label}</Text>
      </View>
    );
  };

  const renderSwitches = () => {
    return (
      <View>
        {renderSwitch('Enable Swipe Months', enableSwipeMonths, toggleEnableSwipeMonths)}
        {renderSwitch('Show Week Numbers', showWeekNumbers, toggleShowWeekNumbers)}
        {renderSwitch('Hide Extra Days', hideExtraDays, toggleHideExtraDays)}
        {renderSwitch('Hide Arrows', hideArrows, toggleHideArrows)}
        {renderSwitch('Disabled By Default', disabledByDefault, toggleDisabledByDefault)}
        {renderSwitch('Disable All Touch Events For Disabled Days', disableAllTouchEventsForDisabledDays, toggleDisableAllTouchEventsForDisabledDays)}
        {renderSwitch('Disable All Touch Events For Inactive Days', disableAllTouchEventsForInactiveDays, toggleDisableAllTouchEventsForInactiveDays)}
        {renderSwitch('Display Loading Indicator', displayLoadingIndicator, toggleDisplayLoadingIndicator)}
        {renderSwitch('Disabled Days Indexes', disabledDaysIndexes, toggleDisabledDaysIndexes)}
        {renderSwitch('Day Component', dayComponent, toggleDayComponent)}
        {renderSwitch('Custom Header', customHeader, toggleCustomHeader)}
        {renderSwitch('Custom Header Title', customHeaderTitle, toggleCustomHeaderTitle)}
      </View>
    );
  };

  const getValue = (index = 0) => {
    return Object.values(Markings)[index];
  };

  const setType = (index = 0) => {
    setSelectedButtonIndex(index);
    setMarkingType(getValue(index));
  };

  const renderRadioButton = (index = 0) => {
    const value = getValue(index);
    return (
      <TouchableOpacity onPress={() => setType(index)} key={index} style={styles.radioButtonContainer}>
        <View style={styles.radioButton}>
        {selectedButtonIndex === index &&
          <View style={styles.selectedRadioButton}/>
        }
        </View>
          <Text>{value}</Text>
      </TouchableOpacity>
    );
  };

  const renderRadioButtons = () => {
    return times(5, i => {
      return renderRadioButton(i);
    });
  };

  const renderOptions = () => {
    return (
      <View style={styles.container}>
        <View style={styles.radioButtonsContainer}>
          <Text style={styles.radioButtonsTitle}>Marking Type</Text>
          {renderRadioButtons()}
        </View>
        {renderSwitches()}
      </View>
    );
  };

  return (
    <Fragment>
      {renderCalendar()}
      <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
        {renderOptions()}
      </ScrollView>
    </Fragment>
  );
};

export default NewCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  container: {
    // flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 10
  },
  switchContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center'
  },
  switchText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  radioButtonsContainer: {
    margin: 10
  },
  radioButtonsTitle: {
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 5
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  selectedRadioButton: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'grey'
  },
  disabledText: {
    color: 'grey'
  },
  defaultText: {
    color: 'purple'
  },
  customDay: {
    textAlign: 'center'
  },
  customHeader: {
    backgroundColor: '#FCC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -4,
    padding: 8
  },
  customTitleContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10
  },
  customTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN
  }
});
