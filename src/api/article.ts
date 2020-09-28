/*
 * @Author: mrrs878
 * @LastEditors: Please set LastEditors
 */
/*
 * @Author: mrrs878
 * @LastEditors: mrrs878
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/';

export const GET_ARTICLES = () => ajax.get(`${BASE_URL}/article/all`);
export const GET_ARTICLE = (data: GetArticleReqI) => ajax.get(`${BASE_URL}/article/${data.id}`)
