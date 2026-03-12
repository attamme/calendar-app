import { StyleSheet } from 'react-native';
import { colors } from '../constants/color'; 
export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.btn_yes,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderRadius: 100,
    width: 152,
    marginVertical: 10,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'regular',
  },
});