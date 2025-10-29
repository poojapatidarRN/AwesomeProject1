import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { styles } from "./styles";
import Images from "../../constant/Images";
import { PostProps } from "./types";
import CommentSheet from "../Comments/CommentSheet";
const PostLayout: React.FC<PostProps> = ({
  username,
  id, 
  avatar = Images.ic_demo_user_icon,
  image = Images.logo,
  caption,
  timeAgo,
  onPress,
  likeIcon = Images.likeIcon,
  dislikeIcon = Images.dislikeIcon,
  commentIcon = Images.comment,
  likeCount = 0,
  commentCount = 0,
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(likeCount);
  const [isCommentSheetVisible, setIsCommentSheetVisible] = useState<boolean>(false);

  const handleLikePress = async () => {
    try {
      const postRef = firestore().collection("posts").doc(id);

      if (liked) {
        // Unlike (decrement)
        setLiked(false);
        setLikesCount(prev => prev - 1);
        await postRef.update({
          likes: firestore.FieldValue.increment(-1),
        });
      } else {
        // Like (increment)
        setLiked(true);
        setLikesCount(prev => prev + 1);
        await postRef.update({
          likes: firestore.FieldValue.increment(1),
        });
      }
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  return (  
    <>

    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Image */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image source={image} style={styles.postImage} />
      </TouchableOpacity>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{caption}</Text>
      </View>

      {/* Like & Comment */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handleLikePress} style={styles.actionButton}>
          <Image
            source={liked ? likeIcon : dislikeIcon}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setIsCommentSheetVisible(true)}>
          <Image source={commentIcon} style={styles.actionIcon} />
          <Text style={styles.actionText}>{commentCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
     <CommentSheet
        visible={isCommentSheetVisible}
        onClose={() => setIsCommentSheetVisible(false)}
        postId={id}
        userName={username}
      />
    </>
  );
};

export default PostLayout;

