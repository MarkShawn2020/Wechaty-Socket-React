# 开发笔记

## 2020-09-30 15:03:15
- 解决koa的ip获取问题

## 2020-09-29 02:29:32
由于好友列表数据通过socket传输，加载实在太慢，所以还是考虑设计从客户端主动获取好友数据，这样形式也就更多样了，即可以通过数据库api，也可以通过socket，还可以直接从localStorage中读取。

目前打算，从localStorage读取。

> Wait!! Being a front end guy it seems to be difficult, but depolying your application on server is relatively easier than writing state management in redux.
>
> refer: https://www.loginradius.com/engineering/blog/react-app-deployment/
