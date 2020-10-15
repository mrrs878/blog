/*
 * @Author: your name
 * @Date: 2020-10-09 09:57:25
 * @LastEditTime: 2020-10-15 14:08:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog\src\interfaces\ajaxRes.d.ts
 */
interface BaseResI<T> {
  success: boolean;
  code: number;
  data: T;s
  msg: string;
}

interface LoginResI extends BaseResI<UserI>{
}
interface GetInfoByTokenResI extends BaseResI<UserI>{
}
interface LogoutResI extends BaseResI<any>{
}
interface GetMenusResI extends BaseResI<Array<MenuItemI>>{
}

interface GetDictsResT extends BaseResI<Array<DictI>>{
}

interface GetDictResT extends BaseResI<DictI>{
}

interface GetDashboardDataResI extends BaseResI<Array<DashboardDataI>>{
}

interface GetArticlesResI extends BaseResI<Array<ArticleI>>{
}

interface GetArticleResI extends BaseResI<ArticleI>{
}

interface GetUserInfoResI extends BaseResI<UserI> {}

interface GetCommentsResI extends BaseResI<Array<CommentI>> {}

interface GetCommentResI extends BaseResI<CommentI> {}

interface AddCommentResI extends BaseResI<CommentI> {}

interface LikeResI extends BaseResI<any> {}

interface UnLikeResI extends BaseResI<any> {}

interface GetLikesResI extends BaseResI<Array<LikeI>> {}
