import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/color";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flex: 1,
    backgroundColor: "#404258", 
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 28,
    top: -30,
    left: -10,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 20,
    marginBottom: 32,
    fontWeight: "200",
  },
  heroContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  heroImage: {
    width: "100%",
    opacity: 0.7,
    height: 180,
    borderRadius: 7,
    resizeMode: "cover",
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: colors.btn_no,
    flex: 1,
  },
  loginButton: {
    backgroundColor: colors.btn_yes,
    flex: 1,
  },
  description: {
    color: "#B0B3C7",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: "100%",
  },
  helpButton: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 102,
    height: 102,
    borderRadius: 51,
    transform: [{ rotate: "-45deg" }],
    backgroundColor: colors.btn_yes,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  helpButtonText: {
    color: colors.white,
    fontSize: 42,
    marginBottom: 10,
    marginLeft: 5,
  }
});