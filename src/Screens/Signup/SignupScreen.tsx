/* eslint-disable react-native/no-inline-styles */
import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useState} from 'react';
import {getApp} from '@react-native-firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import {BLUE, LIGHT_PINK} from '../../constant/Colors';
import InputBox from '../../component/InputBox/InputBox';
import ButtonBox from '../../component/ButtonBox/ButtonBox';
import {EMAIL_REGEX, PASSWORD_REGEX} from '../../Utils/Utils';
import {styles} from './Styles';
import {ErrorStateProps, InputStateProps} from './types';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation/stack/types/navigationType'
import firestore from '@react-native-firebase/firestore';


const SignUpScreen = () => {
 const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
  const [inputState, setInputState] = useState<InputStateProps>({
    email: '',
    password: '',
    name: '',
  });
  const [errorState, setErrorState] = useState<ErrorStateProps>({
    emailError: '',
    passwordError: '',
    nameError: '',
  });

  const validateField = (
    field: keyof InputStateProps,
    value: string,
    fromButtonPress = false,
  ) => {
    if (!value && !fromButtonPress) {
      setErrorState(prev => ({
        ...prev,
        [`${field}Error`]: '',
      }));
      return;
    }
    if (field === 'name') {
      if (!value) {
        if (fromButtonPress) {
          setErrorState(prev => ({...prev, nameError: 'Name is required'}));
        }
      } else {
        setErrorState(prev => ({...prev, nameError: ''}));
      }
    }

    if (field === 'email') {
      if (!value) {
        if (fromButtonPress) {
          setErrorState(prev => ({...prev, emailError: 'Email is required'}));
        }
      } else if (!EMAIL_REGEX.test(value)) {
        setErrorState(prev => ({...prev, emailError: 'Invalid email format'}));
      } else {
        setErrorState(prev => ({...prev, emailError: ''}));
      }
    }
    if (field === 'password') {
      if (!value) {
        if (fromButtonPress) {
          setErrorState(prev => ({
            ...prev,
            passwordError: 'Password is required',
          }));
        }
      } else if (!PASSWORD_REGEX.test(value)) {
        setErrorState(prev => ({
          ...prev,
          passwordError:
            'Password must be 8+ chars with uppercase, lowercase, number, and symbol',
        }));
      } else {
        setErrorState(prev => ({...prev, passwordError: ''}));
      }
    }
  };

  const onChangeTextValue = (field: keyof InputStateProps, value: string) => {
    setInputState(prev => ({...prev, [field]: value}));
    validateField(field, value, false);
  };

  const onSignUpClick = async () => {
  const { name, email, password } = inputState;

  validateField('name', name, true);
  validateField('email', email, true);
  validateField('password', password, true);

  if (
    !name ||
    !email ||
    !password ||
    errorState.nameError ||
    errorState.emailError ||
    errorState.passwordError
  ) {
    return;
  }

  try {
    const app = getApp();
    const auth = getAuth(app);
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User account created & signed in!');
    console.log('user======>', userCred.user); 
    await firestore()
      .collection('users')
      .doc(userCred.user.uid) // use UID as document ID
      .set({
        name,
        email,
        password, // ⚠️ Not recommended in real apps — better to omit or hash it
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    console.log('User data stored in Firestore ✅');
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    } else if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    } else {
      console.error('Signup Error:', error);
    }
  }
};



 
  const inputBoxUIView = () => {
    return (
      <View style={styles.inputBoxContainer}>
        <View>
          <InputBox
            value={inputState?.name}
            placeholder="Enter your full name"
            errorMessage={errorState?.nameError}
            onChangeText={text => {
              onChangeTextValue('name', text);
            }}
          />
        </View>
        <View style={styles.inputBoxViewStyle}>
          <InputBox
            value={inputState?.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            errorMessage={errorState?.emailError}
            onChangeText={text => {
              onChangeTextValue('email', text);
            }}
          />
        </View>
        <View style={styles.inputBoxViewStyle}>
          <InputBox
            value={inputState?.password}
            placeholder="Enter your password"
            isRightIcon={true}
            secureTextEntry={false}
            errorMessage={errorState?.passwordError}
            onChangeText={text => {
              onChangeTextValue('password', text);
            }}
          />
        </View>
      </View>
    );
  };

  const buttonUIView = () => {
    return (
      <View style={styles.buttonContainer}>
        <ButtonBox
          title="SignUp"
          onPress={() => {
           // onLogin();
           onSignUpClick()
          }}
        />
        <View style={styles.signUpTextViewStyle}>
          <Text style={styles.signUpTextStyle}>
            Don't have account?{' '}
            <Text
              style={[styles.signUpTextStyle, {color: BLUE}]}
              onPress={() => {
             navigation.goBack()
              }}>
              LOGIN
            </Text>
          </Text>
        </View>
      </View>
    );
  };

    const SignUpText = () =>{
      return(
        <View>
          <Text style={{textAlign:"center",color:"black",fontWeight:"bold",fontSize:20}}>Signup Here....</Text>
        </View>
      )
    }

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:LIGHT_PINK}}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {SignUpText()}
                  {inputBoxUIView()}
                </View>
                {buttonUIView()}
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>

  );
};

export default SignUpScreen;
