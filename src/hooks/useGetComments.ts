import { useEffect } from 'react';
import { message } from 'antd';
import useRequest from './useRequest';
import { GET_COMMENTS } from '../api/comment';
import store, { actions } from '../store';

export default function useGetComments(id = '', autoMsg = true) {
  const [, getCommentsRes, getComments, reGetComments] = useRequest<GetCommentsReqI, GetCommentsResI>(GET_COMMENTS, { id }, true);
  useEffect(() => {
    if (!getCommentsRes) return;
    if (autoMsg) message.info(getCommentsRes.msg);
  }, [getCommentsRes, autoMsg]);

  return [getCommentsRes, getComments, reGetComments];
}
