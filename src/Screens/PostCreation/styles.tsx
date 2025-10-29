import {Dimensions, StyleSheet} from 'react-native';
import {BLACK, LIGHT_PINK, } from '../../constant/Colors';
const { width } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor:LIGHT_PINK
  },
  innerContainer: {
    flex: 1,
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
  card: {
    width: width * 0.88,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  timeAgo: {
    fontSize: 18,
    color: "#888",
      fontWeight:"800"
  },
  postImage: {
    width: "100%",
    height: 150,
  },
  captionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  caption: {
    fontSize: 18,
    color: "#333",
    fontWeight:"bold"
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  actionText: {
    fontSize: 18,
    marginLeft: 4,
    color: "#333",
    fontWeight:"800"
  },
});
