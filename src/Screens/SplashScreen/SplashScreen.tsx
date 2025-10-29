import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation/stack/types/navigationType';
import Images from '../../constant/Images';
const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else {
        // No user signed in
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={Images.logo}
            style={{height:"70%",width:"70%"}}
            resizeMode="contain"
            //tintColor={tintColor}
          />   
     </View>
  );
};

export default SplashScreen;
