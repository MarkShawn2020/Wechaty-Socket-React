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
  ServersNow = "servers_now",
  ClientsNow = "clients_now",
  ClientConnected = "server_clients_added",
  ClientDisconnected = "server_clients_disconnected",
  ServerDisconnected = "disconnected",
  ServerConnected = "connected",
}

export enum EventFromClient {
  ClientRequestServer = "request_server",
  ClientRequestServerLogoutSelf = "request_server_logout_self",
  ClientRequestServerLogoutOther = "request_server_logout_other",
  ClientControlServerDaemon = "daemon_server",
  ClientControlServerDaemonCancel = "cancel_daemon_server",
  ClientDisconnect = "disconnect",
  ClientConnect = "connection",
  ClientRequestContacts = "request_contacts",
}
