export enum EventFromWechaty {
  BOT_SCAN = "scan",
  BOT_MESSAGE = "message",
  BOT_LOGIN = "login",
  BOT_LOGOUT = "logout",
  BOT_START = "start",
  BOT_STOP = "stop",
  BOT_FRIENDSHIP = "friendship",
}

/**
 * 除了wechaty的微信消息，我不想直接从服务器发送给client消息，毕竟不是群发，没必要
 */
export enum EventFromServer {
  ServerBackContacts = "server_back_contacts",
}

export enum EventFromClient {
  ClientRequestServer = "request_server",
  ClientReleaseServer = "release_server",
  ClientControlServerDaemon = "daemon_server",
  ClientControlServerDaemonCancel = "cancel_daemon_server",
  ClientDisconnect = "disconnect",
  ClientConnect = "connection",
  ClientRequestContacts = "request_contacts",
}
