/*
 * @Author: mrrs878
 * @LastEditors: Please set LastEditors
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/';

export const GET_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/article/1`);
export const GET_ARTICLE = (data: GetArticlesReqI): Promise<GetArticleResI> => ajax.get(`${BASE_URL}/article/${data.id}`);
