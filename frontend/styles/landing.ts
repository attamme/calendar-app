import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/color";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E3244", // Dark background based on image
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: colors.btn_yes, // Purple
    top: -width * 0.2,
    left: -width * 0.2,
    opacity: 0.2,
  },
  backgroundCircle2: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: colors.orange, // Orange
    bottom: height * 0.3,
    right: -width * 0.4,
    opacity: 0.15,
  },
  backgroundCircle3: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#0577A1", // Blueish
    bottom: -width * 0.3,
    left: -width * 0.3,
    opacity: 0.2,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 28,
  },
  title: {
    fontFamily: "Inter",
    color: colors.white,
    fontSize: 28,
    fontWeight: "400",
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    color: "#B0B3C7",
    fontSize: 16,
    marginBottom: 32,
    fontWeight: "300",
  },
  heroContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  heroImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
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
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.btn_yes,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
    fontSize: 24,
    fontWeight: "bold",
  },
});