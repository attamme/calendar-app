import { Image, StyleProp, View, ViewStyle } from "react-native";
import { colors, radius } from "@/styles/tokens";

type LogoProps = {
  style?: StyleProp<ViewStyle>;
};

export default function Logo({ style }: LogoProps) {
  return (
    <View style={[{ paddingTop: 12, paddingLeft: 21 }, style]}>
      <View
        style={{
          width: 112,
          height: 46,
          borderRadius: radius.logo,
          backgroundColor: colors.surfaceMuted,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={require("./Logo.png")}
          style={{ width: 88, height: 30 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
