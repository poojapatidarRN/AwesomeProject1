import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../../Screens/SplashScreen';
const stack=createStackNavigator()
const StackNavigator = () => {
  return (
    <NavigationContainer>
        <stack.Navigator>
   <stack.Screen name="SplashScreen" component={SplashScreen}/>
        </stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator