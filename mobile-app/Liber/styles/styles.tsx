import colors from "./colors";
import fonts from "./fonts";
const React = require("react-native");

const { StyleSheet } = React;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.White,
  },
  loginScreenContainer: {
    flex: 1,
  },
  text: {
    color: colors.PrimaryGreen,
    fontFamily: fonts.Poppins.bold
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
    width: 206,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.PrimaryBlue,
    backgroundColor: colors.PrimaryGreen,
    color: colors.White,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    backgroundColor: colors.PrimaryBlue,
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    alignItems: "center"
  },
  logo: {
    marginTop: 100,
    marginBottom: 30,
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
  drawerContainer: {
    flex: 1,
    height: '10%'
  },
  drawerImageConatiner: {
    alignItems: "center",
    marginTop: 10,
  },
  headerImage: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
});

export default styles;
