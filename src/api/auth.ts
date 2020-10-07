import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/';

export const LOGIN = (data: LoginReqI): Promise<LoginResI> => ajax.post(`${BASE_URL}/auth/login`, data);
export const LOGOUT = (): Promise<LoginResI> => ajax.post(`${BASE_URL}/auth/logout`);
export const GET_USER_INFO = (): Promise<GetUserInfoResI> => ajax.get(`${BASE_URL}/auth/info`);
