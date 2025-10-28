import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {BLACK, GRAY, RED, WHITE} from '../../constant/Colors';
import Images from '../../constant/Images';
import {hitSlop} from '../../constant/constants';

export type InputBoxProps = {
  onChangeText?: (val: string) => void;
  onIconPress?: () => void;
  value?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'visible-password'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  multilineHeight?: number;
  maxLength?: number;
  isRightIcon?: boolean;
  rightIcon?: any;
  tintColor?: string;
  isErrorMessage?: boolean;
  errorMessage?: string;
};

const InputBox: React.FC<InputBoxProps> = ({
  onChangeText,
  onIconPress,
  value = '',
  placeholder = 'Enter Placeholder',
  placeholderTextColor = GRAY,
  editable = true,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines,
  maxLength,
  isRightIcon = false,
  rightIcon = Images.ic_open_eye_icon,
  tintColor = GRAY,
  multilineHeight = 100,
  isErrorMessage = false,
  errorMessage = '',
}) => {
  return (
    <View>
    <View style={styles.container}>
      <TextInput
        defaultValue={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.inputStyle, multiline && {height: numberOfLines ? 50 * numberOfLines : multilineHeight}]}
        editable={editable}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical='top'
      />
      {isRightIcon && (
        <Pressable
          style={styles.eyeIconButtonContainer}
          hitSlop={hitSlop}
          onPress={onIconPress}>
          <Image
            source={rightIcon}
            style={styles.eyeIconStyle}
            resizeMode="contain"
            tintColor={tintColor}
          />
        </Pressable>
      )}
    </View>
    {!!errorMessage ? (
    <View style={styles.errorMessageTextContainer}>
        <Text style={styles.errorMessageTextStyle}>{errorMessage}</Text>
    </View>
    ) : null}
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY,
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontWeight: '600',
    color: BLACK,
    paddingHorizontal: 10,
  },
  eyeIconButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  eyeIconStyle: {
    width: 25,
    height: 25,
  },
  errorMessageTextContainer:{
    marginTop:2,
  },
  errorMessageTextStyle:{
    fontSize: 14,
    fontWeight: '600',
    color: RED,
  }
});
