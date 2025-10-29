import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import {styles} from "./styles"
type CommentSheetProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
  userName:string;
};

type Comment = {
  id: string;
  userName:string;
  text: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

const CommentSheet: React.FC<CommentSheetProps> = ({
  visible,
  onClose,
  postId,
  userName,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!postId) return;
  getCommentsList()
  }, [postId]);


 const getCommentsList=async()=>{
    const unsubscribe = firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }));
        setComments(list);
      });

    return () => unsubscribe();
 }
 const handleAddComment = async () => {
  if (!commentText.trim()) return;
  const currentUser = getAuth().currentUser;
  if (!currentUser) return;

  const newComment = {
    userName: userName,
    text: commentText.trim(),
    createdAt: firestore.Timestamp.now(),
  };

  try {
    // Optimistic UI update (shows instantly)
    setComments(prev => [
      { id: `temp-${Date.now()}`, ...newComment },
      ...prev,
    ]);

    setCommentText("");

    const postRef = firestore().collection("posts").doc(postId);
    const batch = firestore().batch();
    const newCommentRef = postRef.collection("comments").doc();

    batch.set(newCommentRef, {
      ...newComment,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    batch.update(postRef, {
      comments: firestore.FieldValue.increment(1),
    });

    await batch.commit();
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};



  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.4}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.title}>Comments</Text>

          {/* Comments List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentUser}>{item.userName}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noComments}>No comments yet</Text>
            }
          />

          {/* Input Area */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentSheet;

