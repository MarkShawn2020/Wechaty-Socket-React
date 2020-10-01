// reference: https://github.com/microsoft/TypeScript/issues/17592

export enum EventSocket {
  /**
   * wechat
   */
  WX_SCAN = "scan",
  WX_MESSAGE = "message",
  WX_LOGIN = "login",
  WX_LOGOUT = "logout",
  WX_START = "start",
  WX_STOP = "stop",
  WX_FRIENDSHIP = "friendship",

  /**
   * socket-server，注意，连接是connected，断开是disconnect
   */
  SERVER_CONNECTION = "connection",
  SERVER_CONNECT = "connect",
  SERVER_DISCONNECT = "disconnect",
  SERVER_PUSH_STATUS = "server_status",
  SERVER_PUSH_USER_CHAT = "user_message",
  SERVER_WECHAT_READY = "server_wechat_ready",

  /**
   * socket-client
   */
  CLIENT_REQUEST_SERVER = "request_server",
  CLIENT_RELEASE_SERVER = "request_server_logout_self",
  CLIENT_REPLACE_SERVER = "request_server_logout_other",
  CLIENT_DAEMON_SERVER_OR_NOT = "daemon_server",
  CLIENT_REFRESH_CONTACTS = "request_contacts",
  CLIENT_SEND_USER_CHAT = "push_user_message",
  CLIENT_SEND_WX_MESSAGE = "send_message",
  CLIENT_SUBMIT_SETTINGS = "submit_settings",
}

/**
 * http
 */
export enum EventHttp {
  FETCH_FRIENDS = "fetch_friends",
  FETCH_MORE_FRIENDS = "fetch_more_friends",
  FETCH_MORE_FRIENDS_SUCCESS = "fetch_more_friends_success",
  FETCH_FRIENDS_SUCCESS = "fetch_friends_success",
  FETCH_FRIENDS_ERROR = "fetch_friends_error",
  FETCH_FRIENDS_COUNT_SUCCESS = "fetch_friends_count_success",
  FETCH_ROOMS_SUCCESS = "fetch_rooms_success",
  FETCH_ROOMS_ERROR = "fetch_rooms_error",
}

export enum EventBrowser {
  SWITCH_STATUS = "switch_status",
  UPDATE_USER = "update_user",
}

export type ActionTypes = EventSocket | EventBrowser | EventHttp
