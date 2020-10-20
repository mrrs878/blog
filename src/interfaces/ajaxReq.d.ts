/*
 * @Author: your name
 * @Date: 2020-10-09 19:52:09
 * @LastEditTime: 2020-10-20 14:57:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog\src\interfaces\ajaxReq.d.ts
 */
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
  creator_id: string;
  content: string;
  article_id: string;
  avatar: string;
}

interface GetCommentsReqI {
  id: string;
}

interface LikeReqI {
  article_id: string;
}

interface UnLikeReqI {
  article_id: string;
}

interface GetArticleLikesReqI {
  id: string
}
