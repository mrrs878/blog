import axios from 'axios';
import { clone } from 'ramda';
import MAIN_CONFIG from '../config';

const ajax = axios.create({
  timeout: 12000,
});

ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.Authorization = `Bearer ${localStorage.getItem(MAIN_CONFIG.TOKEN_NAME)}`;
  return tmp;
});
ajax.interceptors.response.use(async (response) => {
  if ([401].includes(response.data.code)) {
    localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
    // await message.error('登录信息失效');
    // window.location.href = '/auth/login';
    return;
  }
  return Promise.resolve(response.data);
}, (error: any) => {
  console.log(error);
  return Promise.resolve(error);
});

export default ajax;
