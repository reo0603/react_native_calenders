import {StyleSheet} from 'react-native';
import * as appStyle from '../style';

export default StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    backgroundColor: appStyle.foregroundColor
  },
  week: {
    marginTop: 7,
    marginBottom: 7,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dayHeader: {
    marginTop: 3,
    marginBottom: 8,
    width: 32,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 10,
    fontSize: 12,
    color: appStyle.text.sectionTitleColor
  }
});

