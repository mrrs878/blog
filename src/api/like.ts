/*
 * @Author: your name
 * @Date: 2020-10-15 12:56:40
 * @LastEditTime: 2020-10-20 14:26:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog\src\api\like.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/';

export const LIKE = (data: LikeReqI): Promise<LikeResI> => ajax.post(`${BASE_URL}/like`, data);
export const UN_LIKE = (data: UnLikeReqI): Promise<UnLikeResI> => ajax.delete(`${BASE_URL}/like/${data.article_id}`);
export const GET_ARTICLE_LIKES = (data: GetArticleLikesReqI): Promise<GetLikesResI> => ajax.get(`${BASE_URL}/like/${data.id}`);
