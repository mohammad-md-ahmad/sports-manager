const React = require("react-native");
const { StyleSheet, useColorScheme } = React;

//const isDarkMode = useColorScheme() === 'dark';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
    borderColor: "red",
    backgroundColor: "#BEADFA",
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center",
    borderColor: "red",
  },
  loginFormView: {
    flex: 1,
    borderColor: "red",
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    color: "#3897f1",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: 350,
    alignItems: "center"
  },
});

export default styles;
