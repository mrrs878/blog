---
title: Docker-进阶
date: 2020-8-17 14:16:00
tags: Docker优化
categories: Docker删除
---

# 打包优化

- 缓存依赖

  1. 先 `COPY` 该命令的依赖文件，而不是所有文件
  2. 执行该命令

  如：

  ```shell
  FROM node
  
  RUN rm -rf /app
  RUN mkdir /app
  WORKDIR /app
  
  # 1. 先 COPY 该命令的依赖文件，而不是所有文件
  COPY package.json yarn.lock ./
  # 2. 执行该命令
  RUN yarn install
  
  COPY . .
  RUN yarn build
  
  EXPOSE 3000
  
  CMD [ "node", "dist/main" ]
  ```

  效果：

  ![Docker build优化](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/docker_build_0.png)

# 删除不用的镜像

- 删除悬空的镜像， `docker image prune -a -f`
- 删除悬空的容器，`docker container prune -f`