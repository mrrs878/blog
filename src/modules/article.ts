import { sortBy } from 'ramda';
import store, { actions } from '../store';

const ARTICLE_MODULE = {
  async computeAllOverview(size?: number): Promise<Array<ArticleSubI>> {
    const requireContext = require.context('../assets/markdown/articles/', true);
    const allFileNames = requireContext.keys();
    const _size = size || allFileNames.length;
    const currentTag = localStorage.getItem('currentTag');
    // localStorage.setItem('currentTag', String(allFileNames.length));
    const info = (!currentTag || (+currentTag) < allFileNames.length)
      ? await this.computeInfo(allFileNames.splice(0, _size))
      : JSON.parse(localStorage.getItem('articleInfo') as string);
    store.dispatch({ type: actions.UPDATE_ARTICLE_INFO, data: info });
    return info;
  },
  computeInfo(fileNames: Array<string>): Promise<Array<ArticleSubI>> {
    return new Promise((resolve) => {
      const articleInfo: Array<ArticleSubI> = [];
      fileNames.forEach((item) => {
        const fileName = item.slice(2);
        import(`../assets/markdown/articles/${fileName}`).then((res) => {
          const [__, title, createTime, tag, category] = res?.default?.split('---')[1]
            ?.replace(/\r\n/g, '')
            ?.replace(/\n/g, '')
            ?.match(/title:(.+)date:(.+)tags:(.+)categories:(.+)/) || [];
          const description = res?.default?.split('---')[2]
            ?.replace(/#+/g, '')
            ?.replace(/\*+/g, '')
            ?.replace(/```/g, '')
            ?.slice(0, 200);
          articleInfo.push({ title, createTime, tag, category, description });
        });
      });
      setTimeout(() => {
        const sorted = sortBy((a) => new Date(a.createTime), articleInfo).reverse();
        localStorage.setItem('articleInfo', JSON.stringify(sorted));
        resolve(sorted);
      });
    });
  },
};

export default ARTICLE_MODULE;
