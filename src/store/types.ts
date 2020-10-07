import * as actions from './actions';

type ActionTypeT<T, P> = {
  type: T,
  data: P,
};

type IncreaseCountT = ActionTypeT<actions.ADD_COUNT, number>;
type UpdateArticleInfoT = ActionTypeT<actions.UPDATE_ARTICLE_INFO, Array<ArticleSubI>>;
type UpdateTotalWord = ActionTypeT<actions.UPDATE_TOTAL_WORD, number>;
type UpdateUserT = ActionTypeT<actions.UPDATE_USER, UserI>;
type UpdateComments = ActionTypeT<actions.UPDATE_COMMENTS, Array<CommentI>>;

type ActionsT = IncreaseCountT | UpdateArticleInfoT | UpdateTotalWord | UpdateUserT | UpdateComments;

export default ActionsT;
