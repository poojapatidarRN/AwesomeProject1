export type PostInputStateProps = {
  discription:any;
};
export type PostErrorStateProps = {
 discriptionError: string;
};
export type PostProps = {
   id: string;
  username: string;
  avatar: any;
  image: any;
  caption: string;
  timeAgo: string;
  onPress?: () => void;
  likeIcon: any;
  dislikeIcon: any;
  commentIcon: any;
  shareIcon: any;
};
