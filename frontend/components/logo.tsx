import React from 'react';
import { Image, View } from 'react-native';

const Logo = () => {
  return (    <View style={{ paddingTop: 20, paddingLeft: 20 }}>
      <Image
        source={require('./Logo.png')}
        style={{ width: 54, height: 67 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;