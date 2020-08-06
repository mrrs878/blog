const ARTICLE_MODULE = {
  computeAllOverview(size?: number) {
    const articleInfo: Array<any> = [];
    const requireContext = require.context('../assets/markdown/articles/', true);
    const _size = size || requireContext.keys().length;
    requireContext.keys().splice(0, _size).forEach((item) => {
      const fileName = item.slice(2);
      import(`../assets/markdown/articles/${fileName}`).then((res) => {
        const [str, title, createTime, tag, category] = res?.default?.split('---')[1]
          ?.replace(/\r\n/g, '')
          ?.match(/title:(.+)date:(.+)tags:(.+)categories:(.+)/) || [];
        const desc = res?.default?.split('---')[2]
          ?.replace(/#/g, '')
          ?.replace(/```/g, '')
          ?.slice(0, 200);
        articleInfo.push({ title, createTime, tag, category, desc });
      });
    });
    return articleInfo;
  },
};

export default ARTICLE_MODULE;
