import { sortBy } from 'ramda';
import store, { actions } from '../store';

const ARTICLE_MODULE = {
  async computeAllOverview(size?: number): Promise<Array<ArticleSubI>> {
    const requireContext = require.context('../assets/markdown/articles/', true);
    const allFileNames = requireContext.keys();
    const _size = size || allFileNames.length;
    const currentTag = localStorage.getItem('currentTag');
    // localStorage.setItem('currentTag', String(allFileNames.length));
    const info: {sorted: Array<ArticleSubI>, totalWord: number } = (!currentTag || (+currentTag) < allFileNames.length)
      ? await this.computeInfo(allFileNames.splice(0, _size))
      : { sorted: JSON.parse(localStorage.getItem('articleInfo') as string),
        totalWord: parseInt(localStorage.getItem('totalWord') || '0', 10) };
    store.dispatch({ type: actions.UPDATE_ARTICLE_INFO, data: info.sorted });
    store.dispatch({ type: actions.UPDATE_TOTAL_WORD, data: info.totalWord });
    return info.sorted;
  },
  computeInfo(fileNames: Array<string>): Promise<{sorted: Array<ArticleSubI>, totalWord: number }> {
    return new Promise((resolve) => {
      const articleInfo: Array<ArticleSubI> = [];
      let totalWord = 0;
      fileNames.forEach((item) => {
        const fileName = item.slice(2);
        import(`../assets/markdown/articles/${fileName}`).then((res) => {
          const info = res?.default?.split('---')[1]
            ?.replace(/\r\n/g, '')
            ?.replace(/\n/g, '')
            ?.match(/title:(.+)date:(.+)tags:(.+)categories:(.+)/) || [];
          const description = res?.default?.split('---')[2]
            ?.replace(/#+/g, '')
            ?.replace(/\*+/g, '')
            ?.replace(/```/g, '')
            ?.slice(0, 200);
          totalWord += res?.default.length || 0;
          const [title, createTime, tag, category] = info.slice(1, 5).map((infoItem: string) => infoItem.trimStart());
          articleInfo.push({ title, createTime, tag, category, description });
        });
      });
      setTimeout(() => {
        const sorted = sortBy((a) => new Date(a.createTime), articleInfo).reverse();
        localStorage.setItem('articleInfo', JSON.stringify(sorted));
        localStorage.setItem('totalWord', String(totalWord));
        resolve({ sorted, totalWord });
      });
    });
  },
};

export default ARTICLE_MODULE;
