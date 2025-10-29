import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../Screens/Login/LoginScreen';
import SignUpScreen from '../../Screens/Signup/SignupScreen';
import HomeScreen from '../../Screens/DashBoard/HomeScreen';
import SplashScreen from '../../Screens/SplashScreen/SplashScreen';
import PostCreationScreen from '../../Screens/PostCreation/PostCreationScreen';
const stack=createStackNavigator()
const StackNavigator = () => {
  return (
    <NavigationContainer>
        <stack.Navigator>
     <stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
   <stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
    <stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/>
   <stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
   <stack.Screen name="PostCreationScreen" component={PostCreationScreen} options={{headerShown: false}}/>

        </stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator