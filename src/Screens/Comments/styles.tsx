import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: "70%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginVertical: 8,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  commentItem: {
    borderBottomWidth: 0.3,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  commentUser: {
    fontWeight: "bold",
    color: "black",
  },
  commentText: {
    color: "#333",
    marginTop: 2,
  },
  noComments: {
    textAlign: "center",
    color: "#777",
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "black",
    height: 40,
    marginRight: 10,
  },
  sendText: {
    color: "#007bff",
    fontWeight: "600",
  },
});
