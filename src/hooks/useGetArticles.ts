import { message } from 'antd';
import { useEffect } from 'react';
import { GET_ARTICLES } from '../api/article';
import store, { actions } from '../store';
import useRequest from './useRequest';

export default function useGetArticles(autoMsg = true, authFetch = false) {
  const [, getArticlesRes, getArticles] = useRequest<GetArticlesReqI, GetArticlesResI>(GET_ARTICLES, undefined, authFetch);
  useEffect(() => {
    if (!getArticlesRes) return;
    if (autoMsg) message.info(getArticlesRes.msg);
    if (getArticlesRes.success) store.dispatch({ type: actions.UPDATE_ARTICLE_INFO, data: getArticlesRes.data });
  }, [getArticlesRes, autoMsg]);

  return [getArticles];
}
