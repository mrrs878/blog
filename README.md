# 个人博客

[![Build Status](https://www.travis-ci.org/mrrs878/blog.svg?branch=master)](https://www.travis-ci.org/mrrs878/blog)
![GitHub top language](https://img.shields.io/github/languages/top/mrrs878/blog)

## 部署/运行

### 手动

1. `git clone git@github.com:mrrs878/blog.git`

2. `yarn install && yarn start`

## Docker一键部署

1. 安装Docker

2. 安装docker compose

新建`blog`目录，复制`docker-compose.yml`至`blog`下，运行`docker-compose up -d`

## 优化

- 缓存所有文章标题、摘要等数据加快首屏渲染

  - 缓存位置：localstorage

  - 缓存策略：根据`src/assets/markdown/articles`目录下文件数量和Github提交记录来决定是否需要更新缓存

- 更新缓存细节

  1. 首次进入时使用缓存来加快界面渲染

  2. 主线程发送`getLastCommit`信号给`workers/index.ts`线程，子线程**立即开始**发送请求获取最后提交时间

  3. 主线程发送`computeCommit`信号给`workers/index.ts`线程，子线程开始**循环发送**请求获取最后提交时间
