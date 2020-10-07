import { useEffect } from 'react';
import { message } from 'antd';
import useRequest from './useRequest';
import store, { actions } from '../store';
import { GET_USER_INFO } from '../api/auth';
import MAIN_CONFIG from '../config';

export default function useGetUserInfo(autoMsg = true) {
  const [, getUsersRes, getUsers] = useRequest<GetUserInfoReqI, GetUserInfoResI>(GET_USER_INFO, undefined, false);
  useEffect(() => {
    if (!getUsersRes) return;
    if (autoMsg) message.info(getUsersRes.msg);
    if (getUsersRes.success) {
      const { name, _id, role } = getUsersRes.data;
      const token = localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || '';
      store.dispatch({ type: actions.UPDATE_USER, data: { name, _id, role, token } });
    }
  }, [getUsersRes, autoMsg]);

  return [getUsers];
}
