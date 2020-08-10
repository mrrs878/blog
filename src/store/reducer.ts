import { combineReducers } from 'redux';

import ActionsT from './types';
import { DEFAULT_COMMON_STATE } from './state';
import * as actions from './actions';

function commonReducer(state = DEFAULT_COMMON_STATE, action: ActionsT): CommonStateI {
  switch (action.type) {
    case actions.ADD_COUNT:
      return { ...state, count: action.data };
    case actions.UPDATE_ARTICLE_INFO:
      return { ...state, articleInfo: action.data };
    case actions.UPDATE_TOTAL_WORD:
      return { ...state, totalWord: action.data };
    default:
      return state;
  }
}

const rootReducer = combineReducers({ common: commonReducer });

export default rootReducer;
