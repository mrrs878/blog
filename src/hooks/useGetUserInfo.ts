/*
 * @Author: your name
 * @Date: 2020-10-09 09:57:25
 * @LastEditTime: 2020-10-20 16:02:38
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog\src\hooks\useGetUserInfo.ts
 */
import { useEffect } from 'react';
import { message } from 'antd';
import useRequest from './useRequest';
import store, { actions } from '../store';
import { GET_USER_INFO } from '../api/auth';
import MAIN_CONFIG from '../config';

export default function useGetUserInfo(autoMsg = true, authFetch = false) {
  const [, getUsersRes, getUsers] = useRequest<GetUserInfoReqI, GetUserInfoResI>(GET_USER_INFO, undefined, authFetch);
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
