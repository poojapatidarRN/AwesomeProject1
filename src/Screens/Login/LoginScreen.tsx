import { View,Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
// import firestore from '@react-native-firebase/firestore';
import { ErrorStateProps, InputStateProps } from './types';
import InputBox from '../../component/InputBox/InputBox';
import { styles } from './styles';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../Utils/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonBox from '../../component/ButtonBox/ButtonBox';
import { BLUE } from '../../constant/Colors';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation/stack/types/navigationType'
// import {getAuth, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import {getApp} from '@react-native-firebase/app';
import { supabase } from '../../lib/supabase'

const LoginScreen= () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  //  useEffect(() => {
  //   getData();
  // }, []);
  // const getData=async()=>{
  //   const usersData = await firestore().collection('users').get();
  //   console.log("data===",usersData.docs[0].data())

  // }

  const [inputState, setInputState] = useState<InputStateProps>({
    email: '',
    password: '',
  });
  const [errorState, setErrorState] = useState<ErrorStateProps>({
    emailError: '',
    passwordError: '',
  });
 
    const validateFields = (
    field: keyof InputStateProps,
    value: string,
    fromButtonPress = false,
  ) => {
    if (!value && !fromButtonPress) {
      // When typing and clearing field, hide error
      setErrorState(prev => ({
        ...prev,
        [`${field}Error`]: '',
      }));
      return;
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
    validateFields(field, value, false);
  };

   const inputBoxUIView = () => {
    return (
      <View style={styles.inputBoxContainer}>
        <View>
          <InputBox
            value={inputState?.email}
            placeholder="Enter your email"
            keyboardType="default"
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
              keyboardType="default"
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
  //   const onLoginClick= () => {
  //   const {email, password} = inputState;

  //   validateField('email', email, true);
  //   validateField('password', password, true);

  //   if (
  //     !email ||
  //     !password ||
  //     errorState.emailError ||
  //     errorState.passwordError
  //   ) {
  //     return;
  //   } else {
  //     const app = getApp();
  //     const auth = getAuth(app);
  //     signInWithEmailAndPassword(auth, email, password)
  //       .then(async (res) => {
  //         console.log('resulttttt==>', JSON.stringify(res))
  //         navigation.navigate("HomeScreen")
  //               })
  //       .catch(err => {console.log('Error', err.message)});
  //   }
  // };
 
     const onLoginClick= async() => {
    const {email, password} = inputState;

    validateField('email', email, true);
    validateField('password', password, true);

    if (
      !email ||
      !password ||
      errorState.emailError ||
      errorState.passwordError
    ) {
      return;
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('Signin error:', error.message);
    return null;
  }

  console.log('Signin successful:', data.user);
          navigation.navigate("HomeScreen")

    }
  };
 
 
  const loginText=()=>{
    return(
      <View>
        <Text style={{textAlign:"center",color:"black",fontWeight:"bold",fontSize:20}}>Login Here....</Text>
      </View>
    )
  }

 


  const buttonUIView = () => {
    return (
      <View style={styles.buttonContainer}>
        <ButtonBox
          title="LogIn"
          onPress={() => {
         onLoginClick()      
          }}
        />
        <View style={styles.signUpTextViewStyle}>
          <Text style={styles.signUpTextStyle}>
            Don't have account?{' '}
            <Text
              style={[styles.signUpTextStyle, {color: BLUE}]}
              onPress={() => {
               navigation.navigate("SignUpScreen")
              }}>
              SIGN-UP
            </Text>
          </Text>
        </View>
      </View>
    );
  };


  return (
  <SafeAreaView style={{ flex: 1, }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {loginText()}
              {inputBoxUIView()}
            </View>
            {buttonUIView()}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen