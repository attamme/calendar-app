import React from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from '@/styles/button';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
//Buttonil on jh onClick aga Inputil ei ole OnChange ega midagi
const Button = ({ title, onPress, style}: ButtonProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      onPress={onPress} 
      style={[styles.container, style]} >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;