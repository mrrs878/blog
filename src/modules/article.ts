const ARTICLE_MODULE = {
  computeAllOverview() {
    const requireContext = require.context('../assets/markdown/articles/', true);
    requireContext.keys().forEach((item) => {
      const title = item.slice(2);
      console.log(title)
    });
  },
};

export default ARTICLE_MODULE;
