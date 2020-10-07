interface GetFileHistoryReqI {
  name: string,
}

interface GetArticlesReqI {
  id: string;
}

interface LoginReqI {
  name: string;
  password: string;
}

interface GetUserInfoReqI {
}

interface GetCommentReqI {
  id: string
}

interface AddCommentReqI {
  name: string;
  user_id: string;
  content: string;
  article_id: string;
  avatar: string;
}

interface GetCommentsReqI {
  id: string;
}
