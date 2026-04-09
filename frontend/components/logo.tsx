import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";

type LogoProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export default function Logo({ onPress, style, testID }: LogoProps) {
  const content = (
    <View style={[{ paddingTop: 12, paddingLeft: 21 }, style]}>
      <Image source={require("./Logo.png")} style={{ width: 54, height: 67 }} resizeMode="contain" />
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} testID={testID}>
      {content}
    </Pressable>
  );
}
