import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../Screens/Login/LoginScreen';
import SignUpScreen from '../../Screens/Signup/SignupScreen';
import HomeScreen from '../../Screens/DashBoard/HomeScreen';
const stack=createStackNavigator()
const StackNavigator = () => {
  return (
    <NavigationContainer>
        <stack.Navigator>
   <stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
    <stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/>
   <stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>

        </stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator