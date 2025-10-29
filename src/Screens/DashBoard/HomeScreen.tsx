import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonBox from '../../component/ButtonBox/ButtonBox';
import { styles } from '../Signup/Styles';
import {
  FirebaseAuthTypes,
  getAuth,
  signOut,
} from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation/stack/types/navigationType';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { LIGHT_PINK } from '../../constant/Colors';
import PostLayout from '../PostCreation/PostLayout';
import Images from '../../constant/Images';
type Post = {
  id: string;
  userId: string;
  userName: string;
  description: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp | null;
  likes: number;
};
const HomeScreen = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    getUserData();
    getPostData()
  },[]);

  const getUserData = async (): Promise<void> => {
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        console.log('No user logged in');
        setUserName(null);
        setLoading(false);
        return;
      }

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('User data:', data);
        setUserName(data?.name ?? 'Unknown User');
      } else {
        console.log('No user data found in Firestore');
        setUserName('User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  const getPostData=()=>{
     const unsubscribe = firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const postList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postList);
      console.log("postData@@@a====",posts)
      setLoading(false);
    });

  return () => unsubscribe();
  }

  const onLogOutClick = async () => {
    const auth = getAuth();
    await signOut(auth);
    console.log('User signed out!');
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const buttonUIView = () => {
    return (
      <View style={styles.buttonContainer}>
        <ButtonBox
          title="LogOut"
          onPress={() => {
            onLogOutClick();
          }}
        />
      </View>
    );
  };

  const postCreateBtnView = () => {
    return (
      <View style={styles.buttonContainer}>
        <ButtonBox
          title="Create Post"
          onPress={() => {
            createPost();
          }}
        />
      </View>
    );
  };
  const createPost = () => {
    navigation.navigate('PostCreationScreen', { userName });
  };
  const getTimeAgo = (timestamp?: FirebaseFirestoreTypes.Timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const postDate = timestamp.toDate();
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

  const postList = () => {
    return (
      <FlatList
      data={posts} 
      keyExtractor={(item:any) => item.id}
      renderItem={({ item }) => {
         return (
         <PostLayout
            id={item.id}
           username={item.userName}
           caption={item.description}
           likeCount={item.likes}
         commentCount={item?.comments}
         timeAgo={getTimeAgo(item.createdAt)}     
         />
         )
      }}
    />
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_PINK }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          Hello,{userName}
        </Text>
      </View>
      {postCreateBtnView()}
      {buttonUIView()}
      {postList()}
    </SafeAreaView>
  );
};

export default HomeScreen;
