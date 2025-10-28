import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constant/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  goodMorningTextViewContainer: {
    paddingHorizontal: 15,
    marginTop: 50,
  },
  goodMorningTextStyle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: WHITE,
  },
  inputBoxContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
  },
  inputBoxViewStyle: {
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 10,
  },
  signUpTextViewStyle: {
    alignItems: 'center',
    paddingTop: 10,
  },
  signUpTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
  },
});
