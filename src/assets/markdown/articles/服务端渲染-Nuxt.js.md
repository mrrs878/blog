---
title: 服务端渲染-Nuxt.js
date: 2020-7-28 11:15:28
tags: SSR
categories: 服务端渲染
---

# Nuxt.js@2.13.6入门

# 安装(推荐使用官方脚手架)

`yarn create nuxt-app <project name>`

# 注意点

1. 服务端只渲染需要做SEO的部分来加快访问速度

# 性能优化

1. 如果网关已启用gzip则关闭框架自带压缩

    ```js
    // nuxt.config.js
    render: {
      compressor: false
    }
    ```

2. 缓存页面(`lru-cache`)

    ```js
    // serverMiddleware/pageCache.js
    const LRU = require('lru-cache')
    const cachePage = new LRU({
      max: 100,
      maxAge: 1000 * 60
    })
    export default function (req, res, next) {
      const url = req._parsedOriginalUrl
      const pathname = url.pathname
      if (['/selectGame/1'].includes(pathname)) {
        const existsHtml = cachePage.get('selectGameData')
        if (existsHtml) {
          return res.end(existsHtml.html, 'utf-8')
        } else {
          res.original_end = res.end
          res.end = function (data) {
            if (res.statusCode === 200) {
              cachePage.set('selectGameData', { html: data })
            }
            res.original_end(data, 'utf-8')
          }
        }
      }
      next()
    }
    ```
