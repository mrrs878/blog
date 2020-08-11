import ajax from '../tools/ajax';
import MAIN_CONFIG from '../config';

const { GITHUB_NAME, GITHUB_REPO } = MAIN_CONFIG;
const BASE_URL = 'https://api.github.com' || '';
const REPO_URL = `${BASE_URL}/repos/${GITHUB_NAME}/${GITHUB_REPO}`;

export const GET_FILE_HISTORY = (data: GetFileHistoryReqI): Promise<LoginResI> => ajax.get(
  `${REPO_URL}/commits?path=src/assets/markdown/articles/${encodeURIComponent(data.name)}.md`,
);
