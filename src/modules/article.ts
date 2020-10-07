/*
 * @Author: your name
 * @Date: 2020-08-24 18:55:48
 * @LastEditTime: 2020-09-28 10:00:05
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog\src\modules\article.ts
 */
import store, { actions } from '../store';
import { GET_ARTICLE, GET_ARTICLES } from '../api/article';

const ARTICLE_MODULE = {
  async getAllArticles() {
    const res = await GET_ARTICLES();
    console.log(res);

    store.dispatch({ type: actions.UPDATE_ARTICLE_INFO, data: res.data });
  },
  async GET_ARTICLES(data: GetArticlesReqI) {
    const res = await GET_ARTICLE(data);
    return res.data;
  },
};

export default ARTICLE_MODULE;
