import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { styles } from "./styles";

type CommentSheetProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
  userName: string;
};

type Comment = {
  id: string;
  userName: string;
  text: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  userId: string;
};

const CommentSheet: React.FC<CommentSheetProps> = ({
  visible,
  onClose,
  postId,
  userName,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentUser = getAuth().currentUser;

  // 🔹 Realtime listener
  useEffect(() => {
    if (!postId) return;
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
  }, [postId]);

  // 🔹 Add new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUser) return;

    const newComment = {
      userId: currentUser.uid,
      userName: userName,
      text: commentText.trim(),
      createdAt: firestore.Timestamp.now(),
    };

    try {
      // Optimistic UI
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

  // 🔹 Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!postId || !commentId) return;
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const postRef = firestore().collection("posts").doc(postId);
            const commentRef = postRef.collection("comments").doc(commentId);

            const batch = firestore().batch();
            batch.delete(commentRef);
            batch.update(postRef, {
              comments: firestore.FieldValue.increment(-1),
            });

            await batch.commit();
          } catch (error) {
            console.error("Error deleting comment:", error);
          }
        },
      },
    ]);
  };

  // 🔹 Edit comment
  const handleEditComment = (comment: Comment) => {
    setEditingId(comment.id);
    setCommentText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editingId || !commentText.trim()) return;

    try {
      const commentRef = firestore()
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(editingId);

      await commentRef.update({
        text: commentText.trim(),
      });

      setEditingId(null);
      setCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
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
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{item.userName}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>

                {item.userId === currentUser?.uid && (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => handleEditComment(item)}
                      style={{ marginRight: 10 }}
                    >
                      <Text style={{ color: "#007AFF", fontWeight: "500" }}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteComment(item.id)}
                    >
                      <Text style={{ color: "red", fontWeight: "500" }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
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
              placeholder={
                editingId ? "Edit your comment..." : "Add a comment..."
              }
              placeholderTextColor="#888"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={editingId ? handleUpdateComment : handleAddComment}
            >
              <Text style={styles.sendText}>
                {editingId ? "Update" : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentSheet;

