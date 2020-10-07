import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/';

export const GET_COMMENTS = (data: GetCommentsReqI): Promise<GetCommentsResI> => ajax.get(`${BASE_URL}/comment/${data.id}`);
export const ADD_COMMENT = (data: AddCommentReqI): Promise<AddCommentResI> => ajax.post(`${BASE_URL}/comment`, data);
