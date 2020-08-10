import * as actions from './actions';

type ActionTypeT<T, P> = {
  type: T,
  data: P,
};

type IncreaseCountT = ActionTypeT<actions.ADD_COUNT, number>;
type UpdateArticleInfoT = ActionTypeT<actions.UPDATE_ARTICLE_INFO, Array<ArticleSubI>>;
type UpdateTotalWord = ActionTypeT<actions.UPDATE_TOTAL_WORD, number>;

type ActionsT = IncreaseCountT | UpdateArticleInfoT | UpdateTotalWord;

export default ActionsT;
