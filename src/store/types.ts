import * as actions from './actions';

type ActionTypeT<T, P> = {
  type: T,
  data: P,
};

type IncreaseCountT = ActionTypeT<actions.ADD_COUNT, number>;
type UpdateArticleInfoT = ActionTypeT<actions.UPDATE_ARTICLE_INFO, Array<ArticleSubI>>;

type ActionsT = IncreaseCountT | UpdateArticleInfoT;

export default ActionsT;
