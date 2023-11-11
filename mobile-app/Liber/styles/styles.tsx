import colors from "./colors";
import fonts from "./fonts";
const React = require("react-native");

const { StyleSheet } = React;

export const placeHolderTextColor = colors.PrimaryBlueLight;

const globalStyles = StyleSheet.create({
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
    fontFamily: fonts.Poppins.bold,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputText: {
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.PrimaryBlue,
    backgroundColor: colors.White,
    color: colors.PrimaryBlue,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: fonts.Poppins.light
  },
  inputTextLabel: {
    fontSize: 16,
    color: colors.Gray,
    fontFamily: fonts.Poppins.regular
  },
  button: {
    backgroundColor: colors.PrimaryBlue,
    borderRadius: 5,
    height: 40,
    marginTop: 10,
    alignItems: "center",
    fontFamily: fonts.Poppins.regular
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
    marginBottom: 5,
    fontFamily: fonts.Poppins.regular
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

export default globalStyles;
