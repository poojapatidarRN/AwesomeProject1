import {
  NativeModules,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type containerType = {
  children?: ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;
  animated?: boolean;
  opacity?: number;
  marginBottom?: number;
  subContainerStyle?: ViewStyle;
};

const ScreenContainer: React.FC<containerType> = ({
  children,
  backgroundColor = '#fff',
  statusBarColor = backgroundColor,
  statusBarStyle,
  animated = true,
  opacity,
  marginBottom = 0,
  subContainerStyle,
}) => {
  const inset = useSafeAreaInsets();
  const {StatusBarManager} = NativeModules;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          opacity: opacity,
          marginBottom: marginBottom,
        },
      ]}>
      <View
        style={[
          {
            backgroundColor: statusBarColor,
            paddingTop: inset.top + 10,
          },
          subContainerStyle,
        ]}
      />
      <StatusBar
        animated={animated}
        backgroundColor={statusBarColor}
        barStyle={statusBarStyle}
      />
      {children}
    </View>
  );
};

export default React.memo(ScreenContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});