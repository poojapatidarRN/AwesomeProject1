import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BLACK, PRIMARY, WHITE} from '../../constant/Colors';

type ButtonBoxProps = {
    onPress?: (val?:any) => void;
    title?: string;
    backgroundColor?: string;
    titleColor?: string
    
}

const ButtonBox: React.FC<ButtonBoxProps> = ({
    onPress,
    title = 'Title',
    backgroundColor = WHITE,
    titleColor = BLACK,
}) => {
  return (
    <View>
      <Pressable style={[styles.buttonContainer, {backgroundColor: backgroundColor}]} onPress={onPress}>
        <Text style={[styles.buttonText,{color: titleColor}]}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default ButtonBox;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
