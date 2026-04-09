import { Image, View, ViewStyle } from "react-native";

type LogoProps = {
  style?: ViewStyle;
};

export default function Logo({ style }: LogoProps) {
  return (
    <View style={[{ paddingTop: 12, paddingLeft: 21 }, style]}>
      <Image
        source={require("./Logo.png")}
        style={{ width: 112, height: 46, borderRadius: 10 }}
        resizeMode="cover"
      />
    </View>
  );
}
