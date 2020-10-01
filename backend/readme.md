# 后端

## 需求分析

当用户打开网站页面，浏览器（以下称client）将自动新建一个WebSocket对象，与服务器端通信。

首先，这个WebSocket只是一个载体，它是不可信的， 除非它携带一些其他信息，例如cookie之类的。这是可以的，参照：https://socket.io/docs/server-api/#socket-request。 具体代码如下：
```js
const cookie = require('cookie');

io.on('connection', (socket) => {
  const cookies = cookie.parse(socket.request.headers.cookie || '');
});
```

因此，我们首先从cookie中解析client的用户标识，如果什么都没有，则表明是一个陌生访客，它将只有申请使用闲置token的权利。否则，它将可以使用对应token的数据，因此这里应当有一个接口，即，给定cookie的值，返回一个结果。

这个结果，我认为应该是启动一个机器人对象，类似服务器申请那样。一旦启动之后，这个机器人能够一直存在，除非被强制下线或者主动下线。并且当用户在以后的一段时间内再次登录浏览器，如果这个机器人还在，则还能继续使用。

基于此，我们应该设计一个SocketBot类，这个类能够自由绑定任何一个client，只要该client的cookie值是与其对应的，并且，事实上，它应该允许绑定多个socket，假设一个人既用手机也用电脑登录的话。

那这个类应该如何设计呢？它的属性、它的方法、它的构造究竟应该怎样。

我们认为，既然cookie中的某一项值能够唯一标识它，那么它应该需要有一个id，所有的人通过id去唯一的认领这个机器人。为了能够让一个puppet支持多个id的链接，显然这个id就不能以token去命名，于是乎我们想到，它可以是一个username字样的值，用以唯一表示，其他人的id不得与它相同。

所以，这样我们就知道这个SocketBot它应该首先有一个name字段，它在系统中是唯一的。有了这个name字段之后，每当浏览器打开之后默认只是一个简单的socket，一旦它申请认领bot，则会基于它的token生成一个bot实例，因此它应该具备initBot的方法。

所以正确的做法应该是这样，就像一个咸鱼市场，当用户打开浏览器后首先看到的是一排机器人服务器（事实上目前只有一台），这些服务器会显示是否正在忙碌，空闲的服务器将提供给用户点击申请的机会。

一旦能够点击，client将会向server发送一个申请资源的信号，此时一个微信机器人就开始创建，并且它接收这个client作为自己sockets之一。

基于此，SocketBot的定义如下：
- 属性
    - username
    - token
    - isFree
    - isIdle
    - stats
    - clients(Socket[])
- 方法
    - constructor
    - onClientConnected(connect)
    - dropSocket(disconnect)
    - sendMessage(to all)
    - sendScan(to all)
    - ...(to all)
    
再来思考一下这个constructor的问题，当初始化的时候有两样是必须要填的，token和name，name我们已经确定了从何而来，但是对于token，我们如何管理资源是个问题。
我们或许可以这样，我们把token分成两组，free和charged，我们直接创建一个简单的初始化类用以声明所有的SocketBot对象。

对于用户来说，首先要维护一张表，包含这些对应关系


username|token|isFree|isIdle|clients|stats|
|----|----|---|---|---|---|
小成时光屋|xxx|tree|tree|0|0
