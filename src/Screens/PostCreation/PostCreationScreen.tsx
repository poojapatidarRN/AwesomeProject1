import { View, Text, KeyboardAvoidingView, Keyboard, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import InputBox from '../../component/InputBox/InputBox'
import {PostErrorStateProps, PostInputStateProps} from './types';
import ButtonBox from '../../component/ButtonBox/ButtonBox'
import firestore from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../../Navigation/stack/types/navigationType'
import { useRoute, RouteProp } from '@react-navigation/native';

const PostCreationScreen = () => {
 const navigation = useNavigation<NavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'PostCreationScreen'>>();
const { userName } = route.params; 
 const [inputState, setInputState] = useState<PostInputStateProps>({
   discription : '',
  });
  const [errorState, setErrorState] = useState<PostErrorStateProps>({
    discriptionError: '',
  });

    const postText=()=>{
         return(
                <View>
                  <Text style={{textAlign:"center",color:"black",fontWeight:"bold",fontSize:20}}>please add details for the post creation...</Text>
                </View>
              )
    }

     const validateField = (
        field: keyof PostInputStateProps,
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
        if (field === 'discription') {
          if (!value) {
            if (fromButtonPress) {
              setErrorState(prev => ({...prev, discriptionError: 'discription is required'}));
            }
          } else {
            setErrorState(prev => ({...prev, discriptionError: ''}));
          }
        }

      };
    
      const onChangeTextValue = (field: keyof PostInputStateProps, value: string) => {
        setInputState(prev => ({...prev, [field]: value}));
        validateField(field, value, false);
      };
     const inputBoxUIView = () => {
    return (
      <View style={styles.inputBoxContainer}>
        <View>
          <InputBox
            value={inputState?.discription}
            placeholder="Enter Description"
            errorMessage={errorState?.discriptionError}
            onChangeText={text => {
              onChangeTextValue('discription', text);
            }}
          />
        </View>
       
      </View>
    );
  };
   
  const onClickDone = async () => {
  const { discription} = inputState;
  validateField('discription', discription, true);
  if (
    !discription ||
    errorState?.discriptionError
  ) {
    return;
  }

  try {
const currentUser= getAuth().currentUser;
await firestore().collection('posts').add({
    userId:currentUser.uid,
     userName:userName,
    description:discription,  
    createdAt: firestore.FieldValue.serverTimestamp(),
    likes: 0,
    comments:0
  });
    console.log('User data stored in Firestore ✅');
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  } catch (error: any) {
    console.log(error)
};
  }

const buttonUIView = () => {
    return (
      <View style={styles.buttonContainer}>
        <ButtonBox
          title="Done"
          onPress={() => {
           // onLogin();
           onClickDone()
          }}
        />
       
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
             <KeyboardAvoidingView
               style={{ flex: 1 }}
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                 <ScrollView
                   keyboardShouldPersistTaps="handled"
                   contentContainerStyle={{ flexGrow: 1 }}>
                   <View style={{ flex: 1, justifyContent: 'center' }}>
                     {postText()}
                     {inputBoxUIView()}
                   </View>
                   {buttonUIView()}
                 </ScrollView>
               </TouchableWithoutFeedback>
             </KeyboardAvoidingView>
           </SafeAreaView>
   
  )
}


export default PostCreationScreen
