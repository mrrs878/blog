## 个人博客
[![Build Status](https://www.travis-ci.org/mrrs878/blog.svg?branch=master)](https://www.travis-ci.org/mrrs878/blog)
![GitHub top language](https://img.shields.io/github/languages/top/mrrs878/blog)

## 优化

1. 缓存所有文章标题、摘要等数据加快首屏渲染

- 缓存位置：localstorage

- 缓存策略：根据`src/assets/markdown/articles`目录下文件数量来决定是否需要更新缓存

2. 缓存文章来加快文章加载速度

- 缓存位置localstorage

- 缓存策略：使用web worker请求GitHub开放接口获取仓库提交信息来决定是否需要更新缓存
