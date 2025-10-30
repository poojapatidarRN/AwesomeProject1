import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useState} from 'react';
import {getApp} from '@react-native-firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import {BLUE} from '../../constant/Colors';
import InputBox from '../../component/InputBox/InputBox';
import ButtonBox from '../../component/ButtonBox/ButtonBox';
import {EMAIL_REGEX, PASSWORD_REGEX} from '../../Utils/Utils';
import {styles} from './Styles';
import {ErrorStateProps, InputStateProps} from './types';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation/stack/types/navigationType'
import { supabase } from '../../lib/supabase'


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

  // const onSignUpClick = async () => {
  //   const {name, email, password} = inputState;
  //   validateField('name', name, true);
  //   validateField('email', email, true);
  //   validateField('password', password, true);
  //   if (
  //     !name ||
  //     !email ||
  //     !password ||
  //     errorState.nameError ||
  //     errorState.emailError ||
  //     errorState.passwordError
  //   ) {
  //     return;
  //   }
  //     const app = getApp();
  //     const auth = getAuth(app);
  //     const userCred = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     ).then(() => {
  //   console.log('User account created & signed in!');
  //   console.log("user======>",userCred)
  //      navigation.navigate("HomeScreen")

  // })
  // .catch(error => {
  //   if (error.code === 'auth/email-already-in-use') {
  //     console.log('That email address is already in use!');
  //   }

  //   if (error.code === 'auth/invalid-email') {
  //     console.log('That email address is invalid!');
  //   }

  //   console.error(error);
  // });

  // };

  const onSignUpClick = async () => {
    const {name, email, password} = inputState;
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, 
    },
  })
  if (error) {
    console.error('Signup error:', error.message)
  } else {
    console.log('Signup success:', data)
     navigation.navigate("HomeScreen")
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

    const SignUpText=()=>{
      return(
        <View>
          <Text style={{textAlign:"center",color:"black",fontWeight:"bold",fontSize:20}}>Signup Here....</Text>
        </View>
      )
    }
  //-----UI BLOCK-----//

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
